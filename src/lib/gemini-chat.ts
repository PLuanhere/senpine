import { CHAT_HISTORY_LIMIT, CHAT_INPUT_LIMIT, readStreamLines, type ChatEvent, type ChatTurn } from "./chat-protocol";

export class ChatError extends Error {
  constructor(public code: string, public status = 502) { super(code); }
}

// Never return fetch messages/URLs or upstream bodies, which can contain credentials.
export function connectionError(error: unknown): ChatError {
  if (error instanceof ChatError) return error;
  const failure = error as { name?: string; code?: string; cause?: { code?: string } } | null;
  const code = failure?.cause?.code ?? failure?.code;
  if (failure?.name === "TimeoutError" || code === "UND_ERR_CONNECT_TIMEOUT") return new ChatError("timeout", 504);
  if (code === "EACCES" || code === "EPERM") return new ChatError("network_blocked", 503);
  if (code === "ENOTFOUND" || code === "EAI_AGAIN") return new ChatError("dns_failure", 503);
  if (code?.includes("CERT") || code?.startsWith("ERR_TLS") || code === "UNABLE_TO_VERIFY_LEAF_SIGNATURE" || code === "DEPTH_ZERO_SELF_SIGNED_CERT") {
    return new ChatError("tls_failure", 503);
  }
  return new ChatError("unavailable");
}

export function parseChatRequest(value: unknown): { messages: ChatTurn[]; lang: "vi" | "en" } {
  if (!value || typeof value !== "object") throw new ChatError("invalid_request", 400);
  const { messages, lang } = value as { messages: unknown; lang: unknown };
  if (!Array.isArray(messages) || !messages.length || messages.length > CHAT_HISTORY_LIMIT || (lang !== "vi" && lang !== "en")) {
    throw new ChatError("invalid_request", 400);
  }
  let total = 0;
  const turns = messages.map((message, index): ChatTurn => {
    if (!message || typeof message !== "object") throw new ChatError("invalid_request", 400);
    const { role, text } = message;
    const expected = index % 2 === 0 ? "user" : "assistant";
    if (role !== expected || typeof text !== "string" || !text.trim() || text.length > (role === "user" ? CHAT_INPUT_LIMIT : 12000)) {
      throw new ChatError("invalid_request", 400);
    }
    total += text.length;
    return { role, text: text.trim() };
  });
  if (total > 36000 || turns.at(-1)?.role !== "user") throw new ChatError("invalid_request", 400);
  return { messages: turns, lang };
}

export function upstreamError(status: number) {
  if (status === 401 || status === 403 || status === 400) return new ChatError("configuration", 503);
  if (status === 404) return new ChatError("model_unavailable", 503);
  if (status === 429) return new ChatError("rate_limit", 429);
  return new ChatError("unavailable", 502);
}

export async function openGeminiStream(options: {
  key: string; model: string; instruction: string; messages: ChatTurn[]; signal: AbortSignal;
  fetcher?: typeof fetch;
}): Promise<ReadableStream<Uint8Array>> {
  if (!options.key.trim()) throw new ChatError("not_configured", 503);
  if (!/^gemini-[a-z0-9.-]+$/.test(options.model)) throw new ChatError("configuration", 503);
  const response = await (options.fetcher ?? fetch)(
    `https://generativelanguage.googleapis.com/v1beta/models/${options.model}:streamGenerateContent?alt=sse`, {
      method: "POST", cache: "no-store", signal: options.signal,
      headers: { "Content-Type": "application/json", "x-goog-api-key": options.key },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: options.instruction }] },
        contents: options.messages.map(({ role, text }) => ({ role: role === "assistant" ? "model" : "user", parts: [{ text }] })),
        generationConfig: { maxOutputTokens: 4096, ...(options.model.startsWith("gemini-3") ? { thinkingConfig: { thinkingLevel: "low" } } : {}) },
      }),
    },
  );
  if (!response.ok) {
    await response.body?.cancel();
    throw upstreamError(response.status);
  }
  if (!response.body) throw new ChatError("unavailable");
  return response.body;
}

type GeminiChunk = {
  error?: unknown;
  promptFeedback?: { blockReason?: string };
  candidates?: { finishReason?: string; content?: { parts?: { text?: string; thought?: boolean }[] } }[];
};

export async function* geminiEvents(stream: ReadableStream<Uint8Array>): AsyncGenerator<ChatEvent> {
  let size = 0;
  let finished = false;
  let data: string[] = [];
  function parse(): ChatEvent[] {
    if (!data.length) return [];
    const payload = data.join("\n"); data = [];
    if (payload === "[DONE]") return [];
    let chunk: GeminiChunk;
    try { chunk = JSON.parse(payload); } catch { throw new ChatError("unavailable"); }
    if (chunk.error) throw new ChatError("unavailable");
    const candidate = chunk.candidates?.[0];
    if (chunk.promptFeedback?.blockReason || (candidate?.finishReason && !["STOP", "MAX_TOKENS"].includes(candidate.finishReason))) {
      throw new ChatError("blocked", 422);
    }
    if (candidate?.finishReason) finished = true;
    const text = candidate?.content?.parts?.filter((part) => !part.thought).map((part) => part.text ?? "").join("") ?? "";
    size += text.length;
    if (size > 12000) throw new ChatError("response_too_long");
    return text ? [{ type: "text", text }] : [];
  }
  for await (const line of readStreamLines(stream)) {
    if (!line) { for (const event of parse()) yield event; }
    else if (line.startsWith("data:")) data.push(line.slice(5).trimStart());
  }
  for (const event of parse()) yield event;
  if (!size) throw new ChatError("empty_response");
  if (!finished) throw new ChatError("interrupted");
  yield { type: "done" };
}
