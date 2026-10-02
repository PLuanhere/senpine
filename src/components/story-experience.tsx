"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, Plus, Sparkles } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DocumentFigure } from "@/components/document-figure";
import { MaterialArtwork } from "@/components/material-artwork";
import { MotionRibbon } from "@/components/motion-ribbon";
import { journey, materials } from "@/lib/content";
import { detailsImages } from "@/lib/imagery";
import { useMotion } from "@/lib/motion-context";

const chapters = [
  { id: "story-beginning", label: "Một chiếc lá" },
  { id: "story-roots", label: "Hai nguồn sợi" },
  { id: "story-journey", label: "Bảy chặng đường" },
  { id: "story-touch", label: "Chạm vào câu chuyện" },
];

const stageStories = [
  { title: "Một chiếc lá còn ở lại.", text: "Sau mùa thu hoạch, câu chuyện của trái dứa đã đi tiếp. SenPine đặt một câu hỏi cho phần lá ở lại: liệu đây có thể là khởi đầu của một chất liệu mới?", detail: "Điểm bắt đầu: lá dứa sau thu hoạch và cuống sen." },
  { title: "Đánh thức điều nằm bên trong.", text: "Bên trong chiếc lá là những xơ nhỏ. Tách xơ, làm sạch và xử lý là những bước được đề xuất để đưa nguyên liệu thực vật đến gần hơn với sợi dệt.", detail: "Từ hình dáng của chiếc lá đến cấu trúc của xơ." },
  { title: "Chậm lại, để sợi đi xa.", text: "Các bó xơ cần được làm sạch, chải và phân loại. Độ mảnh, độ dài và chất lượng xơ là những điều phải được kiểm tra trước khi thử nghiệm bước tiếp theo.", detail: "Chất lượng bắt đầu từ những chi tiết nhỏ." },
  { title: "Từng xơ tìm thấy nhau.", text: "Kéo sợi kết nối những xơ rời thành một đường liên tục. Với SenPine Blend, đề án còn hình dung cuộc gặp giữa sợi lá dứa và một phần tơ sen.", detail: "Một ý tưởng phối trộn cần được phát triển qua mẫu thử." },
  { title: "Một bề mặt dần hiện ra.", text: "Khi các sợi đan vào nhau, tấm vải bắt đầu có cấu trúc. Cách dệt sẽ ảnh hưởng đến độ rũ, độ bền và cảm giác chạm — những đặc tính cần được thử nghiệm.", detail: "Từ một đường sợi đến một bề mặt có thể chạm vào." },
  { title: "Giữ lại nét riêng của vật liệu.", text: "Hoàn thiện vải mở ra câu hỏi về màu sắc và bề mặt: giữ sắc mộc hay phát triển một màu mới? Mỗi lựa chọn cần đi cùng quy trình và dữ liệu phù hợp.", detail: "Thiết kế bắt đầu bằng việc hiểu chất liệu." },
  { title: "Câu chuyện bước vào đời sống.", text: "Một chiếc áo, chiếc túi hay một khăn choàng là cách để vật liệu gặp người sử dụng. SenPine cũng đề xuất hộ chiếu vật liệu để câu chuyện nguồn gốc có thể được theo dấu.", detail: "Từ nguyên liệu đến thiết kế, rồi trở lại với nguồn gốc." },
];

const materialStories = [
  { mood: "Thô mộc", title: "Sắc mộc của chiếc lá.", text: "PineFiber là hướng phát triển vải từ sợi lá dứa. Một chất liệu được hình dung cho những thiết kế gần gũi với đời sống, bắt đầu từ nguồn nguyên liệu sau thu hoạch." },
  { mood: "Giao thoa", title: "Hai nguồn sợi, một bề mặt.", text: "SenPine Blend kết nối hướng nguyên liệu lá dứa với một phần tơ sen. Đó là ý tưởng tìm kiếm sự cân bằng giữa tính ứng dụng và cảm giác tinh tế." },
  { mood: "Tinh tế", title: "Thời gian ở trong từng sợi.", text: "SenSilk trân trọng kỹ nghệ rút tơ từ cuống sen. Nguồn sợi này được đề án dành cho những thiết kế giới hạn, nơi giá trị của công sức làm nghề được chú ý." },
];

