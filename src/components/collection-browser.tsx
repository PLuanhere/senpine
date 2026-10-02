"use client";

import Link from "next/link";
import { useRef, useState, type PointerEvent } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, MoveUpRight } from "lucide-react";
import { CollectionArtwork } from "@/components/collection-artwork";
import { currency, products } from "@/lib/content";
import { useLanguage } from "@/lib/language-context";
import { useMotion } from "@/lib/motion-context";

const filters = ["Tất cả", "Trang phục", "Phụ kiện"] as const;
const materialLabels = ["PineFiber", "SenPine Blend", "SenPine Blend", "PineFiber", "PineFiber", "PineFiber"];
const moods = ["THƯ THÁI", "NHẸ NHÀNG", "MỀM MẠI", "ĐỒNG HÀNH", "DẠO CHƠI", "GỌN GÀNG"];
const moodsEn = ["RELAXED", "EFFORTLESS", "SOFT", "EVERYDAY", "WEEKEND", "ESSENTIAL"];

function FiberLines({ className = "" }: { className?: string }) {
  return <svg className={`collection-fiber-lines ${className}`} viewBox="0 0 800 600" fill="none" aria-hidden="true">{Array.from({ length: 8 }, (_, i) => <path key={i} d={`M${-100 + i * 19} 630C${400 + i * 8} ${620 - i * 18} ${240 + i * 12} ${100 + i * 12} ${820 + i * 10} ${20 + i * 17}`} stroke="currentColor" strokeWidth=".8" />)}</svg>;
}

