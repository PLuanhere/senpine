"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowDown, ArrowUpRight, Leaf, MessageCircle, RotateCcw, Send, Square, X } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { useMotion } from "@/lib/motion-context";
import { CHAT_INPUT_LIMIT, readStreamLines, type ChatEvent, type ChatTurn } from "@/lib/chat-protocol";

type Message = ChatTurn & { id: string; state: "complete" | "streaming" | "error" | "stopped"; code?: string };
const copy = {
  vi: {
    launcher: "Hỏi SenPine", title: "Trợ lý SenPine", close: "Đóng khung chat", clear: "Cuộc trò chuyện mới",
    welcome: "Một câu hỏi,\nmột kết nối mới.", intro: "Cùng tìm hiểu chất liệu, thiết kế và câu chuyện SenPine.",
    prompts: ["SenPine có những vật liệu nào?", "Truy xuất nguồn gốc như thế nào?", "Có những vị trí tuyển dụng nào?", "Tôi muốn tìm hiểu bộ mẫu vải"],
    promptLabels: ["Khám phá vật liệu", "Cách truy xuất", "Vị trí tuyển dụng", "Tìm hiểu bộ mẫu"],
    placeholder: "Bạn muốn tìm hiểu điều gì?", input: "Tin nhắn cho trợ lý SenPine", send: "Gửi tin nhắn", stop: "Dừng trả lời", retry: "Thử lại",
    waiting: "Đang tìm câu trả lời…", streaming: "Đang trả lời…", stopped: "Đã dừng câu trả lời.", done: "Đã trả lời.",
    note: "Trợ lý AI · Nội dung đề án mang tính định hướng.", privacy: "Tin nhắn được gửi đến dịch vụ AI để tạo câu trả lời. Tránh chia sẻ thông tin nhạy cảm.",
    newMessages: "Xem tin nhắn mới", you: "Bạn", assistant: "SenPine AI", enter: "Enter để gửi · Shift + Enter để xuống dòng", clearNote: "Xóa hội thoại hiện tại và bắt đầu lại",
  },
  en: {
    launcher: "Ask SenPine", title: "SenPine Assistant", close: "Close chat", clear: "New conversation",
    welcome: "A little question,\na new connection.", intro: "Explore the materials, designs and stories behind SenPine.",
    prompts: ["What materials does SenPine explore?", "How does traceability work?", "Which career roles are proposed?", "Tell me about the fabric swatch kit"],
    promptLabels: ["Explore materials", "Trace a material", "Career roles", "Fabric swatch kit"],
    placeholder: "What would you like to explore?", input: "Message the SenPine assistant", send: "Send message", stop: "Stop response", retry: "Try again",
    waiting: "Finding an answer…", streaming: "Writing a reply…", stopped: "Response stopped.", done: "Reply complete.",
    note: "AI assistant · Project information is indicative.", privacy: "Messages are sent to an AI service to generate replies. Avoid sharing sensitive information.",
    newMessages: "See new messages", you: "You", assistant: "SenPine AI", enter: "Enter to send · Shift + Enter for a new line", clearNote: "Clear this conversation and start again",
  },
};

