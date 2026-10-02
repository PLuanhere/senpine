"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState, type PointerEvent } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Fingerprint, Heart, Leaf, MapPin, Maximize2, Minus, Plus, ScanLine, Sprout, Users, X } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CollectionArtwork } from "@/components/collection-artwork";
import { aboutMaterials, aboutProcess, aboutProductNotes, aboutRoadmap, aboutValues } from "@/lib/about-content";
import { corporateInfo, products } from "@/lib/content";
import { detailsImages, productImages } from "@/lib/imagery";
import { useLanguage } from "@/lib/language-context";
import { useMotion } from "@/lib/motion-context";
import { useSaved } from "@/lib/store";

function ChoiceTabs({ labels, selected, onSelect, label, id }: { labels: readonly string[]; selected: number; onSelect: (index: number) => void; label: string; id: string }) {
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  return <div className="ab-tabs" role="tablist" aria-label={label}>
    {labels.map((name, index) => <button key={name} ref={(element) => { buttons.current[index] = element; }} type="button" role="tab" id={`${id}-tab-${index}`} aria-selected={selected === index} aria-controls={`${id}-panel`} tabIndex={selected === index ? 0 : -1} onClick={() => onSelect(index)} onKeyDown={(event) => {
      let next = index;
      if (event.key === "ArrowRight") next = (index + 1) % labels.length;
      else if (event.key === "ArrowLeft") next = (index + labels.length - 1) % labels.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = labels.length - 1;
      else return;
      event.preventDefault(); onSelect(next); buttons.current[next]?.focus();
    }}>{name}</button>)}
  </div>;
}

function Threads({ className = "" }: { className?: string }) {
  return <svg className={`ab-threads ${className}`} viewBox="0 0 1000 550" fill="none" aria-hidden="true">{Array.from({ length: 9 }, (_, i) => <path key={i} pathLength="1" d={`M${-100 + i * 22} 520C${280 + i * 11} ${620 - i * 28} ${540 - i * 20} ${-120 + i * 20} 1100 ${50 + i * 23}`} stroke="currentColor" strokeWidth=".7" />)}</svg>;
}

