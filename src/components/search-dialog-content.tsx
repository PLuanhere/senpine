"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";
import { products, materials, currency } from "@/lib/content";
import { ProductArtwork } from "@/components/product-artwork";

function normalizeSearch(value: string) {
  return value
    .toLocaleLowerCase("vi")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .trim()
    .replace(/\s+/g, " ");
}

interface SearchDialogContentProps {
  lang: "vi" | "en";
  onSelectProduct: (productId: number) => void;
  onSelectMaterial?: (materialId: string) => void;
  onClose: () => void;
}

export function SearchDialogContent({
  lang,
  onSelectProduct,
  onSelectMaterial,
  onClose,
}: SearchDialogContentProps) {
  const [query, setQuery] = useState("");
  const vi = lang === "vi";

  const matches = products.filter((product) =>
    normalizeSearch(
      `${product.name} ${product.english} ${product.category} ${product.categoryEn} ${product.color} ${product.colorEn} ${product.materialUsed} ${product.materialUsedEn}`
    ).includes(normalizeSearch(query))
  );

  const materialMatches = query.trim()
    ? materials.filter((material) =>
        normalizeSearch(
          `${material.name} ${material.origin} ${material.originEn} ${material.code}`
        ).includes(normalizeSearch(query))
      )
    : [];

  return (
    <div className="modal-content">
      <p className="eyebrow">{vi ? "KHÁM PHÁ SENPINE" : "DISCOVER SENPINE"}</p>
      <h2 id="modal-title">
        {vi ? (
          <>
            Bạn đang tìm <em>điều gì?</em>
          </>
        ) : (
          <>
            What are you <em>looking for?</em>
          </>
        )}
      </h2>

      <label className="search-field">
        <Search size={22} />
        <input
          type="search"
          autoFocus
          placeholder={vi ? "Áo sơ mi, khăn, túi vải…" : "Shirt, scarf, tote bag…"}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label={vi ? "Tìm sản phẩm trong bộ sưu tập" : "Search designs in the collection"}
        />
      </label>

      <p className="home-modal-summary" role="status">
        {vi
          ? `${matches.length} thiết kế${query.trim() ? " phù hợp" : " trong bộ sưu tập"}`
          : `${matches.length} ${matches.length === 1 ? "design" : "designs"}${query.trim() ? " found" : " in the collection"}`}
      </p>

      <div className="search-results">
        {matches.length > 0 ? (
          matches.map((product) => (
            <button
              key={product.id}
              type="button"
              className="home-search-result"
              aria-label={vi ? `Xem ${product.name}` : `View ${product.english}`}
              onClick={() => onSelectProduct(product.id)}
            >
              <ProductArtwork id={product.id} />
              <span className="home-result-copy">
                <strong>{vi ? product.name : product.english}</strong>
                <small>{vi ? product.english : product.name}</small>
              </span>
              <span className="home-result-price">{currency(product.price, lang)}</span>
              <ArrowUpRight size={18} aria-hidden="true" />
            </button>
          ))
        ) : (
          <p className="home-search-empty">
            {vi
              ? "Chưa tìm thấy thiết kế phù hợp. Thử tìm “áo”, “váy” hoặc “túi”."
              : "No matching designs found. Try searching “shirt”, “dress”, or “tote”."}
          </p>
        )}
      </div>

      {materialMatches.length > 0 && (
        <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid var(--line)" }}>
          <p className="eyebrow" style={{ marginBottom: "12px" }}>
            {vi ? "VẬT LIỆU LIÊN QUAN" : "RELATED MATERIALS"}
          </p>
          <div className="search-results">
            {materialMatches.map((item) => (
              <Link
                key={item.id}
                href={`/materials/${item.id}`}
                className="home-search-result"
                onClick={() => {
                  if (onSelectMaterial) {
                    onSelectMaterial(item.id);
                  } else {
                    onClose();
                  }
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "4px",
                    background: "var(--surface-alt)",
                    display: "grid",
                    placeItems: "center",
                    fontWeight: 600,
                    fontSize: "var(--type-label)",
                    color: "var(--sage)",
                    border: "1px solid var(--line)",
                  }}
                >
                  {item.code.replace("SP-", "")}
                </div>
                <span className="home-result-copy">
                  <strong>{item.name}</strong>
                  <small>{vi ? item.origin : item.originEn}</small>
                </span>
                <span className="home-result-price">{currency(item.price, lang)}/m</span>
                <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
