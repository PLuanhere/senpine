"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Check, Heart, ShoppingBag } from "lucide-react";
import { useCart, useSaved } from "@/lib/store";

export function ProductActions({ id }: { id: number }) {
  const { saved, toggle } = useSaved();
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  return <div className="detail-actions"><button className="button button-dark" onClick={() => { add(id); setAdded(true); }}>Thêm vào giỏ trải nghiệm <ShoppingBag size={21} /></button><button className="detail-save" aria-pressed={saved.includes(id)} onClick={() => toggle(id)}><Heart size={22} fill={saved.includes(id) ? "currentColor" : "none"} />{saved.includes(id) ? "Đã lưu" : "Lưu thiết kế"}</button>{added && <p className="inline-status" role="status"><Check size={19} /> Đã thêm vào giỏ demo. <Link href="/experience/checkout">Xem giỏ <ArrowUpRight size={16} /></Link></p>}</div>;
}
