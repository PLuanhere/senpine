"use client";

import Link from "next/link";
import { ArrowUpRight, Heart, X } from "lucide-react";
import { ProductArtwork } from "@/components/product-artwork";
import { currency, products } from "@/lib/content";
import { useSaved } from "@/lib/store";

export function SavedView() {
  const { saved, toggle, clear } = useSaved();
  return <section className="page-section saved-page-content"><div className="saved-heading"><p>{saved.length} thiết kế trong danh sách yêu thích</p>{saved.length > 0 && <button className="text-link" onClick={clear}>Xóa danh sách <X size={19} /></button>}</div>{saved.length ? <div className="editorial-grid three">{saved.map((id) => <article key={id} className="editorial-card saved-card"><Link href={`/products/${products[id].slug}`}><ProductArtwork id={id} /><div className="editorial-card-top"><span>{products[id].category}</span><ArrowUpRight size={20} /></div><h3>{products[id].name}</h3></Link><p>{currency(products[id].price)} · giá dự kiến</p><button className="text-link" onClick={() => toggle(id)}><Heart size={19} fill="currentColor" /> Bỏ lưu</button></article>)}</div> : <div className="empty-editorial"><Heart size={43} strokeWidth={1.3} /><h2>Chưa có thiết kế nào được lưu.</h2><p>Nhấn biểu tượng trái tim ở một thiết kế để đưa vào danh sách này.</p><Link className="button button-dark" href="/collection">Khám phá bộ sưu tập <ArrowUpRight size={20} /></Link></div>}</section>;
}