function errorText(code: string, lang: "vi" | "en") {
  const errors: Record<string, [string, string]> = {
    not_configured: ["Trợ lý đang được thiết lập. Bạn vui lòng thử lại sau.", "The assistant is being set up. Please try again later."],
    configuration: ["Trợ lý chưa kết nối được với dịch vụ AI. Bạn vui lòng thử lại sau.", "The assistant cannot connect to the AI service yet. Please try again later."],
    model_unavailable: ["Trợ lý đang tạm gián đoạn. Bạn vui lòng thử lại sau.", "The assistant is temporarily unavailable. Please try again later."],
    rate_limit: ["Trợ lý đang nhận nhiều yêu cầu. Bạn đợi khoảng một phút rồi thử lại nhé.", "The assistant is busy. Please wait about a minute before trying again."],
    blocked: ["Mình chưa thể trả lời câu hỏi này. Bạn thử diễn đạt lại nhé.", "I cannot answer this question. Please try rephrasing it."],
    timeout: ["Kết nối mất nhiều thời gian hơn dự kiến. Bạn có thể thử lại.", "The connection took too long. You can try again."],
    network_blocked: ["Máy chủ website đang bị chặn kết nối tới dịch vụ AI. Cần mở quyền truy cập mạng cho máy chủ để trợ lý hoạt động.", "The website server is blocked from connecting to the AI service. Server network access needs to be enabled."],
    dns_failure: ["Máy chủ website chưa tìm được địa chỉ dịch vụ AI. Bạn vui lòng thử lại sau.", "The website server cannot resolve the AI service address. Please try again later."],
    tls_failure: ["Máy chủ website chưa xác thực được kết nối bảo mật với dịch vụ AI. Bạn vui lòng thử lại sau.", "The website server cannot verify the secure connection to the AI service. Please try again later."],
    interrupted: ["Câu trả lời bị ngắt giữa chừng. Bạn bấm Thử lại để nhận câu trả lời mới nhé.", "The response ended unexpectedly. Please try again for a new reply."],
    empty_response: ["Trợ lý chưa trả về nội dung. Bạn thử gửi lại hoặc diễn đạt câu hỏi khác nhé.", "The assistant returned no answer. Try sending again or rephrasing your question."],
    response_too_long: ["Câu trả lời dài hơn giới hạn. Bạn thử hỏi cụ thể hơn nhé.", "The answer exceeded the length limit. Please try a more specific question."],
    invalid_request: ["Tin nhắn chưa hợp lệ. Bạn thử gửi một câu hỏi ngắn hơn nhé.", "This message could not be processed. Please try a shorter question."],
    unavailable: ["Kết nối bị gián đoạn. Bạn kiểm tra mạng và thử lại nhé.", "The connection was interrupted. Check your network and try again."],
  };
  return (errors[code] ?? errors.unavailable)[lang === "vi" ? 0 : 1];
}

// Only completed user/assistant pairs are sent back; failed or stopped replies are not model history.
function recentHistory(messages: Message[]): ChatTurn[] {
  const pairs: ChatTurn[][] = [];
  for (let i = 0; i < messages.length - 1; i++) {
    const user = messages[i], assistant = messages[i + 1];
    if (user.role === "user" && assistant.role === "assistant" && assistant.state === "complete") {
      pairs.push([{ role: "user", text: user.text }, { role: "assistant", text: assistant.text }]);
    }
  }
  const history = pairs.slice(-10).flat();
  while (history.reduce((size, item) => size + item.text.length, 0) > 34000) history.splice(0, 2);
  return history;
}

function safeUrl(value: string) {
  if (/^\/(?!\/)/.test(value)) return value;
  return /^https?:\/\//i.test(value) ? value : "";
}