export function CollectionBrowser() {
  const { lang } = useLanguage();
  const { reduced, enabled, intro } = useMotion();
  const vi = lang === "vi";
  const [active, setActive] = useState<(typeof filters)[number]>("Tất cả");
  const [featured, setFeatured] = useState(0);
  const stage = useRef<HTMLDivElement>(null);
  const product = products[featured];
  const visible = products.filter((item) => active === "Tất cả" || item.category === active);
  const moving = enabled && !reduced;

  function moveSpotlight(event: PointerEvent<HTMLDivElement>) {
    if (!moving || event.pointerType !== "mouse") return;
    const box = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--pointer-x", `${((event.clientX - box.left) / box.width - .5) * 16}px`);
    event.currentTarget.style.setProperty("--pointer-y", `${((event.clientY - box.top) / box.height - .5) * 12}px`);
  }

  function resetSpotlight() {
    stage.current?.style.setProperty("--pointer-x", "0px");
    stage.current?.style.setProperty("--pointer-y", "0px");
  }

  return <div className="collection-experience" data-motion={moving ? "on" : "off"} data-ready={intro === "done"}>
    <section className="collection-showcase" aria-labelledby="collection-title">
      <div className="collection-intro">
        <p className="eyebrow">03 / THE EVERYDAY COLLECTION</p>
        <p className="collection-edition"><span />SENPINE DESIGN STUDIES — 01</p>
        <h1 id="collection-title">{vi ? <>Tự nhiên.<br />Trong từng<br />{" "}<em>ngày.</em></> : <>Naturally.<br />Every single<br />{" "}<em>day.</em></>}</h1>
        <p className="collection-intro-text">{vi ? "Mặc một chút thiên nhiên. Mang theo một chút bình yên. Khám phá những thiết kế từ sợi lá dứa và tơ sen." : "Wear a little nature. Carry a little calm. Explore everyday designs inspired by pineapple fiber and lotus silk."}</p>
        <Link href="#collection-designs" className="collection-explore">{vi ? "Khám phá 6 thiết kế" : "Explore 6 designs"}<span><ArrowDown size={18} /></span></Link>
        <div className="collection-intro-foot"><span>06 {vi ? "THIẾT KẾ" : "DESIGNS"}</span><span>02 {vi ? "NHÓM SẢN PHẨM" : "CATEGORIES"}</span><span>01 {vi ? "TINH THẦN TỰ NHIÊN" : "NATURAL SPIRIT"}</span></div>
      </div>

      <div ref={stage} className="collection-stage" onPointerMove={moveSpotlight} onPointerLeave={resetSpotlight}>
        <FiberLines />
        <span className="collection-stage-label">{vi ? "GÓC TRƯNG BÀY" : "DESIGN SPOTLIGHT"}<span>EST. SENPINE</span></span>
        <div className="collection-orbit collection-orbit-one" aria-hidden="true" />
        <div className="collection-orbit collection-orbit-two" aria-hidden="true" />
        <span className="collection-spark collection-spark-one" aria-hidden="true">✳</span><span className="collection-spark collection-spark-two" aria-hidden="true">+</span>
        <div className="collection-stage-word" aria-hidden="true">everyday</div>
        <div className="collection-stage-center" key={product.id}>
          <Link className="collection-feature-object" href={`/products/${product.slug}`} aria-label={`${vi ? "Khám phá" : "Explore"} ${vi ? product.name : product.english}`}><CollectionArtwork id={product.id} /></Link>
          <span className="collection-pedestal" aria-hidden="true" />
          <span className="collection-material-tag"><span />{materialLabels[product.id]}<small>{vi ? "SỢI THỰC VẬT" : "BOTANICAL FIBER"}</small></span>
        </div>
        <button className="collection-satellite collection-satellite-left" onClick={() => setFeatured((featured + 3) % products.length)} aria-label={`${vi ? "Trưng bày" : "Show"} ${vi ? products[(featured + 3) % products.length].name : products[(featured + 3) % products.length].english}`}><CollectionArtwork id={(featured + 3) % products.length} /><span>{materialLabels[(featured + 3) % products.length]}<MoveUpRight size={13} /></span></button>
        <button className="collection-satellite collection-satellite-right" onClick={() => setFeatured((featured + 4) % products.length)} aria-label={`${vi ? "Trưng bày" : "Show"} ${vi ? products[(featured + 4) % products.length].name : products[(featured + 4) % products.length].english}`}><CollectionArtwork id={(featured + 4) % products.length} /><span>{vi ? "Chi tiết tự nhiên" : "Natural details"}<MoveUpRight size={13} /></span></button>
        <div className="collection-feature-info">
          <div aria-live="polite" aria-atomic="true"><p>{String(featured + 1).padStart(2, "0")} / 06 <span>{vi ? product.category : product.categoryEn}</span></p><h2>{vi ? product.name : product.english}</h2><Link href={`/products/${product.slug}`}>{vi ? "Xem thiết kế" : "Explore design"}<ArrowUpRight size={17} /></Link></div>
          <div className="collection-stage-controls"><button onClick={() => setFeatured((featured + products.length - 1) % products.length)} aria-label={vi ? "Thiết kế trước" : "Previous design"}><ArrowLeft size={19} /></button><button onClick={() => setFeatured((featured + 1) % products.length)} aria-label={vi ? "Thiết kế tiếp theo" : "Next design"}><ArrowRight size={19} /></button></div>
        </div>
      </div>
    </section>

    <div className="collection-ribbon" aria-hidden="true"><span>PINEAPPLE FIBER</span><span>✳</span><span>MADE FOR EVERYDAY</span><span>✳</span><span>LOTUS SILK</span><span>✳</span><span>DESIGNED WITH NATURE</span></div>

    <section className="collection-catalog" id="collection-designs" aria-labelledby="collection-catalog-title">
      <div className="collection-catalog-heading"><div><p className="eyebrow">{vi ? "MẶC & MANG THEO" : "WEAR & CARRY"}</p><h2 id="collection-catalog-title">{vi ? <>Những điều <em>gần gũi.</em></> : <>Everyday <em>essentials.</em></>}</h2></div><p>{vi ? "Phom dáng giản dị. Chi tiết có chủ đích.\nMột tủ đồ nhỏ, nhiều cách đồng hành." : "Simple silhouettes. Thoughtful details.\nA small wardrobe, endless possibilities."}</p></div>
      <div className="collection-toolbar"><div className="collection-filter" role="group" aria-label={vi ? "Lọc bộ sưu tập" : "Filter collection"}>{filters.map((filter, i) => <button key={filter} className={active === filter ? "active" : ""} aria-pressed={active === filter} aria-controls="collection-grid" onClick={() => setActive(filter)}>{vi ? filter : ["All designs", "Apparel", "Accessories"][i]}<span>{filter === "Tất cả" ? products.length : products.filter((item) => item.category === filter).length}</span></button>)}</div><p className="collection-result-count" role="status">{String(visible.length).padStart(2, "0")} {vi ? "thiết kế" : "designs"}</p></div>

      <div className="collection-grid" id="collection-grid" key={active}>
        {visible.map(item => <Link key={item.slug} href={`/products/${item.slug}`} className={`editorial-card collection-design-card collection-design-card-${item.id}`}>
          <div className="collection-design-visual">
            <span className="collection-design-number">SP / {String(item.id + 1).padStart(2, "0")}</span><span className="collection-design-mood">{vi ? moods[item.id] : moodsEn[item.id]}</span>
            <span className="collection-design-ring" aria-hidden="true" /><span className="collection-design-shadow" aria-hidden="true" /><CollectionArtwork id={item.id} />
            <span className="collection-design-material">{materialLabels[item.id]}</span><span className="collection-design-arrow"><ArrowUpRight size={21} /></span>
          </div>
          <div className="collection-design-details"><div><p>{vi ? item.category : item.categoryEn}<span className={`collection-color-dot collection-color-${item.color.toLowerCase()}`} aria-hidden="true" /><span>{vi ? item.color : item.colorEn}</span></p><h3>{vi ? item.name : item.english}</h3><span className="collection-design-english">{vi ? item.english : item.name}</span></div><span className="collection-design-price">{currency(item.price, lang)}<small>{vi ? "Giá dự kiến" : "Estimated price"}</small></span></div>
        </Link>)}
      </div>
      <p className="collection-concept-note"><span>✳</span>{vi ? "Bộ sưu tập concept · Hình vẽ minh họa hướng thiết kế. Sản phẩm đang trong giai đoạn đề xuất, chưa mở bán." : "Concept collection · Illustrations represent proposed designs. Products are in development and are not available for sale."}</p>
    </section>

    <section className="collection-material-footer"><FiberLines /><span className="collection-footer-flower" aria-hidden="true">✳</span><div><p className="eyebrow">{vi ? "SAU MỖI THIẾT KẾ, MỘT CÂU CHUYỆN SỢI." : "BEHIND EVERY DESIGN, A FIBER STORY."}</p><h2>{vi ? "Bắt đầu từ chất liệu." : "It starts with the fiber."}</h2></div><Link href="/materials">{vi ? "Khám phá Material Lab" : "Explore Material Lab"}<ArrowUpRight size={21} /></Link></section>
  </div>;
}
