"use client";

import Link from "next/link";
import { Heart, X, ArrowUpRight } from "lucide-react";
import { products, currency } from "@/lib/content";
import { ProductArtwork } from "@/components/product-artwork";

interface SavedDialogContentProps {
  lang: "vi" | "en";
  saved: number[];
  onToggleSaved: (id: number) => void;
  onSelectProduct: (productId: number) => void;
  onExploreCollection: () => void;
  onClose: () => void;
}

export function SavedDialogContent({
  lang,
  saved,
  onToggleSaved,
  onSelectProduct,
  onExploreCollection,
  onClose,
}: SavedDialogContentProps) {
  const vi = lang === "vi";

  return (
    <div className="modal-content">
      <p className="eyebrow">{vi ? "BỘ SƯU TẬP CỦA BẠN" : "YOUR LITTLE EDIT"}</p>
      <h2 id="modal-title">
        {vi ? (
          <>
            Những điều <em>bạn thích.</em>
          </>
        ) : (
          <>
            Your curated <em>favorites.</em>
          </>
        )}
      </h2>

      {saved.length > 0 ? (
        <>
          <p className="home-modal-summary">
            {vi
              ? `${saved.length} thiết kế đã lưu trên trình duyệt này`
              : `${saved.length} ${saved.length === 1 ? "design" : "designs"} saved on this browser`}
          </p>
          <div className="saved-list">
            {saved.map((id) => {
              const product = products[id];
              if (!product) return null;
              return (
                <div key={id}>
                  <button
                    type="button"
                    className="home-saved-product"
                    aria-label={vi ? `Xem ${product.name}` : `View ${product.english}`}
                    onClick={() => onSelectProduct(id)}
                  >
                    <ProductArtwork id={id} />
                    <span className="home-result-copy">
                      <strong>{vi ? product.name : product.english}</strong>
                      <small>
                        {currency(product.price, lang)} · {vi ? "dự kiến" : "estimated"}
                      </small>
                    </span>
                    <ArrowUpRight size={18} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="icon-button"
                    onClick={() => onToggleSaved(id)}
                    aria-label={vi ? `Bỏ lưu ${product.name}` : `Remove ${product.english}`}
                    title={vi ? "Bỏ lưu" : "Remove"}
                  >
                    <X size={18} />
                  </button>
                </div>
              );
            })}
          </div>
          <Link href="/saved" className="text-link home-saved-link" onClick={onClose}>
            {vi ? "Xem tất cả thiết kế đã lưu" : "View all saved designs"} <ArrowUpRight size={18} />
          </Link>
        </>
      ) : (
        <div className="empty-state">
          <Heart size={35} strokeWidth={1} />
          <h3>{vi ? "Chưa có thiết kế đã lưu." : "No saved designs yet."}</h3>
          <p>
            {vi ? (
              <>
                Lưu thiết kế bạn thích bằng biểu tượng trái tim.
                <br />
                Danh sách được giữ trên trình duyệt này.
              </>
            ) : (
              <>
                Save designs you love using the heart icon.
                <br />
                Your list is kept on this browser.
              </>
            )}
          </p>
          <button
            type="button"
            className="button button-dark"
            onClick={onExploreCollection}
          >
            {vi ? "Khám phá bộ sưu tập" : "Explore collection"} <ArrowUpRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
