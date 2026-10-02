"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Heart, Minus, Plus } from "lucide-react";
import { currency, type products } from "@/lib/content";
import { productImages } from "@/lib/imagery";
import { CollectionArtwork } from "@/components/collection-artwork";

type ProductItem = (typeof products)[number];

interface ProductQuickViewProps {
  product: ProductItem;
  lang?: "vi" | "en";
  isSaved?: boolean;
  onToggleSave?: (id: number) => void;
  onNavigate?: () => void;
}

export function ProductQuickView({
  product,
  lang = "vi",
  isSaved = false,
  onToggleSave,
  onNavigate,
}: ProductQuickViewProps) {
  const [viewTab, setViewTab] = useState<0 | 1>(0);
  const [zoom, setZoom] = useState<number>(1);
  const vi = lang === "vi";

  const photo = productImages[product.id] || productImages[0];

  const handleZoom = (delta: number) => {
    setZoom((prev) => {
      const next = Math.round((prev + delta) * 100) / 100;
      return Math.min(2, Math.max(1, next));
    });
  };

  return (
    <div className="dossier-dialog product-dossier-dialog">
      {/* Visual Column */}
      <div className="dossier-visual">
        <div className="dossier-tabs" role="tablist" aria-label={vi ? "Góc nhìn thiết kế" : "Design views"}>
          <button
            type="button"
            role="tab"
            aria-selected={viewTab === 0}
            className={viewTab === 0 ? "is-active" : ""}
            onClick={() => {
              setViewTab(0);
              setZoom(1);
            }}
          >
            {vi ? "Phom thiết kế" : "Design silhouette"}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={viewTab === 1}
            className={viewTab === 1 ? "is-active" : ""}
            onClick={() => {
              setViewTab(1);
              setZoom(1);
            }}
          >
            {vi ? "Ảnh tham khảo" : "Reference image"}
          </button>
        </div>

        <div className="dossier-viewport">
          <div className="dossier-badge">
            <span>SP / 0{product.id + 1}</span>
            <small> • {vi ? product.category : product.categoryEn}</small>
          </div>

          <div
            className="dossier-art-zoom"
            style={{ transform: `scale(${zoom})` }}
          >
            {viewTab === 0 ? (
              <div className="dossier-vector-wrap">
                <CollectionArtwork id={product.id} className="dossier-artwork" />
              </div>
            ) : (
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 840px) 92vw, 520px"
                style={{ objectFit: "contain" }}
                priority
              />
            )}
          </div>
        </div>

        <div className="dossier-zoom">
          <button
            type="button"
            onClick={() => handleZoom(-0.25)}
            disabled={zoom <= 1}
            aria-label={vi ? "Thu nhỏ thiết kế" : "Zoom out design"}
          >
            <Minus size={15} />
          </button>
          <label htmlFor={`zoom-prod-${product.id}`}>{vi ? "Phóng đại" : "Magnification"}</label>
          <input
            id={`zoom-prod-${product.id}`}
            type="range"
            min="1"
            max="2"
            step="0.05"
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            aria-label={vi ? "Phóng đại" : "Magnification"}
            aria-valuetext={`${zoom.toFixed(2)}×`}
          />
          <span aria-live="polite">{zoom.toFixed(1)}×</span>
          <button
            type="button"
            onClick={() => handleZoom(0.25)}
            disabled={zoom >= 2}
            aria-label={vi ? "Phóng lớn thiết kế" : "Zoom in design"}
          >
            <Plus size={15} />
          </button>
        </div>
      </div>

      {/* Copy Column */}
      <div className="dossier-copy">
        <p className="eyebrow">EVERYDAY COLLECTION / CONCEPT</p>
        <h2 id="modal-title">{product.name}</h2>
        <p className="dossier-subtitle">{product.english}</p>
        <p className="dossier-description">{product.description}</p>

        <dl className="dossier-specs">
          <div className="dossier-spec-row">
            <span>{vi ? "Màu minh họa" : "Illustrated color"}</span>
            <strong>
              <i className={`swatch swatch-${product.color.toLowerCase()}`} />
              {vi ? product.color : product.colorEn}
            </strong>
          </div>
          <div className="dossier-spec-row">
            <span>{vi ? "Vật liệu sử dụng" : "Material used"}</span>
            <strong>{vi ? product.materialUsed : product.materialUsedEn}</strong>
          </div>
          <div className="dossier-spec-row dossier-price-row">
            <span>{vi ? "Giá kế hoạch" : "Planned price"}</span>
            <strong className="dossier-price-tag">{currency(product.price, lang)}</strong>
          </div>
        </dl>

        <p className="modal-note">
          {vi
            ? "Hình tham khảo trong đề án SenPine. Thành phần, kích cỡ và thông số sản phẩm chưa được xác nhận. Chưa mở bán."
            : "Reference illustrations within the SenPine project. Specifications and sizes are conceptual. Not yet commercially available."}
        </p>

        <div className="dossier-actions">
          {onToggleSave && (
            <button
              type="button"
              className="button button-dark dossier-save-btn"
              onClick={() => onToggleSave(product.id)}
              aria-pressed={isSaved}
            >
              <Heart size={18} fill={isSaved ? "currentColor" : "none"} />
              {isSaved
                ? vi ? "Đã lưu thiết kế" : "Saved in edit"
                : vi ? "Lưu thiết kế yêu thích" : "Save to edit"}
            </button>
          )}
          <Link
            href={`/products/${product.slug}`}
            className="text-link"
            onClick={onNavigate}
          >
            {vi ? "Xem trang chi tiết" : "View full details"}
            <ArrowUpRight size={17} />
          </Link>
        </div>
      </div>
    </div>
  );
}
