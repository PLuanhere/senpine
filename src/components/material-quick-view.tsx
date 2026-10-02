"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Minus, Plus, Sprout, Layers3 } from "lucide-react";
import { currency, type materials } from "@/lib/content";
import { detailsImages, materialImages } from "@/lib/imagery";

type MaterialItem = (typeof materials)[number];

const materialMeta: Record<string, {
  moodVi: string;
  moodEn: string;
  feelVi: string;
  feelEn: string;
  useVi: string;
  useEn: string;
  sourceImg: { src: string; alt: string };
}> = {
  pinefiber: {
    moodVi: "Mộc. Rõ từng sợi.",
    moodEn: "Raw. Every thread visible.",
    feelVi: "Cấu trúc mộc, thoáng mát, hướng linen",
    feelEn: "Rustic structure, breathable, linen-inspired",
    useVi: "Trang phục thường ngày · Túi · Phụ kiện",
    useEn: "Everyday apparel · Bags · Accessories",
    sourceImg: detailsImages.harvest,
  },
  blend: {
    moodVi: "Giao thoa hai thế giới.",
    moodEn: "Harmony of two fibers.",
    feelVi: "Mềm mại, thoáng khí, độ rũ tự nhiên",
    feelEn: "Soft drape, breathable and resilient",
    useVi: "Áo sơ mi · Khăn choàng · Váy dáng dài",
    useEn: "Shirts · Scarves · Flowing dresses",
    sourceImg: detailsImages.extraction,
  },
  sensilk: {
    moodVi: "Tinh tế từ đầm sen.",
    moodEn: "Refined elegance from lotus.",
    feelVi: "Mịn màng, óng ánh tự nhiên",
    feelEn: "Silky luster with natural drape",
    useVi: "Khăn cao cấp · Thiết kế giới hạn · Trang phục nghi thức",
    useEn: "Luxury scarves · Limited editions · Ceremonial wear",
    sourceImg: detailsImages.sensilk,
  },
};

interface MaterialQuickViewProps {
  material: MaterialItem;
  lang?: "vi" | "en";
  onRequestSample?: () => void;
  onNavigate?: () => void;
}

export function MaterialQuickView({
  material,
  lang = "vi",
  onRequestSample,
  onNavigate,
}: MaterialQuickViewProps) {
  const [viewTab, setViewTab] = useState<0 | 1>(0);
  const [zoom, setZoom] = useState<number>(1);
  const vi = lang === "vi";

  const index = Math.max(0, Number(material.number) - 1);
  const fabricImg = materialImages[index] || detailsImages.pinefiber;
  const meta = materialMeta[material.id] || materialMeta.pinefiber;
  const activeImg = viewTab === 0 ? fabricImg : meta.sourceImg;

  const handleZoom = (delta: number) => {
    setZoom((prev) => {
      const next = Math.round((prev + delta) * 100) / 100;
      return Math.min(2.25, Math.max(1, next));
    });
  };

  return (
    <div className="dossier-dialog material-dossier-dialog">
      {/* Visual Column */}
      <div className="dossier-visual">
        <div className="dossier-tabs" role="tablist" aria-label={vi ? "Góc nhìn chất liệu" : "Material views"}>
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
            {vi ? "Bề mặt dệt" : "Fabric weave"}
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
            {vi ? "Nguồn nguyên liệu" : "Botanical source"}
          </button>
        </div>

        <div className="dossier-viewport">
          <div className="dossier-badge">
            <span>{material.code}</span>
            <small> • 0{material.number} / 03</small>
          </div>

          <div
            className="dossier-art-zoom"
            style={{ transform: `scale(${zoom})` }}
          >
            <Image
              src={activeImg.src}
              alt={activeImg.alt}
              fill
              sizes="(max-width: 840px) 92vw, 520px"
              style={{ objectFit: "cover" }}
              priority
            />
          </div>

          <div className="dossier-visual-meta">
            <Sprout size={14} />
            <span>{vi ? material.origin : material.originEn}</span>
          </div>
        </div>

        <div className="dossier-zoom">
          <button
            type="button"
            onClick={() => handleZoom(-0.25)}
            disabled={zoom <= 1}
            aria-label={vi ? "Thu nhỏ vật liệu" : "Zoom out material"}
          >
            <Minus size={15} />
          </button>
          <label htmlFor={`zoom-${material.id}`}>{vi ? "Phóng đại" : "Magnification"}</label>
          <input
            id={`zoom-${material.id}`}
            type="range"
            min="1"
            max="2.25"
            step="0.05"
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            aria-label={vi ? "Mức phóng đại vật liệu" : "Material magnification"}
            aria-valuetext={`${zoom.toFixed(2)}×`}
          />
          <span aria-live="polite">{zoom.toFixed(1)}×</span>
          <button
            type="button"
            onClick={() => handleZoom(0.25)}
            disabled={zoom >= 2.25}
            aria-label={vi ? "Phóng lớn vật liệu" : "Zoom in material"}
          >
            <Plus size={15} />
          </button>
        </div>
      </div>

      {/* Copy & Dossier Column */}
      <div className="dossier-copy">
        <p className="eyebrow">
          MATERIAL LAB / {vi ? material.origin : material.originEn}
        </p>
        <h2 id="modal-title">{material.name}</h2>
        <p className="dossier-subtitle">{vi ? meta.moodVi : meta.moodEn}</p>
        <p className="dossier-description">
          {vi ? material.detail : material.detailEn}
        </p>

        <dl className="dossier-specs">
          <div className="dossier-spec-row">
            <span>{vi ? "Thành phần định hướng" : "Intended composition"}</span>
            <strong>{material.specs[lang].composition}</strong>
          </div>
          <div className="dossier-spec-row">
            <span>{vi ? "Định lượng & Khổ vải" : "Weight & Width"}</span>
            <strong>
              {material.specs[lang].weightGsm} • {material.specs[lang].widthCm}
            </strong>
          </div>
          <div className="dossier-spec-row">
            <span>{vi ? "Cảm giác chạm" : "Tactile feel"}</span>
            <strong>{vi ? meta.feelVi : meta.feelEn}</strong>
          </div>
          <div className="dossier-spec-row">
            <span>{vi ? "Ứng dụng đề xuất" : "Proposed use"}</span>
            <strong>{vi ? meta.useVi : meta.useEn}</strong>
          </div>
          <div className="dossier-spec-row dossier-price-row">
            <span>{vi ? "Giá theo đề tài / mét" : "Research price / meter"}</span>
            <strong className="dossier-price-tag">
              {currency(material.price, lang)}
            </strong>
          </div>
        </dl>

        <p className="modal-note">
          {vi
            ? "Hình ảnh và dữ liệu tham khảo trong đề án SenPine. Thành phần, chất lượng và hiệu năng cần được xác nhận qua mẫu thử vật lý và kiểm nghiệm thực tế."
            : "Images and technical parameters represent SenPine project research directions. Physical validation and laboratory tests are required before commercial use."}
        </p>

        <div className="dossier-actions">
          {onRequestSample && (
            <button
              type="button"
              className="button button-dark"
              onClick={onRequestSample}
            >
              <Layers3 size={17} />
              {vi ? "Khám phá bộ mẫu" : "Explore sample kit"}
            </button>
          )}
          <Link
            href={`/materials/${material.id}`}
            className="text-link"
            onClick={onNavigate}
          >
            {vi ? "Xem trang vật liệu" : "Open material profile"}
            <ArrowUpRight size={17} />
          </Link>
        </div>
      </div>
    </div>
  );
}
