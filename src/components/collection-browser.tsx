"use client";

import { useState } from "react";
import { ProductCard } from "@/components/editorial";
import { products } from "@/lib/content";

const filters = ["Tất cả", "Trang phục", "Phụ kiện"] as const;

export function CollectionBrowser() {
  const [active, setActive] = useState<(typeof filters)[number]>("Tất cả");
  const visible = products.filter((product) => active === "Tất cả" || product.category === active);
  return <><div className="collection-filter" aria-label="Lọc bộ sưu tập">{filters.map((filter) => <button key={filter} className={active === filter ? "active" : ""} aria-pressed={active === filter} onClick={() => setActive(filter)}>{filter}<span>{filter === "Tất cả" ? products.length : products.filter((item) => item.category === filter).length}</span></button>)}</div><div key={active} className="editorial-grid three collection-grid">{visible.map((product) => <ProductCard key={product.slug} id={product.id} />)}</div></>;
}
