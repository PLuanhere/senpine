export type ChatTurn = { role: "user" | "assistant"; text: string };
export type ChatEvent = { type: "text"; text: string } | { type: "done" } | { type: "error"; code: string };
export const CHAT_INPUT_LIMIT = 2000;
export const CHAT_HISTORY_LIMIT = 21;

// Streaming boundaries can split a line and even a Vietnamese UTF-8 character.
export async function* readStreamLines(stream: ReadableStream<Uint8Array>): AsyncGenerator<string> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let ended = false;
  try {
    while (true) {
      const { value, done } = await reader.read();
      buffer += done ? decoder.decode() : decoder.decode(value, { stream: true });
      let newline: number;
      while ((newline = buffer.indexOf("\n")) !== -1) {
        yield buffer.slice(0, newline).replace(/\r$/, "");
        buffer = buffer.slice(newline + 1);
      }
      if (buffer.length > 256_000) throw new Error("Stream line too large");
      if (done) { ended = true; break; }
    }
    if (buffer) yield buffer.replace(/\r$/, "");
  } finally {
    if (!ended) await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}
