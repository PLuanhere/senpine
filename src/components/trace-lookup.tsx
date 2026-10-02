"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowUpRight, Check, ScanLine, Search } from "lucide-react";
import { materials, type MaterialItem } from "@/lib/content";
import { useLanguage } from "@/lib/language-context";
import { useMotion } from "@/lib/motion-context";

export function TraceLookup() {
  const router = useRouter();
  const { lang } = useLanguage();
  const { reduced } = useMotion();
  const vi = lang === "vi";
  const input = useRef<HTMLInputElement>(null);
  const navigationTimer = useRef<number | null>(null);
  const pending = useRef(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [found, setFound] = useState<MaterialItem | null>(null);

  useEffect(() => () => {
    if (navigationTimer.current !== null) window.clearTimeout(navigationTimer.current);
    pending.current = false;
  }, []);

  useEffect(() => {
    if (!found) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [found]);

  function findCode(value: string) {
    if (pending.current) return;
    const normalized = value.trim().toUpperCase();
    const material = materials.find((item) => item.code === normalized);
    if (!material) {
      setError(normalized
        ? (vi ? "Chưa tìm thấy mã này. Kiểm tra lại hoặc chọn một hồ sơ mẫu bên dưới." : "Code not found. Check your code or choose a sample passport below.")
        : (vi ? "Vui lòng nhập mã hồ sơ hoặc chọn một mã mẫu bên dưới." : "Enter a passport code or choose a sample below."));
      input.current?.focus();
      return;
    }

    pending.current = true;
    setError("");
    setCode(normalized);
    const destination = `/trace/${material.code}`;
    router.prefetch(destination);
    if (reduced) {
      router.push(destination);
      return;
    }
    setFound(material);
    navigationTimer.current = window.setTimeout(() => router.push(destination), 1050);
  }

  return (
    <>
      <div className="trace-lookup" aria-labelledby="trace-lookup-title">
        <div className="trace-lookup-top">
          <ScanLine size={30} aria-hidden="true" />
          <span>DIGITAL MATERIAL PASSPORT</span>
          <span className="trace-lookup-count">03 / {vi ? "HỒ SƠ MẪU" : "SAMPLE FILES"}</span>
        </div>
        <h3 id="trace-lookup-title">{vi ? "Truy xuất hồ sơ vật liệu." : "Trace your material."}</h3>
        <p className="trace-lookup-intro">{vi ? "Một mã vật liệu. Mở ra câu chuyện nguồn gốc." : "One material code. Discover its origin story."}</p>

        <form onSubmit={(event) => { event.preventDefault(); findCode(code); }} aria-busy={Boolean(found)}>
          <label htmlFor="trace-code">{vi ? "NHẬP MÃ HỒ SƠ" : "ENTER PASSPORT CODE"}</label>
          <div className="trace-code-field">
            <Search size={22} aria-hidden="true" />
            <input
              ref={input}
              id="trace-code"
              value={code}
              onChange={(event) => { setCode(event.target.value); setError(""); }}
              placeholder={vi ? "Ví dụ: SP-PF-001" : "Example: SP-PF-001"}
              autoCapitalize="characters"
              autoComplete="off"
              spellCheck={false}
              maxLength={40}
              disabled={Boolean(found)}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "trace-code-hint trace-error" : "trace-code-hint"}
            />
          </div>
          <p id="trace-code-hint" className="trace-code-hint">{vi ? "Mã được ghi trên hộ chiếu vật liệu mẫu của SenPine." : "Find this code on a SenPine sample material passport."}</p>
          {error && <p id="trace-error" role="alert" className="field-error">{error}</p>}
          <button className="trace-submit" type="submit" disabled={Boolean(found)}>
            {vi ? "Truy xuất hồ sơ" : "Find material passport"}<ArrowUpRight size={23} aria-hidden="true" />
          </button>
        </form>

        <div className="trace-demo">
          <p>{vi ? "Hoặc khám phá một hồ sơ mẫu" : "Or explore a sample passport"}</p>
          <div className="trace-chips">
            {materials.map((item) => (
              <button key={item.code} type="button" disabled={Boolean(found)} onClick={() => findCode(item.code)}>
                <span><strong>{item.name}</strong><small>{item.code}</small></span><ArrowUpRight size={19} aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
        <p className="trace-lookup-footnote">{vi ? "Hồ sơ minh họa · Chưa có dữ liệu lô sản xuất thực tế." : "Sample passports · Production batch data is not available yet."}</p>
      </div>

      {found && createPortal(
        <div className="trace-transfer" role="status" aria-live="polite" aria-atomic="true">
          <div className="trace-transfer-content">
            <span className="trace-transfer-check"><Check size={30} strokeWidth={1.8} aria-hidden="true" /></span>
            <p className="trace-transfer-eyebrow">{vi ? "ĐÃ TÌM THẤY HỒ SƠ MẪU" : "SAMPLE PASSPORT FOUND"}</p>
            <h2>{found.name}</h2>
            <p className="trace-transfer-code">{found.code}</p>
            <p className="trace-transfer-caption">{vi ? "Đang mở hộ chiếu vật liệu…" : "Opening material passport…"}</p>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