export function SenPineChatbot() {
  const { lang } = useLanguage();
  const { intro } = useMotion();
  const t = copy[lang];
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [busy, setBusy] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [atBottom, setAtBottom] = useState(true);
  const launcher = useRef<HTMLButtonElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const thread = useRef<HTMLDivElement>(null);
  const following = useRef(true);
  const request = useRef<AbortController | null>(null);
  const sequence = useRef(0);
  const busyRef = useRef(false);
  const root = useRef<HTMLElement>(null);

  useEffect(() => () => { sequence.current++; request.current?.abort(); }, []);
  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;
    const resize = () => root.current?.style.setProperty("--sp-chat-keyboard", `${viewport.scale === 1 ? Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop) : 0}px`);
    resize(); viewport.addEventListener("resize", resize); viewport.addEventListener("scroll", resize);
    return () => { viewport.removeEventListener("resize", resize); viewport.removeEventListener("scroll", resize); };
  }, []);
  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => {
      input.current?.focus({ preventScroll: true });
      if (following.current && thread.current) thread.current.scrollTop = thread.current.querySelector(".sp-chat-message") ? thread.current.scrollHeight : 0;
    });
    return () => cancelAnimationFrame(frame);
  }, [open]);
  useEffect(() => {
    if (open && following.current && thread.current) thread.current.scrollTop = messages.length ? thread.current.scrollHeight : 0;
  }, [messages, open]);
  useEffect(() => {
    if (!input.current) return;
    input.current.style.height = "auto";
    input.current.style.height = `${Math.min(input.current.scrollHeight, 112)}px`;
  }, [draft, open]);

  function close() { setOpen(false); launcher.current?.focus({ preventScroll: true }); }
  function stop() { request.current?.abort(); }
  function clear() {
    sequence.current++; request.current?.abort(); request.current = null;
    busyRef.current = false; setBusy(false); setMessages([]); setDraft(""); setAnnouncement("");
    following.current = true; setAtBottom(true); input.current?.focus();
  }

  async function send(text: string, retry = false) {
    text = text.trim();
    if (busyRef.current || !text || text.length > CHAT_INPUT_LIMIT) return;
    busyRef.current = true; setBusy(true); setDraft(""); following.current = true; setAtBottom(true);
    const prior = retry ? messages.slice(0, -2) : messages;
    const user: Message = { id: crypto.randomUUID(), role: "user", text, state: "complete" };
    const assistant: Message = { id: crypto.randomUUID(), role: "assistant", text: "", state: "streaming" };
    setMessages([...prior, user, assistant]); setAnnouncement(t.waiting);
    const controller = new AbortController(); request.current = controller;
    const id = ++sequence.current;
    let received = "";
    const update = (patch: Partial<Message>) => {
      if (id === sequence.current) setMessages((items) => items.map((item) => item.id === assistant.id ? { ...item, ...patch } : item));
    };
    try {
      const response = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" }, signal: controller.signal,
        body: JSON.stringify({ messages: [...recentHistory(prior), { role: "user", text }], lang }),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({ code: "unavailable" }));
        throw new Error(typeof error.code === "string" ? error.code : "unavailable");
      }
      if (!response.body) throw new Error("unavailable");
      let complete = false;
      for await (const line of readStreamLines(response.body)) {
        if (!line.trim()) continue;
        if (id !== sequence.current) break;
        const event = JSON.parse(line) as ChatEvent;
        if (event.type === "text" && typeof event.text === "string") {
          received += event.text; update({ text: received });
        } else if (event.type === "error") throw new Error(event.code);
        else if (event.type === "done") complete = true;
        else throw new Error("unavailable");
      }
      if (!complete || !received.trim()) throw new Error("interrupted");
      update({ state: "complete" });
      if (id === sequence.current) setAnnouncement(t.done);
    } catch (error) {
      if (controller.signal.aborted) {
        update({ state: "stopped" });
        if (id === sequence.current) setAnnouncement(t.stopped);
      } else {
        const code = error instanceof Error ? error.message : "unavailable";
        update({ state: "error", code });
        if (id === sequence.current) setAnnouncement(errorText(code, lang));
      }
    } finally {
      if (id === sequence.current) { busyRef.current = false; setBusy(false); request.current = null; }
    }
  }

  return (
    <aside ref={root} className="sp-chat" data-ready={intro === "done"} aria-label={t.title}>
      {open && <section id="senpine-chat-panel" className="sp-chat-panel" role="dialog" aria-modal="false" aria-labelledby="senpine-chat-title" onKeyDown={(event) => {
        if (event.key === "Escape") { event.stopPropagation(); close(); }
      }}>
        <header className="sp-chat-header">
          <span className="sp-chat-mark" aria-hidden="true"><Leaf size={23} /></span>
          <div><h2 id="senpine-chat-title">{t.title}</h2><span><i aria-hidden="true" /> AI</span></div>
          <button type="button" className="sp-chat-icon" aria-label={t.clear} title={t.clearNote} onClick={clear}><RotateCcw size={18} /></button>
          <button type="button" className="sp-chat-icon" aria-label={t.close} onClick={close}><X size={21} /></button>
        </header>
        <div className="sp-chat-thread" ref={thread} tabIndex={0} aria-label={lang === "vi" ? "Lịch sử trò chuyện" : "Conversation history"} onScroll={() => {
          const node = thread.current;
          if (node) { const bottom = node.scrollHeight - node.scrollTop - node.clientHeight < 60; following.current = bottom; setAtBottom(bottom); }
        }}>
          {!messages.length && <div className="sp-chat-welcome">
            <div className="sp-chat-illustration" aria-hidden="true"><span /><span /><span /><Leaf size={38} strokeWidth={1.25} /></div>
            <span className="sp-chat-eyebrow">SENPINE · {lang === "vi" ? "CÙNG KHÁM PHÁ" : "LET’S EXPLORE"}</span>
            <h3>{t.welcome}</h3><p>{t.intro}</p>
            <div className="sp-chat-prompts">{t.prompts.map((prompt, index) => <button type="button" key={prompt} aria-label={prompt} onClick={() => void send(prompt)}>{t.promptLabels[index]}<ArrowUpRight size={17} aria-hidden="true" /></button>)}</div>
            <p className="sp-chat-privacy">{t.privacy}</p>
          </div>}
          {messages.map((message, index) => <article key={message.id} className={`sp-chat-message sp-chat-${message.role}`} data-state={message.state}>
            <span className="sp-chat-speaker">{message.role === "user" ? t.you : <><Leaf size={13} aria-hidden="true" /> {t.assistant}</>}</span>
            {message.text && <div className="sp-chat-bubble">{message.role === "user" ? message.text : <Markdown remarkPlugins={[remarkGfm]} skipHtml urlTransform={safeUrl} components={{
              a: ({ href, children }) => href?.startsWith("/") ? <Link href={href}>{children}</Link> : href ? <a href={href} target="_blank" rel="noopener noreferrer">{children}</a> : <span>{children}</span>,
              img: () => null,
            }}>{message.text}</Markdown>}</div>}
            {message.state === "streaming" && !message.text && <div className="sp-chat-thinking" aria-label={t.waiting}><span /><span /><span /></div>}
            {message.state === "error" && <p className="sp-chat-error" role="alert">{errorText(message.code ?? "unavailable", lang)}</p>}
            {message.state === "stopped" && <p className="sp-chat-stopped">{t.stopped}</p>}
            {!busy && index === messages.length - 1 && (message.state === "error" || message.state === "stopped") && <button type="button" className="sp-chat-retry" onClick={() => void send(messages[index - 1].text, true)}><RotateCcw size={14} aria-hidden="true" />{t.retry}</button>}
          </article>)}
        </div>
        {!atBottom && messages.length > 0 && <button type="button" className="sp-chat-jump" onClick={() => {
          if (thread.current) thread.current.scrollTop = thread.current.scrollHeight;
          following.current = true; setAtBottom(true);
        }}><ArrowDown size={14} />{t.newMessages}</button>}
        <form className="sp-chat-composer" onSubmit={(event) => { event.preventDefault(); void send(draft); }}>
          <label className="sr-only" htmlFor="senpine-chat-input">{t.input}</label>
          <div className="sp-chat-input-row"><textarea id="senpine-chat-input" ref={input} rows={1} value={draft} maxLength={CHAT_INPUT_LIMIT} placeholder={t.placeholder} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); void send(draft); }
          }} />
            {busy ? <button type="button" className="sp-chat-send" aria-label={t.stop} onClick={stop}><Square size={17} fill="currentColor" /></button> : <button type="submit" className="sp-chat-send" disabled={!draft.trim()} aria-label={t.send}><Send size={19} /></button>}
          </div>
          <div className="sp-chat-input-hint"><span>{busy ? t.streaming : t.enter}</span><span>{draft.length}/{CHAT_INPUT_LIMIT}</span></div>
          <p className="sp-chat-footnote">{t.note}</p>
        </form>
        <span className="sr-only" role="status" aria-live="polite">{announcement}</span>
      </section>}
      <button ref={launcher} type="button" className="sp-chat-launcher" aria-expanded={open} aria-controls={open ? "senpine-chat-panel" : undefined} aria-label={open ? t.close : t.launcher} onClick={() => open ? close() : setOpen(true)}>
        {open ? <X size={23} aria-hidden="true" /> : <MessageCircle size={24} aria-hidden="true" />}<span>{t.launcher}</span><span className="sp-chat-ai" aria-hidden="true">AI</span>
      </button>
    </aside>
  );
}
