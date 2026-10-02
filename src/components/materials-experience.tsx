"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, Minus, Plus, Scan, Sprout } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { materials } from "@/lib/content";
import { detailsImages, materialImages } from "@/lib/imagery";
import { useMotion } from "@/lib/motion-context";
import { useLanguage } from "@/lib/language-context";
import { EditorialDialog } from "@/components/editorial-dialog";
import { MaterialQuickView } from "@/components/material-quick-view";

const profiles = [
  {
    tone: "pine", source: detailsImages.rawFiber,
    vi: { mood: "Mộc. Rõ từng sợi.", description: "Những đường sợi hiện lên trên nền vải màu tự nhiên. PineFiber bắt đầu từ lá dứa sau thu hoạch, hướng tới một bề mặt có cá tính mộc và cấu trúc dệt rõ nét.", composition: "Sợi lá dứa", feel: "Cấu trúc mộc, hướng linen", use: "Trang phục thường ngày · Túi · Phụ kiện", detail: "Một chiếc lá. Một khả năng mới.", source: "Lá dứa sau thu hoạch", caption: "Cận cảnh vải tham khảo cho hướng PineFiber.", keywords: ["Sắc tự nhiên", "Cấu trúc dệt", "Ứng dụng hằng ngày"] },
    en: { mood: "Raw. Every thread visible.", description: "Natural colour meets a visible woven structure. Starting with post-harvest pineapple leaves, PineFiber explores a material with a grounded character and a distinctly textured surface.", composition: "Pineapple leaf fibre", feel: "Raw, linen-inspired structure", use: "Everyday apparel · Bags · Accessories", detail: "One leaf. A new possibility.", source: "Post-harvest pineapple leaves", caption: "Close-up fabric reference for the PineFiber direction.", keywords: ["Natural colour", "Woven structure", "Everyday use"] },
  },
  {
    tone: "blend", source: detailsImages.blend,
    vi: { mood: "Hai nguồn sợi. Một cuộc gặp.", description: "Lá dứa và tơ sen cùng bước vào một thử nghiệm phối trộn. SenPine Blend tìm kiếm sự cân bằng giữa nét mộc của sợi lá và cảm giác tinh tế của tơ sen.", composition: "95% lá dứa / 5% tơ sen", feel: "Hướng mềm hơn, rũ nhẹ", use: "Áo sơ mi · Váy · Khăn choàng", detail: "Khi nét mộc gặp sự tinh tế.", source: "Lá dứa × cuống sen", caption: "Tham khảo hai nguồn sợi; chưa phải ảnh mẫu vải Blend hoàn thiện.", keywords: ["Phối trộn", "Hai nguồn thực vật", "Nghiên cứu bề mặt"] },
    en: { mood: "Two fibres. One encounter.", description: "Pineapple and lotus meet in an experimental blend. SenPine Blend explores a balance between the earthy character of leaf fibre and the delicacy of lotus silk.", composition: "95% pineapple / 5% lotus", feel: "A softer hand, a gentle drape", use: "Shirts · Dresses · Scarves", detail: "Where earthy meets delicate.", source: "Pineapple leaves × lotus stems", caption: "Reference for the two fibre sources, not a finished Blend fabric sample.", keywords: ["Experimental blend", "Two botanicals", "Surface research"] },
  },
  {
    tone: "silk", source: detailsImages.lotusSorting,
    vi: { mood: "Tinh tế. Từ những điều nhỏ.", description: "Từng đường tơ được rút từ cuống sen, kết nối với nhau bằng thời gian và sự tỉ mỉ. SenSilk dành một khoảng riêng cho kỹ nghệ thủ công và những thiết kế giới hạn.", composition: "Tơ từ cuống sen", feel: "Hướng nhẹ, mềm và thanh", use: "Khăn · Thiết kế giới hạn · Trang phục đặc biệt", detail: "Thời gian nằm trong từng đường tơ.", source: "Cuống sen, rút tơ thủ công", caption: "Bề mặt vải thêu hoa sen tham khảo cho hướng SenSilk.", keywords: ["Tơ sen", "Kỹ nghệ thủ công", "Thiết kế giới hạn"] },
    en: { mood: "Delicate. Down to the details.", description: "Threads drawn from lotus stems come together through time and careful hands. SenSilk makes room for craft and the quiet individuality of limited designs.", composition: "Lotus stem silk", feel: "A light, soft, delicate direction", use: "Scarves · Limited designs · Occasion wear", detail: "Time, held in every thread.", source: "Lotus stems, hand-extracted", caption: "Lotus-embroidered fabric reference for the SenSilk direction.", keywords: ["Lotus silk", "Handcraft", "Limited designs"] },
  },
] as const;

