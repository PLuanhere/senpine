"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";
import { materials } from "@/lib/content";

export function TraceLookup() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const findCode = (value: string) => {
    const normalized = value.trim().toUpperCase();
    const material = materials.find((item) => item.code === normalized);
    if (material) { setError(""); router.push(`/trace/${material.code}`); }
    else setError("Mã này chưa có trong ba hồ sơ minh họa. Chọn một mã demo bên dưới.");
  };
  return <div className="trace-lookup"><form onSubmit={(event) => { event.preventDefault(); findCode(code); }}><label htmlFor="trace-code">MÃ HỒ SƠ MẪU</label><div><Search size={25} /><input id="trace-code" value={code} onChange={(event) => { setCode(event.target.value); setError(""); }} placeholder="Ví dụ: SP-PF-001" aria-describedby={error ? "trace-error" : undefined} /><button type="submit" aria-label="Tìm hồ sơ"><ArrowUpRight size={23} /></button></div></form>{error && <p id="trace-error" role="alert" className="field-error">{error}</p>}<p>Thử một mã demo:</p><div className="trace-chips">{materials.map((item) => <button key={item.code} onClick={() => findCode(item.code)}>{item.code}<ArrowUpRight size={17} /></button>)}</div></div>;
}