export function AboutExperience() {
  const root = useRef<HTMLElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const uid = useId().replace(/:/g, "");
  const [material, setMaterial] = useState(0);
  const [business, setBusiness] = useState(0);
  const [process, setProcess] = useState(0);
  const [phase, setPhase] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [productView, setProductView] = useState(0);
  const [zoom, setZoom] = useState(1);
  const { lang } = useLanguage();
  const { enabled, intro, reduced } = useMotion();
  const { saved, toggle } = useSaved();
  const vi = lang === "vi";
  const moving = enabled && !reduced;
  const text = (vietnamese: string, english: string) => vi ? vietnamese : english;
  const currentMaterial = aboutMaterials[material];
  const currentPhase = aboutRoadmap[phase];
  const product = products[selectedProduct ?? 0];
  const materialTabId = `${uid}-material`;
  const businessTabId = `${uid}-business`;
  const futureTabId = `${uid}-future`;
  const viewTabId = `${uid}-view`;

  useEffect(() => {
    if (!root.current || intro !== "done" || !moving) return;
    gsap.registerPlugin(ScrollTrigger);
    const reveals = new Map<HTMLElement, gsap.core.Tween>();
    const context = gsap.context(() => {
      gsap.from(".ab-hero-copy > *, .ab-hero-bottom > *", { y: 35, opacity: 0, duration: 1.2, stagger: .11, ease: "power3.out", clearProps: "transform,opacity" });
      gsap.from(".ab-hero-frame-inner", { y: 110, rotation: -12, scale: .8, opacity: 0, duration: 1.7, stagger: .16, ease: "power3.out", clearProps: "transform,opacity" });
      gsap.to(".ab-hero-background", { scale: 1.13, yPercent: 7, ease: "none", scrollTrigger: { trigger: ".ab-hero", start: "top top", end: "bottom top", scrub: 1 } });
      gsap.utils.toArray<HTMLElement>(".ab-hero-frame").forEach((element, index) => {
        gsap.to(element, { x: index ? 85 : -65, y: index ? -140 : -80, rotation: index ? 10 : -10, scale: .85, opacity: .15, ease: "none", scrollTrigger: { trigger: ".ab-hero", start: "top top", end: "bottom top", scrub: .8 } });
      });
      gsap.utils.toArray<HTMLElement>(".ab-reveal").forEach((element) => {
        reveals.set(element, gsap.from(element, { y: 35, opacity: 0, duration: 1, ease: "power3.out", clearProps: "transform,opacity", scrollTrigger: { trigger: element, start: "top 94%", once: true } }));
      });
      gsap.utils.toArray<HTMLElement>(".ab-product-entry").forEach((element, index) => {
        reveals.set(element, gsap.from(element, { x: (index % 3 - 1) * 45, y: 65, rotation: (index % 3 - 1) * 3, scale: .95, opacity: 0, duration: 1.15, delay: index % 3 * .1, ease: "power3.out", clearProps: "transform,opacity", scrollTrigger: { trigger: element, start: "top 96%", once: true } }));
      });
      gsap.utils.toArray<HTMLElement>(".ab-count").forEach((element) => {
        gsap.from(element, { textContent: 0, snap: { textContent: 1 }, duration: 1.4, ease: "power2.out", scrollTrigger: { trigger: element, start: "top 94%", once: true } });
      });
      gsap.utils.toArray<HTMLElement>(".ab-parallax").forEach((element) => {
        gsap.fromTo(element, { scale: 1.12, yPercent: -3 }, { scale: 1.01, yPercent: 3, ease: "none", scrollTrigger: { trigger: element.parentElement, start: "top bottom", end: "bottom top", scrub: .8 } });
      });
      gsap.fromTo(".ab-values .ab-threads path", { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, stagger: .05, ease: "none", scrollTrigger: { trigger: ".ab-values", start: "top 85%", end: "bottom 35%", scrub: 1 } });
    }, root);
    const element = root.current;
    const refresh = () => ScrollTrigger.refresh();
    let resizeFrame = 0;
    const resize = new ResizeObserver(() => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(refresh);
    });
    resize.observe(element);
    const onFocus = (event: FocusEvent) => {
      if (!(event.target instanceof Element)) return;
      for (const [target, tween] of reveals) if (target.contains(event.target)) tween.delay(0).progress(1);
    };
    let disposed = false;
    element.addEventListener("load", refresh, true);
    element.addEventListener("focusin", onFocus);
    document.fonts.ready.then(() => { if (!disposed) refresh(); });
    return () => { disposed = true; cancelAnimationFrame(resizeFrame); resize.disconnect(); element.removeEventListener("load", refresh, true); element.removeEventListener("focusin", onFocus); context.revert(); };
  }, [intro, moving, lang]);

  useEffect(() => {
    const element = root.current?.querySelector<HTMLElement>(".ab-hero");
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => { element.dataset.visible = String(entry.isIntersecting); });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const modal = dialog.current;
    if (selectedProduct === null || !modal) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (!modal.open) modal.showModal();
    return () => { document.body.style.overflow = previousOverflow; };
  }, [selectedProduct]);

  function openProduct(id: number) {
    returnFocus.current = document.activeElement as HTMLElement | null;
    setProductView(0); setZoom(1); setSelectedProduct(id);
  }

  function tilt(event: PointerEvent<HTMLElement>) {
    if (!moving || event.pointerType !== "mouse") return;
    const box = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--ab-rx", `${-((event.clientY - box.top) / box.height - .5) * 9}deg`);
    event.currentTarget.style.setProperty("--ab-ry", `${((event.clientX - box.left) / box.width - .5) * 12}deg`);
  }

  function resetTilt(event: PointerEvent<HTMLElement>) {
    event.currentTarget.style.setProperty("--ab-rx", "0deg");
    event.currentTarget.style.setProperty("--ab-ry", "0deg");
  }

  const formatPrice = (price: number) => `${new Intl.NumberFormat(vi ? "vi-VN" : "en-US").format(price)} ₫`;
  const valueIcons = [Leaf, Fingerprint, ScanLine, Users];

  return <main id="main" ref={root} className="about-experience" data-animate={moving && intro === "done"}>
    <section className="ab-hero" aria-labelledby="ab-title">
      <div className="ab-hero-background"><Image src="/images/origins.webp" alt={text("Minh họa hoa sen, lá dứa và bề mặt vải tự nhiên", "Illustration of lotus, pineapple leaves and natural fabric")} fill sizes="100vw" preload /></div>
      <div className="ab-hero-shade" />
      <div className="ab-hero-copy">
        <p className="ab-eyebrow"><span className="ab-dot" /> ABOUT SENPINE / VIETNAM</p>
        <h1 id="ab-title">{text("Từ thiên nhiên Việt.", "From Vietnamese nature.")}<br /><em>{text("Dệt nên đời sống mới.", "Weave a new everyday.")}</em></h1>
        <p>{text("Chúng tôi hình dung một tương lai nơi lá dứa và tơ sen tìm thấy giá trị mới — trong vật liệu, trong thiết kế và trong cách con người kết nối với tự nhiên.", "We imagine a future where pineapple leaves and lotus silk find new value — in materials, in design and in the way people connect with nature.")}</p>
        <a href="#about-identity" className="ab-button ab-button-light">{text("Gặp gỡ SenPine", "Meet SenPine")}<ArrowDown size={17} /></a>
        <span className="ab-project-status"><span />{text("Đề án nghiên cứu & khởi nghiệp đang phát triển", "A research and entrepreneurship project in development")}</span>
      </div>
      <div className="ab-hero-gallery">
        {[3, 0].map((id, index) => <div key={id} className={`ab-hero-frame ab-hero-frame-${index}`}><div className="ab-hero-frame-inner"><button type="button" onClick={() => openProduct(id)} aria-label={`${text("Xem nhanh", "Quick view")} ${vi ? products[id].name : products[id].english}`}><CollectionArtwork id={id} className="ab-hero-object" /><span>0{id + 1} / {vi ? products[id].name : products[id].english}<ArrowUpRight size={15} /></span></button></div></div>)}
        <span className="ab-hero-circle" aria-hidden="true">SEN × PINE<br />NATURE × DESIGN</span>
        <span className="ab-hero-gallery-label">DESIGN STUDIES / SENPINE</span>
      </div>
      <div className="ab-hero-bottom"><span>LOTUS SILK × PINEAPPLE FIBRE</span><a href="#about-showroom">{text("Khám phá các thiết kế", "Discover the designs")}<ArrowDown size={14} /></a></div>
    </section>

    <nav className="ab-navigation" aria-label={text("Các phần giới thiệu SenPine", "About SenPine sections")}>
      {[["about-identity", text("Chúng tôi là ai", "Who we are")], ["about-values", text("Tầm nhìn & Giá trị", "Vision & Values")], ["about-materials", text("Vật liệu", "Materials")], ["about-showroom", text("Thiết kế", "Designs")], ["about-process", text("Quy trình", "Process")], ["about-future", text("Tương lai", "Our future")]].map(([id, label], index) => <a key={id} href={`#${id}`}><span>0{index + 1}</span>{label}</a>)}
    </nav>

    <section id="about-identity" className="ab-identity ab-section" aria-labelledby="ab-identity-title">
      <div className="ab-identity-photo"><Image src={detailsImages.mekong.src} alt={detailsImages.mekong.alt} fill sizes="(max-width: 800px) 90vw, 40vw" className="ab-parallax" /><span className="ab-photo-label"><MapPin size={15} />{text("CẢM HỨNG TỪ ĐỒNG BẰNG SÔNG CỬU LONG", "INSPIRED BY THE MEKONG DELTA")}</span><div className="ab-name-tag"><span>Sen</span><Plus size={20} /><span>Pine</span><small>{text("BẢN SẮC VIỆT × SỢI LÁ DỨA", "VIETNAMESE IDENTITY × PINEAPPLE FIBRE")}</small></div></div>
      <div className="ab-identity-copy ab-reveal">
        <p className="ab-eyebrow">01 / {text("CHÚNG TÔI LÀ AI", "WHO WE ARE")}</p>
        <h2 id="ab-identity-title">{text("Một thương hiệu.", "One brand.")}<br /><em>{text("Nhiều mối kết nối.", "Many connections.")}</em></h2>
        <p>{text("SenPine là đề án khởi nghiệp về vật liệu dệt từ sợi lá dứa và tơ sen, kết nối nghiên cứu vật liệu với thiết kế thời trang và phụ kiện. Lá dứa là nền tảng cho hướng ứng dụng; tơ sen dành một khoảng riêng cho kỹ nghệ thủ công và những dòng giới hạn.", "SenPine is a venture concept for textiles made from pineapple leaf fibre and lotus silk, connecting material research with fashion and accessories. Pineapple forms the practical foundation; lotus makes room for handcraft and limited material directions.")}</p>
        <p>{text("“Sen” mang hình ảnh và bản sắc Việt. “Pine” gợi nhắc nguồn sợi lá dứa. Hai phần tên gọi gặp nhau trong một mong muốn: tạo ra chất liệu có ý nghĩa, rồi đưa chất liệu ấy đến gần đời sống.", "“Sen” carries Vietnamese identity and the lotus. “Pine” points to pineapple leaf fibre. The two meet in a shared ambition: develop meaningful materials and bring them closer to everyday life.")}</p>
        <dl className="ab-company-facts"><div><dt>{text("Tên doanh nghiệp đề xuất", "Proposed company name")}</dt><dd>{vi ? corporateInfo.name : corporateInfo.nameEn}</dd></div><div><dt>{text("Mô hình định hướng", "Intended model")}</dt><dd>B2B2C · {text("Vật liệu & thiết kế ứng dụng", "Materials & design applications")}</dd></div><div><dt>{text("Điểm khởi đầu", "Project origin")}</dt><dd>{text("Đề án học thuật tại IUH · Nhóm 4", "Academic project at IUH · Group 4")}</dd></div><div><dt>{text("Giai đoạn hiện tại", "Current stage")}</dt><dd>{text("Lập kế hoạch & phát triển concept", "Planning & concept development")}</dd></div></dl>
        <Link href="/story" className="ab-text-link">{text("Đọc câu chuyện khởi nguồn", "Read the origin story")}<ArrowUpRight size={17} /></Link>
      </div>
    </section>

    <div className="ab-numbers">{[{ number: 2, label: text("Nguồn sợi thực vật", "Botanical sources") }, { number: 3, label: text("Hướng vật liệu", "Material directions") }, { number: 6, label: text("Thiết kế minh họa", "Design concepts") }, { number: 42, label: text("Tháng trong kế hoạch", "Months in the plan") }].map((item) => <div key={item.number}><span className="ab-count">{item.number}</span><span>{item.label}</span></div>)}</div>

    <section id="about-values" className="ab-values ab-section" aria-labelledby="ab-values-title">
      <Threads />
      <div className="ab-values-heading ab-reveal"><p className="ab-eyebrow">02 / {text("TẦM NHÌN & SỨ MỆNH", "VISION & MISSION")}</p><h2 id="ab-values-title">{text("Để mỗi đường sợi", "Let every thread")}<br /><em>{text("đi xa hơn chính nó.", "become something more.")}</em></h2><p>{text("Tầm nhìn của SenPine là xây dựng một thương hiệu vật liệu mang bản sắc Việt, có khả năng ứng dụng trong thời trang hiện đại. Sứ mệnh bắt đầu từ nghiên cứu nguồn sợi, phát triển mẫu và kết nối những người cùng tạo ra giá trị.", "Our vision is a material brand with Vietnamese identity and a place in contemporary fashion. Our mission starts with fibre research, sample development and connections between the people who create value together.")}</p></div>
      <div className="ab-values-grid">{aboutValues.map((value, index) => { const Icon = valueIcons[index]; return <article key={value.icon} className="ab-value ab-reveal"><div><Icon size={25} strokeWidth={1.2} /><span>0{index + 1}</span></div><h3>{value[lang].title}</h3><p>{value[lang].body}</p></article>; })}</div>
      <Link href="/sustainability" className="ab-text-link">{text("Khám phá định hướng bền vững", "Explore our sustainability direction")}<ArrowUpRight size={17} /></Link>
    </section>

    <section className="ab-business ab-section" aria-labelledby="ab-business-title">
      <div className="ab-business-intro ab-reveal"><p className="ab-eyebrow">{text("MÔ HÌNH KẾT NỐI", "A CONNECTED MODEL")} / B2B2C</p><h2 id="ab-business-title">{text("Từ người làm sợi", "From fibre makers")}<br /><em>{text("đến người mặc.", "to the wearer.")}</em></h2><p>{text("SenPine được hình dung là cầu nối giữa vùng nguyên liệu, nghiên cứu vật liệu, thương hiệu và người sử dụng. Hai hướng tiếp cận bổ trợ nhau trong cùng một chuỗi giá trị.", "SenPine is envisioned as a link between botanical sources, material research, brands and users. Two complementary approaches belong to one value chain.")}</p><div className="ab-value-chain">{[text("Nông hộ / HTX", "Growers / Co-ops"), "SenPine", text("Thương hiệu", "Brands"), text("Người dùng", "People")].map((label, i) => <span key={label}>{label}{i < 3 && <ArrowRight size={12} />}</span>)}</div></div>
      <div className="ab-business-panel"><ChoiceTabs id={businessTabId} labels={[text("B2B / Đối tác vật liệu", "B2B / Material partners"), text("B2C / Trải nghiệm thiết kế", "B2C / Design experience")]} selected={business} onSelect={setBusiness} label={text("Khám phá mô hình kinh doanh", "Explore the business model")} /><div id={`${businessTabId}-panel`} role="tabpanel" aria-labelledby={`${businessTabId}-tab-${business}`} tabIndex={0} className="ab-business-detail" key={business}><span className="ab-business-letter" aria-hidden="true">{business === 0 ? "B2B" : "B2C"}</span><h3>{business === 0 ? text("Cùng phát triển từ một mẫu vải.", "Develop together, starting with a swatch.") : text("Để chất liệu bước vào đời sống.", "Bring materials into everyday life.")}</h3><p>{business === 0 ? text("Dành cho nhà thiết kế, studio, thương hiệu thời trang và doanh nghiệp dệt may quan tâm tới vật liệu thực vật. Hướng hợp tác gồm bộ mẫu, trao đổi nhu cầu và phát triển phương án ứng dụng.", "For designers, studios, fashion brands and textile businesses exploring botanical materials. Proposed collaboration includes samples, requirements and application development.") : text("Bộ sưu tập minh họa giúp người dùng khám phá phom dáng, nhóm vật liệu và ý tưởng ứng dụng. Website có lưu thiết kế, giỏ trải nghiệm và hồ sơ truy xuất mẫu để kết nối toàn bộ câu chuyện.", "The concept collection helps people explore silhouettes, material families and application ideas. Saved designs, a demo bag and sample traceability profiles connect the full story.")}</p><ul>{(business === 0 ? [text("Khám phá ba hướng vật liệu", "Explore three material directions"), text("Tìm hiểu bộ mẫu và nhu cầu ứng dụng", "Discuss samples and applications"), text("Trao đổi phương án hợp tác", "Explore a collaboration brief")] : [text("Khám phá sáu nhóm thiết kế", "Explore six design concepts"), text("Lưu các thiết kế yêu thích", "Save your favourite designs"), text("Theo dấu hồ sơ vật liệu mẫu", "Explore sample material passports")]).map((label) => <li key={label}><Check size={14} />{label}</li>)}</ul><Link href={business === 0 ? "/business" : "/collection"} className="ab-text-link">{business === 0 ? text("Khám phá hướng hợp tác", "Explore partnerships") : text("Đến bộ sưu tập", "Explore the collection")}<ArrowUpRight size={17} /></Link></div></div>
    </section>

    <section id="about-materials" className="ab-materials ab-section" aria-labelledby="ab-material-title">
      <div className="ab-section-heading ab-reveal"><div><p className="ab-eyebrow">03 / {text("TRIẾT LÝ VẬT LIỆU", "MATERIAL PHILOSOPHY")}</p><h2 id="ab-material-title">{text("Hiểu sợi.", "Know the fibre.")} <em>{text("Rồi mới thiết kế.", "Then design.")}</em></h2></div><p>{text("Ba hướng phát triển, cùng một điểm bắt đầu: hiểu nguồn nguyên liệu trước khi quyết định nó sẽ trở thành điều gì.", "Three directions, one starting point: understand the source before deciding what it might become.")}</p></div>
      <ChoiceTabs id={materialTabId} labels={aboutMaterials.map((entry) => entry.name)} selected={material} onSelect={setMaterial} label={text("Chọn hướng vật liệu", "Select a material direction")} />
      <div id={`${materialTabId}-panel`} role="tabpanel" aria-labelledby={`${materialTabId}-tab-${material}`} tabIndex={0} className="ab-material-panel"><div className="ab-material-image" key={currentMaterial.id}><Image src={currentMaterial.image.src} alt={currentMaterial.image.alt} fill sizes="(max-width: 800px) 90vw, 48vw" /><span>0{material + 1} / {currentMaterial.name}</span></div><div className="ab-material-description" key={`copy-${material}`}><p className="ab-eyebrow">{currentMaterial[lang].origin}</p><h3>{currentMaterial[lang].title}</h3><p>{currentMaterial[lang].text}</p><dl><div><dt>{text("Thành phần định hướng", "Intended composition")}</dt><dd>{currentMaterial[lang].composition}</dd></div><div><dt>{text("Ứng dụng đề xuất", "Proposed applications")}</dt><dd>{currentMaterial[lang].use}</dd></div></dl><Link href={`/materials/${currentMaterial.id}`} className="ab-text-link">{text("Mở hồ sơ", "Open profile")} {currentMaterial.name}<ArrowUpRight size={17} /></Link></div></div>
      <p className="ab-note">{text("Ảnh và thông tin thể hiện định hướng đề án. Thành phần, chất lượng và hiệu năng cần được xác nhận bằng mẫu thử và dữ liệu kiểm nghiệm.", "Images and information represent project directions. Composition, quality and performance require physical samples and validated test data.")}</p>
    </section>

    <section id="about-showroom" className="ab-showroom ab-section" aria-labelledby="ab-showroom-title">
      <div className="ab-section-heading ab-reveal"><div><p className="ab-eyebrow">04 / DESIGN SHOWROOM</p><h2 id="ab-showroom-title">{text("Ý tưởng có", "Ideas take")}<br /><em>{text("hình dáng riêng.", "their own shape.")}</em></h2></div><p>{text("Chạm vào một khung thiết kế để xem gần hơn. Khám phá hình dáng, ảnh tham khảo và nguồn vật liệu, hoặc lưu lại một ý tưởng bạn yêu thích.", "Open a design frame for a closer look. Explore silhouettes, references and material sources, or save an idea you love.")}</p></div>
      <div className="ab-product-grid">{products.map((item) => <article className="ab-product-entry" key={item.id}><div className={`ab-product-visual ab-product-tone-${item.id % 3}`} onPointerMove={tilt} onPointerLeave={resetTilt}><div className="ab-frame-tilt"><span className="ab-product-code">SP / 0{item.id + 1}</span><span className="ab-product-category">{vi ? item.category : item.categoryEn}</span><button type="button" className="ab-product-open" onClick={() => openProduct(item.id)} aria-label={`${text("Xem nhanh", "Quick view")} ${vi ? item.name : item.english}`}><CollectionArtwork id={item.id} className="ab-product-object" /><span className="ab-quick-hint"><Maximize2 size={14} />{text("Xem nhanh", "Quick view")}</span></button><button type="button" className="ab-save" onClick={() => toggle(item.id)} aria-pressed={saved.includes(item.id)} aria-label={`${saved.includes(item.id) ? text("Bỏ lưu", "Unsave") : text("Lưu", "Save")} ${vi ? item.name : item.english}`}><Heart size={17} fill={saved.includes(item.id) ? "currentColor" : "none"} /></button><span className="ab-frame-material">{item.id === 1 || item.id === 2 ? "SenPine Blend" : "PineFiber"}</span></div></div><div className="ab-product-label"><div><h3><Link href={`/products/${item.slug}`}>{vi ? item.name : item.english}</Link></h3><span>{formatPrice(item.price)} · {text("giá dự kiến", "planned price")}</span></div><Link href={`/products/${item.slug}`} aria-label={`${text("Mở hồ sơ", "Open profile")} ${vi ? item.name : item.english}`}><ArrowUpRight size={20} /></Link></div></article>)}</div>
      <div className="ab-showroom-foot"><p className="ab-note">{text("Sáu thiết kế concept · Hình vẽ minh họa hướng thiết kế, chưa phải sản phẩm đã mở bán.", "Six concept designs · Illustrations show proposed directions, not products available for sale.")}</p><Link href="/collection" className="ab-text-link">{text("Khám phá bộ sưu tập", "Explore the collection")}<ArrowUpRight size={17} /></Link></div>
    </section>

    <section id="about-process" className="ab-process ab-section" aria-labelledby="ab-process-title">
      <div className="ab-section-heading ab-reveal"><div><p className="ab-eyebrow">05 / {text("CÁCH CHÚNG TÔI TIẾP CẬN", "OUR APPROACH")}</p><h2 id="ab-process-title">{text("Một chuỗi giá trị.", "One value chain.")}<br /><em>{text("Từng bước có chủ đích.", "Every step considered.")}</em></h2></div><Link href="/story#story-journey" className="ab-text-link">{text("Xem hành trình đầy đủ", "See the full journey")}<ArrowUpRight size={17} /></Link></div>
      <div className="ab-process-layout"><div className="ab-process-image" key={process}><Image src={aboutProcess[process].image.src} alt={aboutProcess[process].image.alt} fill sizes="(max-width: 800px) 90vw, 44vw" /><span>0{process + 1} / {text("THAM KHẢO QUY TRÌNH ĐỀ XUẤT", "PROPOSED PROCESS REFERENCE")}</span></div><div className="ab-process-steps">{aboutProcess.map((step, index) => <div key={step[lang].title} className={process === index ? "is-active" : ""}><h3><button type="button" id={`${uid}-process-${index}`} aria-expanded={process === index} aria-controls={`${uid}-process-panel-${index}`} onClick={() => setProcess(index)}><span>0{index + 1}</span>{step[lang].title}<Plus size={19} /></button></h3><div id={`${uid}-process-panel-${index}`} role="region" aria-labelledby={`${uid}-process-${index}`} hidden={process !== index}><p>{step[lang].text}</p><small>{step[lang].result}</small></div></div>)}</div></div>
      <div className="ab-trace-strip"><ScanLine size={27} strokeWidth={1.2} /><div><h3>{text("Câu chuyện tiếp tục trong một mã vật liệu.", "The story continues in a material code.")}</h3><p>{text("Hồ sơ mẫu kết nối nguồn sợi, thành phần định hướng và thiết kế ứng dụng.", "Sample profiles connect fibre origins, intended composition and design applications.")}</p></div><Link href="/trace" className="ab-text-link">{text("Thử truy xuất mẫu", "Try sample traceability")}<ArrowUpRight size={17} /></Link></div>
    </section>

    <section id="about-future" className="ab-future ab-section" aria-labelledby="ab-future-title">
      <div className="ab-section-heading ab-reveal"><div><p className="ab-eyebrow">06 / {text("TƯƠNG LAI ĐƯỢC HÌNH DUNG", "THE FUTURE WE IMAGINE")}</p><h2 id="ab-future-title">42 {text("tháng.", "months.")}<br /><em>{text("Từng bước để đi xa.", "One considered step at a time.")}</em></h2></div><p>{text("Sáu chặng phát triển trong kế hoạch đề án. Chọn từng chặng để tìm hiểu mục tiêu và công việc dự kiến.", "Six stages in the project plan. Select a stage to explore its intended goals and activities.")}</p></div>
      <ChoiceTabs id={futureTabId} labels={aboutRoadmap.map((step, i) => `${text("Chặng", "Stage")} ${i + 1} / ${step.months}`)} selected={phase} onSelect={setPhase} label={text("Các chặng phát triển dự kiến", "Proposed development stages")} />
      <div id={`${futureTabId}-panel`} role="tabpanel" aria-labelledby={`${futureTabId}-tab-${phase}`} tabIndex={0} className="ab-future-panel" key={phase}><div className="ab-future-number"><span>0{phase + 1}</span><small>{text("THÁNG", "MONTHS")} {currentPhase.months}</small></div><div><p className="ab-eyebrow">{text("MỤC TIÊU DỰ KIẾN", "PROPOSED GOAL")}</p><h3>{currentPhase[lang].title}</h3><p>{currentPhase[lang].text}</p></div><ul>{currentPhase[lang].tasks.map((task) => <li key={task}><Check size={15} />{task}</li>)}</ul></div>
      <div className="ab-future-details"><p className="ab-note">{text("Đây là lộ trình đề xuất, không phải tiến độ hoặc kết quả vận hành đã xác nhận. Các mục tiêu thị trường, tài chính và cơ sở sản xuất cần được triển khai, đánh giá thực tế.", "This is a proposed roadmap, not confirmed operating progress or results. Market, financial and facility goals require implementation and real-world evaluation.")}</p><a href={detailsImages.roadmap.src} target="_blank" rel="noopener noreferrer" className="ab-text-link">{text("Xem sơ đồ trong đề án", "View the project roadmap")}<ArrowUpRight size={16} /></a></div>
    </section>

    <section className="ab-profile ab-section" aria-labelledby="ab-profile-title"><div className="ab-profile-intro ab-reveal"><p className="ab-eyebrow">{text("HỒ SƠ ĐỀ ÁN", "PROJECT PROFILE")}</p><h2 id="ab-profile-title">{text("Có một nền tảng", "An idea with")}<br /><em>{text("cho mỗi ý tưởng.", "a foundation.")}</em></h2><p>{text("SenPine được phát triển trong bối cảnh nghiên cứu và khởi nghiệp học thuật. Những thông tin dưới đây giúp bạn hiểu xuất phát điểm và phạm vi của website.", "SenPine was developed in an academic research and entrepreneurship context. These details explain its origin and the scope of the website.")}</p></div><dl className="ab-profile-facts"><div><dt>{text("Đơn vị học thuật", "Academic institution")}</dt><dd>{text(corporateInfo.university, "Industrial University of Ho Chi Minh City (IUH)")}</dd></div><div><dt>{text("Nhóm phát triển đề án", "Project group")}</dt><dd>{text(`${corporateInfo.foundingGroup} · ${corporateInfo.faculty}`, "Group 4 · Faculty of Business Administration · DHTMDT20C")}</dd></div><div><dt>{text("Giảng viên hướng dẫn", "Academic advisor")}</dt><dd>{corporateInfo.advisor}</dd></div><div><dt>{text("Cơ sở sản xuất đề xuất", "Proposed production facility")}</dt><dd>{text(corporateInfo.factoryAddress, corporateInfo.factoryAddressEn)}<small>{corporateInfo.factoryArea} · {text("quy mô theo kế hoạch, chưa xác nhận vận hành", "planned area, not an operating facility")}</small></dd></div><div><dt>{text("Phạm vi website", "Website scope")}</dt><dd>{text("Giới thiệu thương hiệu · Phòng vật liệu · Bộ sưu tập · Giỏ demo · Yêu cầu hợp tác demo · Truy xuất mẫu", "Brand introduction · Material lab · Collection · Demo bag · Demo partnership requests · Sample traceability")}</dd></div></dl></section>

    <section className="ab-connect" aria-labelledby="ab-connect-title"><Threads /><div className="ab-connect-copy ab-reveal"><p className="ab-eyebrow">{text("CÙNG VIẾT TIẾP CÂU CHUYỆN", "WRITE THE NEXT CHAPTER TOGETHER")}</p><h2 id="ab-connect-title">{text("Một kết nối mới.", "A new connection.")}<br /><em>{text("Một khả năng mới.", "A new possibility.")}</em></h2><p>{text("Bạn là nhà thiết kế, thương hiệu hay người quan tâm đến vật liệu thực vật? Khám phá hướng hợp tác hoặc bắt đầu bằng một cuộc trò chuyện.", "Are you a designer, a brand or curious about botanical textiles? Explore a partnership direction or start a conversation.")}</p><div><Link href="/business/request-sample" className="ab-button ab-button-light">{text("Tìm hiểu bộ mẫu", "Explore sample sets")}<ArrowUpRight size={17} /></Link><Link href="/contact" className="ab-text-link">{text("Kết nối với SenPine", "Connect with SenPine")}<ArrowUpRight size={17} /></Link></div></div><div className="ab-connect-mark" aria-hidden="true"><Sprout size={75} strokeWidth={.8} /><span>SenPine<span>.</span></span><small>FROM NATURE. WITH PURPOSE.</small></div></section>

    <dialog ref={dialog} className="ab-product-dialog" aria-labelledby={`${uid}-product-title`} onClose={() => { setSelectedProduct(null); returnFocus.current?.focus({ preventScroll: true }); }} onClick={(event) => { if (event.target !== event.currentTarget) return; const bounds = event.currentTarget.getBoundingClientRect(); if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) event.currentTarget.close(); }}>
      <button type="button" className="ab-dialog-close" onClick={() => dialog.current?.close()} aria-label={text("Đóng xem nhanh", "Close quick view")} autoFocus><X size={21} /></button>
      <div className="ab-dialog-layout"><div className="ab-dialog-visual"><ChoiceTabs id={viewTabId} labels={[text("Phom thiết kế", "Design silhouette"), text("Ảnh tham khảo", "Reference image")]} selected={productView} onSelect={(index) => { setProductView(index); setZoom(1); }} label={text("Góc nhìn thiết kế", "Design views")} /><div id={`${viewTabId}-panel`} role="tabpanel" aria-labelledby={`${viewTabId}-tab-${productView}`} tabIndex={0} className="ab-dialog-art"><div style={{ transform: `scale(${zoom})` }}>{productView === 0 ? <CollectionArtwork id={product.id} className="ab-dialog-object" /> : <Image src={productImages[product.id].src} alt={productImages[product.id].alt} fill sizes="(max-width: 800px) 90vw, 460px" />}</div></div><div className="ab-dialog-zoom"><button type="button" onClick={() => setZoom((value) => Math.max(1, value - .25))} disabled={zoom === 1} aria-label={text("Thu nhỏ thiết kế", "Zoom out design")}><Minus size={15} /></button><label htmlFor={`${uid}-zoom`}>{text("Phóng đại", "Magnification")}</label><input id={`${uid}-zoom`} type="range" min="1" max="2" step=".05" value={zoom} onChange={(event) => setZoom(Number(event.target.value))} aria-valuetext={`${zoom.toFixed(2)}×`} /><span>{zoom.toFixed(1)}×</span><button type="button" onClick={() => setZoom((value) => Math.min(2, value + .25))} disabled={zoom === 2} aria-label={text("Phóng lớn thiết kế", "Zoom in design")}><Plus size={15} /></button></div></div><div className="ab-dialog-copy"><p className="ab-eyebrow">DESIGN STUDY / 0{product.id + 1}</p><h2 id={`${uid}-product-title`}>{vi ? product.name : product.english}</h2><p>{aboutProductNotes[product.id][lang]}</p><dl><div><dt>{text("Vật liệu đề xuất", "Proposed material")}</dt><dd>{vi ? product.materialUsed : product.materialUsedEn}</dd></div><div><dt>{text("Sắc màu định hướng", "Intended colour")}</dt><dd>{vi ? product.color : product.colorEn}</dd></div><div><dt>{text("Giá kế hoạch", "Planned price")}</dt><dd>{formatPrice(product.price)}</dd></div></dl><button type="button" className="ab-dialog-save" aria-pressed={saved.includes(product.id)} onClick={() => toggle(product.id)}><Heart size={17} fill={saved.includes(product.id) ? "currentColor" : "none"} />{saved.includes(product.id) ? text("Đã lưu thiết kế", "Design saved") : text("Lưu thiết kế", "Save design")}</button><Link href={`/products/${product.slug}`} className="ab-button" onClick={() => dialog.current?.close()}>{text("Mở hồ sơ sản phẩm", "Open product profile")}<ArrowUpRight size={17} /></Link><p className="ab-note">{text("Thiết kế concept, chưa mở bán. Ảnh tham khảo minh họa nhóm sản phẩm trong đề án, không phải ảnh sản phẩm SenPine đã sản xuất.", "Concept design, not available for sale. Reference images illustrate product families in the project, not manufactured SenPine inventory.")}</p></div></div>
    </dialog>
  </main>;
}