export function MaterialsExperience() {
  const root = useRef<HTMLElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const [selected, setSelected] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [quickViewMaterial, setQuickViewMaterial] = useState<string | null>(null);
  const { intro, reduced, enabled } = useMotion();
  const { lang } = useLanguage();
  const vi = lang === "vi";
  const text = (vietnamese: string, english: string) => vi ? vietnamese : english;
  const profile = profiles[selected][lang];
  const material = materials[selected];
  const quickMaterialObj = materials.find((m) => m.id === quickViewMaterial);

  useEffect(() => {
    if (intro !== "done" || !enabled || reduced || !root.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      const narrow = window.matchMedia("(max-width: 700px)").matches;
      gsap.from(".ml-cover-copy > *, .ml-cover-footer > *", { y: 34, opacity: 0, duration: 1.1, stagger: .1, ease: "power3.out", clearProps: "transform,opacity" });
      gsap.from(".ml-swatch-face", { y: 90, x: (i) => (i - 1) * 65, rotation: (i) => (i - 1) * 9, scale: .83, opacity: 0, duration: 1.5, stagger: .15, ease: "power3.out", clearProps: "transform,opacity" });
      gsap.utils.toArray<HTMLElement>(".ml-swatch").forEach((element, index) => {
        gsap.to(element, { x: (index - 1) * (narrow ? 45 : 150), y: -(50 + index * 55), rotation: (index - 1) * 13, scale: .85, opacity: .15, ease: "none", scrollTrigger: { trigger: ".ml-cover", start: "top top", end: "bottom top", scrub: .8 } });
      });
      gsap.utils.toArray<HTMLElement>(".ml-reveal").forEach((element) => {
        gsap.from(element, { y: 36, opacity: 0, duration: 1, ease: "power3.out", clearProps: "transform,opacity", scrollTrigger: { trigger: element, start: "top 94%", once: true } });
      });
      gsap.utils.toArray<HTMLElement>(".ml-material").forEach((section, index) => {
        const image = section.querySelector(".ml-material-photo img");
        const inset = section.querySelector(".ml-source-inset");
        gsap.fromTo(image, { scale: 1.18, yPercent: -3 }, { scale: 1, yPercent: 3, ease: "none", scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: .8 } });
        // Move the source sample independently from the section's links and copy.
        if (inset) gsap.timeline({ scrollTrigger: { trigger: section, start: "top 90%", end: "bottom top", scrub: .7 } })
          .fromTo(inset, { x: (index % 2 ? -1 : 1) * (narrow ? 24 : 70), y: 60, rotation: -7, opacity: 0 }, { x: 0, y: 0, rotation: 3, opacity: 1, duration: .35 })
          .to(inset, { x: 0, y: 0, duration: .35 })
          .to(inset, { x: (index % 2 ? 1 : -1) * 40, y: -65, rotation: 8, opacity: 0, duration: .3 });
      });
      gsap.from(".ml-process-card", { y: 65, rotation: (i) => (i - 1) * 4, opacity: 0, stagger: .13, duration: 1.2, ease: "power3.out", clearProps: "transform,opacity", scrollTrigger: { trigger: ".ml-process-grid", start: "top 90%", once: true } });
    }, root);
    const refresh = () => ScrollTrigger.refresh();
    // Image loading and fonts can change the geometry of scroll scenes.
    root.current.addEventListener("load", refresh, true);
    let disposed = false;
    document.fonts.ready.then(() => { if (!disposed) refresh(); });
    const element = root.current;
    return () => { disposed = true; element.removeEventListener("load", refresh, true); context.revert(); };
  }, [intro, reduced, enabled, lang]);

  function select(index: number) {
    setSelected(index);
    setZoom(1);
  }

  function onTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % materials.length;
    else if (event.key === "ArrowLeft") next = (index + materials.length - 1) % materials.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = materials.length - 1;
    else return;
    event.preventDefault();
    select(next);
    tabs.current[next]?.focus();
  }

  return (
    <main id="main" ref={root} className="materials-lab">
      <section className="ml-cover" aria-labelledby="ml-title">
        <div className="ml-cover-copy">
          <p className="ml-kicker"><span className="ml-dot" /> SENPINE / MATERIAL ATELIER</p>
          <h1 id="ml-title">{text("Tự nhiên.", "Natural.")}<br /><span>{text("Có kết cấu.", "With texture.")}</span></h1>
          <p className="ml-cover-description">{text("Một chiếc lá. Một đường tơ. Một bề mặt mới. Khám phá thế giới vật liệu SenPine, từ nguồn sợi đến từng nếp vải.", "A leaf. A thread. A new surface. Explore the SenPine material world, from botanical fibre to every fold of fabric.")}</p>
          <a href="#material-explorer" className="ml-button">{text("Khám phá chất liệu", "Explore the materials")}<ArrowDown size={17} /></a>
          <div className="ml-cover-note"><Sprout size={18} /><span>{text("LÁ DỨA × TƠ SEN", "PINEAPPLE × LOTUS")}<small>{text("Hai nguồn thực vật. Ba hướng vật liệu.", "Two botanicals. Three material directions.")}</small></span></div>
        </div>
        <div className="ml-specimen-board" aria-label={text("Ba mẫu hình ảnh vật liệu tham khảo", "Three material reference samples")}>
          <span className="ml-board-cross ml-board-cross-top" aria-hidden="true">+</span><span className="ml-board-cross ml-board-cross-bottom" aria-hidden="true">+</span>
          <span className="ml-board-coordinate">10° N / 105° E · VIETNAM</span>
          {materials.map((item, index) => <div key={item.id} className={`ml-swatch ml-swatch-${index}`}><div className="ml-swatch-face"><div className="ml-swatch-image"><Image src={materialImages[index].src} alt={materialImages[index].alt} fill sizes="(max-width: 700px) 48vw, 28vw" preload={index === 0} /></div><div className="ml-swatch-label"><span>{item.number} / {item.name}</span><small>{vi ? item.origin : item.originEn}</small></div></div></div>)}
          <div className="ml-board-stamp" aria-hidden="true"><span>FIBRE<br />TO FABRIC</span><ArrowUpRight size={25} /></div>
        </div>
        <div className="ml-cover-footer"><span>01 — 03 / {text("THƯ VIỆN VẬT LIỆU", "MATERIAL LIBRARY")}</span><span>{text("Chậm lại. Nhìn gần hơn.", "Slow down. Look closer.")}<ArrowDown size={15} /></span></div>
      </section>

      <nav className="ml-navigation" aria-label={text("Các phần của trang vật liệu", "Material page sections")}><a href="#material-explorer"><Scan size={16} />{text("Bàn mẫu", "Sample desk")}</a>{materials.map((item) => <a key={item.id} href={`#material-${item.id}`}><span>{item.number}</span>{item.name}</a>)}<a href="#material-compare">{text("So sánh", "Compare")}<ArrowUpRight size={14} /></a></nav>

      <section id="material-explorer" className="ml-explorer ml-section" aria-labelledby="ml-explorer-title">
        <div className="ml-section-heading ml-reveal"><p className="ml-kicker">01 / {text("NHÌN GẦN HƠN", "A CLOSER LOOK")}</p><h2 id="ml-explorer-title">{text("Vật liệu có", "Materials have")}<br /><em>{text("ngôn ngữ riêng.", "their own language.")}</em></h2><p>{text("Đổi mẫu, phóng lớn và quan sát. Từng đường dệt, sắc mộc và dấu tay thủ công đều kể một câu chuyện khác nhau.", "Switch samples, zoom in and observe. Every weave, natural shade and trace of handcraft tells a different story.")}</p></div>
        <div className="ml-workbench">
          <div className="ml-inspection">
            <div className="ml-inspection-top"><span><Scan size={15} /> {text("GÓC NHÌN VẬT LIỆU", "MATERIAL VIEW")}</span><span>{zoom.toFixed(1)}×</span></div>
            <div className="ml-inspection-viewport">{materialImages.map((image, index) => <div key={image.src} className={`ml-inspection-layer ${selected === index ? "is-selected" : ""}`} aria-hidden={selected !== index}><div className="ml-inspection-zoom" style={{ transform: `scale(${selected === index ? zoom : 1})` }}><Image src={image.src} alt={image.alt} fill sizes="(max-width: 800px) 90vw, 58vw" /></div></div>)}<span className="ml-inspection-cross ml-inspection-cross-a" aria-hidden="true" /><span className="ml-inspection-cross ml-inspection-cross-b" aria-hidden="true" /><span className="ml-inspection-id">{material.code}</span></div>
            <div className="ml-zoom-controls"><span>{text("Phóng đại", "Magnification")}</span><button type="button" onClick={() => setZoom((value) => Math.max(1, +(value - .25).toFixed(2)))} disabled={zoom <= 1} aria-label={text("Thu nhỏ vật liệu", "Zoom out material")}><Minus size={16} /></button><input type="range" min="1" max="2.5" step=".05" value={zoom} onChange={(event) => setZoom(Number(event.target.value))} aria-label={text("Mức phóng đại vật liệu", "Material magnification")} aria-valuetext={`${zoom.toFixed(2)}×`} /><button type="button" onClick={() => setZoom((value) => Math.min(2.5, +(value + .25).toFixed(2)))} disabled={zoom >= 2.5} aria-label={text("Phóng lớn vật liệu", "Zoom in material")}><Plus size={16} /></button></div>
          </div>
          <div className="ml-sample-panel">
            <div className="ml-sample-tabs" role="tablist" aria-label={text("Chọn mẫu vật liệu", "Choose a material sample")}>{materials.map((item, index) => <button key={item.id} ref={(element) => { tabs.current[index] = element; }} id={`ml-tab-${item.id}`} type="button" role="tab" aria-selected={selected === index} aria-controls="ml-sample-description" tabIndex={selected === index ? 0 : -1} onClick={() => select(index)} onKeyDown={(event) => onTabKey(event, index)} className={selected === index ? "is-selected" : ""}><span>{item.number}</span>{item.name}<ArrowUpRight size={17} /></button>)}</div>
            <div id="ml-sample-description" className="ml-sample-description" role="tabpanel" aria-labelledby={`ml-tab-${material.id}`} tabIndex={0}><p className="ml-kicker">{vi ? material.origin : material.originEn}</p><h3>{profile.mood}</h3><p>{profile.description}</p><div className="ml-tags">{profile.keywords.map((keyword) => <span key={keyword}>{keyword}</span>)}</div><div style={{ display: "flex", gap: "14px", alignItems: "center", flexWrap: "wrap", marginTop: "16px" }}><button type="button" className="ml-button" style={{ padding: "11px 18px", fontSize: "var(--type-control)", display: "inline-flex", alignItems: "center", gap: "8px" }} onClick={() => setQuickViewMaterial(material.id)}><ArrowUpRight size={16} />{text("Xem nhanh hồ sơ", "Quick view dossier")}</button><Link href={`/materials/${material.id}`} className="ml-text-link">{text("Mở hồ sơ vật liệu", "Open material profile")}<ArrowUpRight size={17} /></Link></div></div>
          </div>
        </div>
        <p className="ml-reference-note">{text("Ảnh tham khảo từ đề án. Blend minh họa nguồn sợi; hình SenSilk là vải thêu hoa sen. Cảm giác chạm và cấu trúc thực tế cần được xác nhận bằng mẫu thử.", "Reference images from the project. Blend illustrates fibre sources; SenSilk shows lotus embroidery. Actual hand-feel and structure must be confirmed through physical samples.")}</p>
      </section>

      <section className="ml-materials" aria-label={text("Ba hướng phát triển vật liệu", "Three material directions")}>
        {materials.map((item, index) => {
          const entry = profiles[index];
          const copy = entry[lang];
          return <article id={`material-${item.id}`} key={item.id} className={`ml-material ml-material-${entry.tone}`} aria-labelledby={`ml-heading-${item.id}`}>
            <div className="ml-material-visual"><div className="ml-material-photo"><Image src={materialImages[index].src} alt={materialImages[index].alt} fill sizes="(max-width: 800px) 100vw, 55vw" /></div><span className="ml-material-number" aria-hidden="true">{item.number}</span><div className="ml-source-inset"><div><Image src={entry.source.src} alt={entry.source.alt} fill sizes="(max-width: 800px) 30vw, 180px" /></div><span>{text("NGUỒN SỢI", "FIBRE SOURCE")} / {item.number}</span></div><div className="ml-photo-caption"><span>{item.code}</span><p>{copy.caption}</p></div></div>
            <div className="ml-material-copy ml-reveal"><p className="ml-kicker">{item.number} / {vi ? item.origin : material.originEn}</p><h2 id={`ml-heading-${item.id}`}>{item.name === "SenPine Blend" ? <>SenPine<br />Blend<span>.</span></> : <>{item.name}<span>.</span></>}</h2><h3>{copy.detail}</h3><p>{copy.description}</p><dl className="ml-material-facts"><div><dt>{text("Nguồn nguyên liệu", "Botanical source")}</dt><dd>{copy.source}</dd></div><div><dt>{text("Bề mặt định hướng", "Surface direction")}</dt><dd>{copy.feel}</dd></div><div><dt>{text("Ứng dụng định hướng", "Intended use")}</dt><dd>{copy.use}</dd></div></dl>
              {index === 1 && <div className="ml-blend-ratio"><div aria-hidden="true"><span /><span /></div><p><span>95% {text("lá dứa", "pineapple")}</span><span>5% {text("tơ sen", "lotus")}</span></p><small>{text("Tỷ lệ phối trộn đề xuất trong concept.", "Proposed blend ratio in the concept.")}</small></div>}
              <div style={{ display: "flex", gap: "14px", alignItems: "center", flexWrap: "wrap", marginTop: "16px" }}><button type="button" className="ml-button" style={{ padding: "11px 18px", fontSize: "var(--type-control)", display: "inline-flex", alignItems: "center", gap: "8px" }} onClick={() => setQuickViewMaterial(item.id)}><ArrowUpRight size={16} />{text("Xem nhanh hồ sơ", "Quick view dossier")}</button><Link href={`/materials/${item.id}`} className="ml-text-link">{text("Khám phá", "Explore")} {item.name}<ArrowUpRight size={18} /></Link></div></div>
          </article>;
        })}
      </section>

      <section className="ml-process ml-section" aria-labelledby="ml-process-title">
        <div className="ml-process-heading ml-reveal"><p className="ml-kicker">02 / {text("CẤU TRÚC BẮT ĐẦU TỪ ĐÂU?", "WHERE DOES TEXTURE BEGIN?")}</p><h2 id="ml-process-title">{text("Từ chiếc lá", "From a leaf")}<br /><em>{text("đến nếp vải.", "to a fold of fabric.")}</em></h2><p>{text("Một bề mặt không tự nhiên xuất hiện. Nó là kết quả của cách xơ được tách, sợi được kéo và từng đường dệt tìm thấy nhau.", "A surface takes shape through the way fibres are extracted, threads are spun and individual strands find each other in the weave.")}</p></div>
        <div className="ml-process-grid">{[{ image: detailsImages.extraction, title: text("Đánh thức xơ", "Release the fibre"), label: text("LÁ → XƠ", "LEAF → FIBRE"), body: text("Tách phần xơ nằm bên trong lá. Làm sạch và chuẩn bị cho hành trình tiếp theo.", "Extract the fibres inside a leaf. Clean and prepare them for the next stage.") }, { image: detailsImages.drying, title: text("Kết nối sợi", "Connect the threads"), label: text("XƠ → SỢI", "FIBRE → THREAD"), body: text("Xử lý, chải và kéo những xơ nhỏ thành sợi. Cấu trúc bắt đầu từ đây.", "Process, comb and spin fine fibres into continuous threads. Structure starts here.") }, { image: detailsImages.pinefiber, title: text("Dệt nên bề mặt", "Weave a surface"), label: text("SỢI → VẢI", "THREAD → FABRIC"), body: text("Sợi dọc gặp sợi ngang. Cách dệt mở ra những hướng bề mặt và độ rũ khác nhau.", "Warp meets weft. The weave opens up different possibilities for surface and drape.") }].map((step, index) => <article className="ml-process-card" key={step.label}><div className="ml-process-photo"><Image src={step.image.src} alt={step.image.alt} fill sizes="(max-width: 700px) 90vw, 30vw" /><span>0{index + 1}</span></div><p className="ml-kicker">{step.label}</p><h3>{step.title}</h3><p>{step.body}</p></article>)}</div>
        <Link href="/story#story-journey" className="ml-text-link">{text("Đi qua toàn bộ hành trình", "Follow the full journey")}<ArrowRight size={17} /></Link>
      </section>

      <section id="material-compare" className="ml-compare ml-section" aria-labelledby="ml-compare-title"><div className="ml-compare-heading ml-reveal"><div><p className="ml-kicker">03 / {text("ĐẶT CẠNH NHAU", "SIDE BY SIDE")}</p><h2 id="ml-compare-title">{text("Chọn từ chất liệu.", "Start with the material.")}</h2></div><p>{text("Mỗi hướng vật liệu có một vai trò. Bắt đầu từ nguồn sợi và ý đồ thiết kế của bạn.", "Each material direction has its own role. Start with the fibre source and your design intent.")}</p></div>
        <div className="ml-comparison-scroll" role="region" aria-label={text("Bảng so sánh vật liệu, có thể cuộn ngang", "Material comparison table, horizontally scrollable")} tabIndex={0}><table className="ml-comparison"><caption className="sr-only">{text("So sánh định hướng ba dòng vật liệu SenPine", "Compare the three SenPine material directions")}</caption><thead><tr><th scope="col">{text("Định hướng", "Direction")}</th>{materials.map((item) => <th key={item.id} scope="col"><span>{item.number}</span><Link href={`/materials/${item.id}`}>{item.name}<ArrowUpRight size={14} /></Link></th>)}</tr></thead><tbody><tr><th scope="row">{text("Thành phần đề xuất", "Proposed composition")}</th>{profiles.map((entry) => <td key={entry.tone}>{entry[lang].composition}</td>)}</tr><tr><th scope="row">{text("Tinh thần bề mặt", "Surface character")}</th>{profiles.map((entry) => <td key={entry.tone}>{entry[lang].feel}</td>)}</tr><tr><th scope="row">{text("Ứng dụng định hướng", "Intended use")}</th>{profiles.map((entry) => <td key={entry.tone}>{entry[lang].use}</td>)}</tr><tr><th scope="row">{text("Giá kế hoạch / mét", "Planned price / metre")}</th>{materials.map((item) => <td key={item.id} className="ml-price">{new Intl.NumberFormat(vi ? "vi-VN" : "en-US").format(item.price)} ₫</td>)}</tr></tbody></table></div>
        <p className="ml-reference-note">{text("Các hướng vật liệu và giá thuộc kế hoạch đề án, chưa phải thông số thương mại đã kiểm nghiệm. Thành phần, cảm giác chạm và hiệu năng cần được xác nhận qua mẫu thử.", "Material directions and prices are project plans, not tested commercial specifications. Composition, hand-feel and performance need to be validated through samples.")}</p>
      </section>

      <section className="ml-sample-cta" aria-labelledby="ml-cta-title"><div className="ml-cta-text ml-reveal"><p className="ml-kicker">{text("TỪ MÀN HÌNH ĐẾN ĐẦU NGÓN TAY", "FROM THE SCREEN TO YOUR FINGERTIPS")}</p><h2 id="ml-cta-title">{text("Thiết kế tiếp theo", "Your next design")}<br /><em>{text("bắt đầu từ một mẫu vải.", "starts with a swatch.")}</em></h2><p>{text("Khám phá bộ mẫu dự kiến dành cho nhà thiết kế, studio và thương hiệu. Để câu chuyện bắt đầu bằng chất liệu.", "Explore the planned sample set for designers, studios and brands. Let the material start the conversation.")}</p><Link href="/business/request-sample" className="ml-button">{text("Tìm hiểu bộ mẫu vật liệu", "Explore the sample set")}<ArrowUpRight size={18} /></Link></div><div className="ml-cta-photo"><Image src={detailsImages.rawFiber.src} alt={detailsImages.rawFiber.alt} fill sizes="(max-width: 700px) 100vw, 45vw" /><span>LET THE<br />MATERIAL<br />SPEAK.</span></div></section>

      {/* Material Dossier Quick Dialog */}
      <EditorialDialog
        isOpen={quickViewMaterial !== null}
        onClose={() => setQuickViewMaterial(null)}
        className="modal-material"
      >
        {quickMaterialObj && (
          <MaterialQuickView
            material={quickMaterialObj}
            lang={lang}
            onRequestSample={() => {
              setQuickViewMaterial(null);
              window.location.href = "/business/request-sample";
            }}
            onNavigate={() => setQuickViewMaterial(null)}
          />
        )}
      </EditorialDialog>
    </main>
  );
}
