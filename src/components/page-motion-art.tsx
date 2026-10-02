"use client";

import { useLanguage } from "@/lib/language-context";

export function CareerWeave() {
  return <div className="career-weave" aria-hidden="true">
    <svg viewBox="0 0 180 180" fill="none">
      <circle cx="90" cy="90" r="83" stroke="currentColor" strokeWidth="1" />
      <g className="weave-ring"><circle cx="90" cy="90" r="73" stroke="currentColor" strokeDasharray="2 8" /><path d="M90 12v10M168 90h-10M90 168v-10M12 90h10" stroke="currentColor" strokeWidth="2" /></g>
      <g className="weave-petals" stroke="currentColor" strokeWidth="1.3">
        {[0, 45, 90, 135].map((angle) => <ellipse cx="90" cy="90" rx="17" ry="49" transform={`rotate(${angle} 90 90)`} key={angle} />)}
      </g>
      <circle className="weave-heart" cx="90" cy="90" r="7" fill="currentColor" />
    </svg>
    <span>GROW TOGETHER</span>
  </div>;
}

export function ContactSignal({ compact = false }: { compact?: boolean }) {
  return <div className={`contact-signal${compact ? " contact-signal-compact" : ""}`} aria-hidden="true">
    <svg viewBox="0 0 200 200" fill="none">
      <circle className="signal-ripple signal-ripple-one" cx="100" cy="100" r="38" stroke="currentColor" />
      <circle className="signal-ripple signal-ripple-two" cx="100" cy="100" r="38" stroke="currentColor" />
      <circle className="signal-orbit" cx="100" cy="100" r="78" stroke="currentColor" strokeDasharray="4 10" />
      <g className="signal-satellite"><circle cx="100" cy="22" r="7" fill="currentColor" /><circle cx="100" cy="178" r="4" fill="currentColor" /></g>
      <path d="M75 83h50v34H91l-16 12V83Z" fill="var(--surface)" stroke="currentColor" strokeWidth="1.6" />
      {[88, 100, 112].map((x, index) => <circle className={`signal-dot signal-dot-${index}`} cx={x} cy="100" r="3" fill="currentColor" key={x} />)}
    </svg>
  </div>;
}

export function WritingThread() {
  return <svg className="writing-thread" viewBox="0 0 420 54" fill="none" aria-hidden="true">
    <path className="writing-baseline" d="M0 42H420" stroke="currentColor" strokeWidth=".6" strokeDasharray="1 6" />
    <path className="writing-stroke" pathLength="1" d="M5 34C36 2 47 4 44 28S62 57 85 26S113 15 115 30S139 54 157 25S180 9 190 30S223 52 244 24S264 3 274 24S303 49 321 29S348 10 361 30S392 34 410 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <g className="writing-pen" stroke="currentColor" strokeWidth="1.3"><path d="m394 9 7-7 6 6-7 7-9 4 3-10Z" /><path d="m394 9 6 6" /></g>
  </svg>;
}

export function MotionRibbon({ scene }: { scene: "careers" | "contact" }) {
  const { lang } = useLanguage();
  const words = scene === "careers" ? lang === "vi" ? ["CHUYÊN MÔN", "TÒ MÒ", "CÙNG PHÁT TRIỂN", "TẠO GIÁ TRỊ"] : ["EXPERTISE", "CURIOSITY", "GROW TOGETHER", "MAKE AN IMPACT"] : lang === "vi" ? ["SỢI TỰ NHIÊN", "Ý TƯỞNG MỚI", "DỆT KẾT NỐI", "CÂU CHUYỆN CHUNG"] : ["NATURAL FIBRES", "NEW IDEAS", "WEAVE CONNECTIONS", "OUR SHARED STORY"];
  return <div className={`page-motion-ribbon page-motion-ribbon-${scene}`} aria-hidden="true"><div className="page-motion-ribbon-track">{[0, 1].map((copy) => <div className="page-motion-ribbon-copy" key={copy}>{words.map((word) => <span key={word}><i>✳</i>{word}</span>)}</div>)}</div></div>;
}
