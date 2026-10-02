import { chatInstruction } from "@/lib/chat-context";
import { ChatError, connectionError, geminiEvents, openGeminiStream, parseChatRequest } from "@/lib/gemini-chat";

export const runtime = "nodejs";
export const maxDuration = 60;

const headers = { "Cache-Control": "no-store" };
// A bounded, per-process guard for this demo. Production replicas need a shared limiter.
const windows = new Map<string, { count: number; expires: number }>();
let active = 0;
function allow(request: Request) {
  const now = Date.now();
  for (const [key, item] of windows) if (item.expires <= now) windows.delete(key);
  const client = request.headers.get("x-forwarded-for")?.split(",")[0].trim().slice(0, 80) || "local";
  const window = windows.get(client) ?? { count: 0, expires: now + 60_000 };
  if (window.count >= 12 || active >= 8 || (!windows.has(client) && windows.size >= 500)) return false;
  window.count++; windows.set(client, window);
  return true;
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if ((origin && origin !== new URL(request.url).origin) || request.headers.get("sec-fetch-site") === "cross-site") {
    return Response.json({ code: "invalid_request" }, { status: 403, headers });
  }
  let input;
  try {
    if (!request.headers.get("content-type")?.includes("application/json")) throw new ChatError("invalid_request", 400);
    if (Number(request.headers.get("content-length")) > 160_000) throw new ChatError("invalid_request", 413);
    // Read with a byte cap even when Content-Length is absent or forged.
    const reader = request.body?.getReader();
    if (!reader) throw new ChatError("invalid_request", 400);
    const decoder = new TextDecoder(); let body = ""; let bytes = 0;
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        bytes += value.length;
        if (bytes > 160_000) { await reader.cancel(); throw new ChatError("invalid_request", 413); }
        body += decoder.decode(value, { stream: true });
      }
      body += decoder.decode();
    } finally { reader.releaseLock(); }
    input = parseChatRequest(JSON.parse(body));
  } catch (error) {
    return Response.json({ code: "invalid_request" }, { status: error instanceof ChatError ? error.status : 400, headers });
  }
  const key = process.env.GEMINI_API_KEY?.trim() ?? "";
  if (!key) return Response.json({ code: "not_configured" }, { status: 503, headers });
  if (!allow(request)) return Response.json({ code: "rate_limit" }, { status: 429, headers: { ...headers, "Retry-After": "60" } });

  const abort = new AbortController();
  const signal = AbortSignal.any([request.signal, abort.signal, AbortSignal.timeout(55_000)]);
  active++;
  let released = false;
  const release = () => { if (!released) { released = true; active--; } };
  try {
    const upstream = await openGeminiStream({ key, model: process.env.GEMINI_MODEL?.trim() || "gemini-3.8-flash", instruction: chatInstruction(input.lang), messages: input.messages, signal });
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of geminiEvents(upstream)) {
            if (signal.aborted) break;
            controller.enqueue(encoder.encode(JSON.stringify(event) + "\n"));
          }
          if (!signal.aborted) controller.close();
          else if (!request.signal.aborted && !abort.signal.aborted) {
            controller.enqueue(encoder.encode(JSON.stringify({ type: "error", code: "timeout" }) + "\n"));
            controller.close();
          }
        } catch (error) {
          if (!request.signal.aborted && !abort.signal.aborted) {
            const code = signal.aborted ? "timeout" : connectionError(error).code;
            controller.enqueue(encoder.encode(JSON.stringify({ type: "error", code }) + "\n"));
            controller.close();
          }
        } finally { release(); }
      },
      cancel() { abort.abort(); release(); },
    });
    return new Response(stream, { headers: { ...headers, "Content-Type": "application/x-ndjson; charset=utf-8", "X-Accel-Buffering": "no" } });
  } catch (error) {
    release();
    const failure = signal.aborted ? new ChatError("timeout", 504) : connectionError(error);
    return Response.json({ code: failure.code }, { status: failure.status, headers });
  }
}