export function StoryExperience() {
  const root = useRef<HTMLElement>(null);
  const [chapter, setChapter] = useState(0);
  const [stage, setStage] = useState(0);
  const [material, setMaterial] = useState(0);
  const { intro, reduced } = useMotion();

  useEffect(() => {
    if (intro !== "done" || !root.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      gsap.from(".story-cover-meta > *, .story-cover-foot > *", { opacity: 0, y: reduced ? 0 : 20, duration: 1, stagger: .12, delay: .3, clearProps: "transform,opacity" });
      if (!reduced) {
        gsap.to(".story-cover-photo", { yPercent: 12, ease: "none", scrollTrigger: { trigger: ".story-cover", start: "top top", end: "bottom top", scrub: 1 } });
        gsap.from(".story-collage-small", { y: 65, rotation: -6, ease: "none", scrollTrigger: { trigger: ".story-beginning", start: "top bottom", end: "bottom top", scrub: 1 } });
        gsap.fromTo(".story-interlude h2 span", { opacity: .22 }, { opacity: 1, stagger: .12, ease: "none", scrollTrigger: { trigger: ".story-interlude", start: "top 75%", end: "center 45%", scrub: .8 } });
      }
      gsap.utils.toArray<HTMLElement>(".story-reveal").forEach((element) => {
        gsap.from(element, { opacity: 0, y: reduced ? 0 : 35, duration: reduced ? .5 : 1.1, ease: "power3.out", clearProps: "transform,opacity", scrollTrigger: { trigger: element, start: "top 93%", once: true } });
      });
      chapters.forEach((item, index) => {
        ScrollTrigger.create({ trigger: `#${item.id}`, start: "top 40%", end: "bottom 40%", onEnter: () => setChapter(index), onEnterBack: () => setChapter(index) });
      });
      journey.forEach((item, index) => {
        ScrollTrigger.create({ trigger: `#story-step-${item.step}`, start: "top 60%", end: "bottom 60%", onEnter: () => setStage(index), onEnterBack: () => setStage(index) });
      });
    }, root);
    return () => context.revert();
  }, [intro, reduced]);

  useEffect(() => {
    const nav = root.current?.querySelector<HTMLElement>(".story-chapters");
    const current = nav?.querySelector<HTMLElement>("a.is-current");
    if (nav && current && nav.scrollWidth > nav.clientWidth) {
      nav.scrollTo({ left: current.offsetLeft - (nav.clientWidth - current.offsetWidth) / 2, behavior: reduced ? "auto" : "smooth" });
    }
  }, [chapter, reduced]);

  const selectMaterial = (index: number, focus = false) => {
    setMaterial(index);
    if (focus) root.current?.querySelector<HTMLButtonElement>(`#story-material-tab-${index}`)?.focus();
  };

  return (
    <main id="main" ref={root} className="story-page">
      <section className="story-cover">
        <Image className="story-cover-photo" src={detailsImages.drying.src} alt={detailsImages.drying.alt} fill sizes="100vw" loading="eager" />
        <div className="story-cover-shade" />
        <div className="story-cover-meta"><span>SENPINE JOURNAL</span><span>TỪ TỰ NHIÊN, DỆT MỘT CÂU CHUYỆN.</span></div>
        <div className="page-hero-copy story-cover-copy">
          <p className="eyebrow">CÂU CHUYỆN / 01</p>
          <h1><span className="motion-word"><span>Một chiếc lá.</span></span><br /><em className="motion-word"><span>Một đời sống mới.</span></em></h1>
          <p>Không chỉ nhìn vào điều được thu hoạch.<br />Nhìn vào những khả năng còn ở lại.</p>
        </div>
        <div className="story-cover-foot"><Link href="#story-beginning" className="story-start">Bắt đầu câu chuyện <span><ArrowDown size={21} /></span></Link><p>LÁ → XƠ → SỢI → VẢI → ĐỜI SỐNG</p></div>
        <div className="story-cover-orbit" aria-hidden="true"><span /><span /></div>
      </section>

      <nav className="story-chapters" aria-label="Các chương trong câu chuyện">
        <span className="story-chapters-label">THE STORY <Sparkles size={15} /></span>
        {chapters.map((item, index) => <Link key={item.id} href={`#${item.id}`} className={chapter === index ? "is-current" : ""} aria-current={chapter === index ? "location" : undefined}><span>0{index + 1}</span>{item.label}</Link>)}
      </nav>

      <section id="story-beginning" className="story-beginning story-chapter">
        <div className="story-opening-copy story-reveal">
          <p className="eyebrow">01 / ĐIỀU CÒN Ở LẠI</p>
          <h2>Ta nhìn thấy quả.<br /><em>SenPine nhìn lại chiếc lá.</em></h2>
          <p>Lá dứa thường được nhìn qua trái dứa. Nhưng sau mùa thu hoạch, phần lá ấy còn có thể mở đầu điều gì?</p>
          <p>Đó là câu hỏi bắt đầu SenPine: một đề án khám phá hướng phát triển vật liệu dệt từ lá dứa và tơ sen.</p>
          <span className="story-margin-note"><span />Mọi hành trình đều bắt đầu từ một cách nhìn.</span>
        </div>
        <div className="story-leaf-collage story-reveal">
          <div className="story-collage-main"><Image src={detailsImages.harvest.src} alt={detailsImages.harvest.alt} fill sizes="(max-width: 900px) 88vw, 46vw" /><span>ĐỒNG BẰNG SÔNG CỬU LONG</span></div>
          <div className="story-collage-small"><Image src={detailsImages.rawFiber.src} alt={detailsImages.rawFiber.alt} fill sizes="(max-width: 900px) 44vw, 22vw" /><span>Nhìn gần hơn một chút.</span></div>
          <span className="story-collage-stamp" aria-hidden="true"><ArrowUpRight size={40} /></span>
        </div>
      </section>

      <MotionRibbon variant="story" />

      <section id="story-roots" className="story-roots story-chapter">
        <div className="story-roots-heading story-reveal"><div><p className="eyebrow">02 / CUỘC GẶP CỦA HAI NGUỒN SỢI</p><h2>Hai nhịp tự nhiên.<br /><em>Một hướng đi chung.</em></h2></div><p>Lá dứa gợi mở tính ứng dụng.<br />Tơ sen gợi nhắc sự kiên nhẫn.<br />SenPine đặt hai nguồn nguyên liệu vào cùng một câu chuyện.</p></div>
        <div className="story-origin-grid">
          <article className="story-origin-card story-reveal"><div className="story-origin-photo"><Image src={detailsImages.extraction.src} alt={detailsImages.extraction.alt} fill sizes="(max-width: 900px) 88vw, 44vw" /></div><div className="story-origin-copy"><span className="story-origin-number">01</span><p className="eyebrow">SỢI LÁ DỨA</p><h3>Điều mới từ điều quen.</h3><p>Hướng nguyên liệu chủ lực của đề án, bắt đầu từ lá dứa sau thu hoạch và khả năng phát triển sợi dệt.</p><Link href="/materials/pinefiber">Gặp PineFiber <ArrowUpRight size={19} /></Link></div></article>
          <article className="story-origin-card story-reveal"><div className="story-origin-photo"><Image src={detailsImages.lotusSorting.src} alt={detailsImages.lotusSorting.alt} fill sizes="(max-width: 900px) 88vw, 44vw" /></div><div className="story-origin-copy"><span className="story-origin-number">02</span><p className="eyebrow">TƠ SEN</p><h3>Thời gian trong từng sợi.</h3><p>Hướng nguyên liệu trân trọng công sức làm nghề và sự tỉ mỉ của việc rút tơ từ cuống sen.</p><Link href="/materials/sensilk">Gặp SenSilk <ArrowUpRight size={19} /></Link></div></article>
        </div>
      </section>

      <section className="story-interlude">
        <Image src={detailsImages.rawFiber.src} alt="" fill sizes="100vw" />
        <div><Sparkles size={26} /><p className="eyebrow">THAY ĐỔI CÁCH NHÌN</p><h2>{"Một vật liệu mới bắt đầu từ cách nhìn mới.".split(" ").map((word, index) => <span key={index}>{word} </span>)}</h2></div>
      </section>

      <section id="story-journey" className="story-journey story-chapter">
        <div className="story-journey-heading story-reveal"><p className="eyebrow">03 / THEO MỘT CHIẾC LÁ ĐI XA</p><h2>Bảy chặng đường.<br /><em>Từng bước thành một tấm vải.</em></h2><p>Cuộn để theo dấu hành trình được đề xuất trong đề án.</p></div>
        <div className="story-journey-shell">
          <figure className="story-stage-visual">
            <div className="story-stage-photos">{journey.map((item, index) => <div key={item.step} className={`story-stage-image ${stage === index ? "is-active" : ""}`} aria-hidden={stage !== index}><Image src={item.image} alt={stage === index ? `Ảnh tham khảo cho công đoạn ${item.title.toLowerCase()}` : ""} fill sizes="(max-width: 900px) 88vw, 44vw" loading={index === 0 ? "eager" : "lazy"} /></div>)}<span className="story-stage-badge">{journey[stage].step}<small>/ 07</small></span><div className="story-stage-photo-label"><span>{journey[stage].label}</span></div></div>
            <figcaption><span>THE JOURNEY</span><div aria-label="Chọn công đoạn">{journey.map((item, index) => <Link key={item.step} href={`#story-step-${item.step}`} aria-label={`Đến công đoạn ${item.step}: ${item.title}`} aria-current={stage === index ? "step" : undefined} className={stage === index ? "is-active" : ""}>{item.step}</Link>)}</div></figcaption>
          </figure>
          <div className="story-timeline">{journey.map((item, index) => <article id={`story-step-${item.step}`} key={item.step} className={`story-stage-text ${stage === index ? "is-current" : ""}`}><span className="story-stage-index">{item.step}</span><div><p className="eyebrow">{item.label}</p><h3>{stageStories[index].title}</h3><p>{stageStories[index].text}</p><span className="story-stage-detail"><ArrowRight size={16} />{stageStories[index].detail}</span></div></article>)}</div>
        </div>
        <details className="story-process-note" onToggle={() => requestAnimationFrame(() => ScrollTrigger.refresh())}><summary><span>Xem toàn bộ hành trình trên một sơ đồ.</span><Plus size={22} /></summary><DocumentFigure image={detailsImages.productionProcess} caption="Sơ đồ quy trình sản xuất vải trong đề án SenPine." /></details>
        <p className="story-project-note">Đây là hành trình định hướng của đề án. Quy trình, đặc tính vật liệu và dữ liệu truy xuất cần được xác nhận bằng mẫu thử và thông tin thực tế.</p>
      </section>

      <section id="story-touch" className="story-touch story-chapter">
        <div className="story-touch-heading story-reveal"><p className="eyebrow">04 / CÂU CHUYỆN CÓ MỘT BỀ MẶT</p><h2>Nếu có thể chạm vào,<br /><em>bạn sẽ chọn sắc thái nào?</em></h2></div>
        <div className="story-material-tabs" role="tablist" aria-label="Khám phá ba sắc thái vật liệu">{materials.map((item, index) => <button key={item.id} id={`story-material-tab-${index}`} type="button" role="tab" aria-selected={material === index} aria-controls={`story-material-panel-${index}`} tabIndex={material === index ? 0 : -1} className={material === index ? "is-active" : ""} onClick={() => selectMaterial(index)} onKeyDown={(event) => { let next = index; if (event.key === "ArrowRight") next = (index + 1) % 3; else if (event.key === "ArrowLeft") next = (index + 2) % 3; else if (event.key === "Home") next = 0; else if (event.key === "End") next = 2; else return; event.preventDefault(); selectMaterial(next, true); }}><span>0{index + 1}</span><strong>{materialStories[index].mood}</strong><small>{item.name}</small><ArrowUpRight size={22} /></button>)}</div>
        <div className="story-material-experience"><div className="story-material-preview">{materials.map((item, index) => <div key={item.id} className={`story-material-picture ${material === index ? "is-active" : ""}`} aria-hidden={material !== index}><MaterialArtwork index={index} /></div>)}</div><div className="story-material-copy">{materials.map((item, index) => <div key={item.id} role="tabpanel" id={`story-material-panel-${index}`} aria-labelledby={`story-material-tab-${index}`} hidden={material !== index} className="story-material-panel"><p className="eyebrow">{item.name} / {item.origin}</p><h3>{materialStories[index].title}</h3><p>{materialStories[index].text}</p><Link className="text-link" href={`/materials/${item.id}`}>Khám phá câu chuyện vật liệu <ArrowUpRight size={19} /></Link></div>)}</div></div>
      </section>

      <section className="story-ending"><p className="eyebrow story-reveal">MỘT CHẶNG MỚI ĐANG MỞ RA</p><h2 className="story-reveal">Câu chuyện tiếp theo,<br /><em>có thể ở bên bạn.</em></h2><p className="story-reveal">Từ một nguồn sợi đến những thiết kế dành cho đời sống.</p><div className="story-reveal"><Link className="button button-light" href="/collection">Khám phá bộ sưu tập <ArrowUpRight size={20} /></Link><Link className="story-ending-link" href="/materials">Đến Material Lab <ArrowRight size={19} /></Link></div><span className="story-ending-mark" aria-hidden="true">SenPine.</span></section>
    </main>
  );
}
