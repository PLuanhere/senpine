"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronDown, FileText, Layers3, Leaf, ScanLine } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { materials } from "@/lib/content";
import { detailsImages, materialImages } from "@/lib/imagery";
import { useLanguage } from "@/lib/language-context";
import { useMotion } from "@/lib/motion-context";

const materialProfiles = [
  { vi: { character: "Cấu trúc mộc. Ứng dụng thường ngày.", use: "Áo sơ mi · Túi · Đồng phục", composition: "Sợi lá dứa", detail: "Hướng vải dệt có cấu trúc rõ, dành cho những thiết kế cần nét tự nhiên và phom dáng giản dị." }, en: { character: "Grounded texture. Everyday applications.", use: "Shirts · Bags · Uniforms", composition: "Pineapple leaf fiber", detail: "A structured woven direction for designs that call for a natural character and simple silhouettes." } },
  { vi: { character: "Hai nguồn sợi. Một hướng tinh tế.", use: "Váy · Sơ mi · Khăn choàng", composition: "95% lá dứa / 5% tơ sen", detail: "Hướng phối trộn tìm kiếm sự cân bằng giữa cấu trúc sợi lá dứa và độ mềm mại của tơ sen." }, en: { character: "Two fibers. A refined direction.", use: "Dresses · Shirts · Scarves", composition: "95% pineapple / 5% lotus", detail: "An experimental blend exploring the balance between pineapple fiber structure and the softness of lotus silk." } },
  { vi: { character: "Tơ thủ công. Dấu ấn giới hạn.", use: "Áo dài · Khăn · Thiết kế giới hạn", composition: "Tơ sen", detail: "Hướng vật liệu dành cho những dự án đề cao kỹ nghệ thủ công, nguồn sợi bản địa và câu chuyện thiết kế." }, en: { character: "Artisanal fiber. Limited expressions.", use: "Áo dài · Scarves · Limited editions", composition: "Lotus silk", detail: "A material direction for projects that value handcraft, indigenous fiber and a distinctive design story." } },
];

const audiences = [
  { material: 0, vi: { label: "Thương hiệu", title: "Tạo dấu ấn cho bộ sưu tập của bạn.", description: "Bắt đầu từ cá tính thương hiệu, phân khúc sản phẩm và trải nghiệm bạn muốn mang đến cho khách hàng.", points: ["Định hướng chất liệu theo danh mục sản phẩm", "Câu chuyện nguồn sợi để phát triển nội dung thương hiệu", "Thống nhất khối lượng và chi phí sau khi đánh giá mẫu"], brief: "Nên chuẩn bị: loại sản phẩm, phân khúc và khối lượng dự kiến." }, en: { label: "Brands", title: "Give your collection a distinct identity.", description: "Start with your brand character, product category and the experience you want to create for your customers.", points: ["A material direction for your product category", "Fiber origin stories to inform brand content", "Agree volume and cost after sample evaluation"], brief: "Prepare: product type, target segment and estimated volume." } },
  { material: 1, vi: { label: "Nhà thiết kế", title: "Tìm chất liệu có cùng ngôn ngữ thiết kế.", description: "Từ bảng cảm hứng đến phom dáng, đặt cảm giác chạm, độ rũ và sắc tự nhiên vào đúng vị trí trong ý tưởng của bạn.", points: ["So sánh bề mặt và hướng ứng dụng của ba dòng vật liệu", "Trao đổi cấu trúc dệt, sắc màu và độ rũ mong muốn", "Thử nghiệm ứng dụng trước khi hoàn thiện bộ sưu tập"], brief: "Nên chuẩn bị: moodboard, phom dáng và yêu cầu bề mặt vải." }, en: { label: "Designers", title: "Find a material that speaks your design language.", description: "From moodboards to silhouettes, explore how hand-feel, drape and natural color could support your creative idea.", points: ["Compare the three material directions and applications", "Discuss desired weave, color and drape", "Explore application trials before finalizing the collection"], brief: "Prepare: moodboard, silhouettes and surface requirements." } },
  { material: 0, vi: { label: "Đối tác sản xuất", title: "Làm rõ yêu cầu trước khi lên phương án.", description: "Một phương án phù hợp cần bắt đầu từ quy cách kỹ thuật, yêu cầu kiểm nghiệm và khả năng vận hành thực tế.", points: ["Xác định khổ vải, định lượng và ứng dụng dự kiến", "Thống nhất tiêu chí kiểm tra chất lượng trên mẫu thử", "Đánh giá sản lượng, tiến độ và phương án cung ứng"], brief: "Nên chuẩn bị: quy cách kỹ thuật, sản lượng và tiến độ mục tiêu." }, en: { label: "Manufacturers", title: "Define the requirements before planning supply.", description: "A suitable proposal starts with technical specifications, testing requirements and real production conditions.", points: ["Define target width, weight and intended applications", "Agree quality criteria using physical samples", "Assess volume, timeline and the supply approach"], brief: "Prepare: technical specifications, volume and target timeline." } },
];

const steps = [
  { vi: { title: "Lắng nghe bài toán", text: "Trao đổi ứng dụng, trải nghiệm mong muốn, ngân sách và thời gian để xác định đúng phạm vi.", output: "Bản mô tả nhu cầu" }, en: { title: "Understand the brief", text: "Discuss applications, desired experience, budget and timing to define the right scope.", output: "Project requirements" } },
  { vi: { title: "Định hướng & đánh giá mẫu", text: "Lựa chọn hướng vật liệu, đánh giá bề mặt và kiểm tra sự phù hợp bằng mẫu thử khi có.", output: "Hướng vật liệu & tiêu chí đánh giá" }, en: { title: "Select & evaluate samples", text: "Choose a material direction, assess the surface and evaluate suitability using samples when available.", output: "Material direction & evaluation criteria" } },
  { vi: { title: "Phát triển ứng dụng", text: "Trao đổi quy cách, thử nghiệm trên thiết kế và xác nhận các thông số cần thiết sau kiểm nghiệm.", output: "Quy cách được thống nhất" }, en: { title: "Develop the application", text: "Discuss specifications, trial the design and confirm required parameters through testing.", output: "Agreed specifications" } },
  { vi: { title: "Thống nhất phương án hợp tác", text: "Xác nhận khả năng đáp ứng, số lượng, chi phí và tiến độ trước khi có thỏa thuận thương mại.", output: "Phạm vi & điều kiện hợp tác" }, en: { title: "Agree a partnership approach", text: "Confirm feasibility, quantity, cost and timing before entering a commercial agreement.", output: "Scope & partnership terms" } },
];

const questions = [
  { vi: ["SenPine đang cung cấp sản phẩm ở giai đoạn nào?", "SenPine hiện là đề án nghiên cứu và khởi nghiệp. Ba dòng vật liệu, bộ mẫu và quy trình hợp tác là định hướng phát triển; chưa công bố dịch vụ cung ứng thương mại. Các biểu mẫu trên website chỉ mô phỏng bước tiếp nhận nhu cầu."], en: ["What stage is the SenPine portfolio at?", "SenPine is currently a research and startup project. The three materials, sample program and partnership process are proposed development directions; commercial supply services have not been launched. Website forms simulate the inquiry process."] },
  { vi: ["Số lượng tối thiểu và giá được xác định như thế nào?", "MOQ và giá trong đề án là mức dự kiến để tham khảo, chưa phải điều kiện đặt hàng. Khối lượng, chi phí và thời gian cần được đánh giá theo dòng vật liệu, quy cách và kết quả thử mẫu trước khi thống nhất."], en: ["How are minimum quantities and pricing determined?", "MOQ and prices in the project are estimates for reference, not order terms. Volume, cost and timing need to be evaluated against material type, specifications and sample results before agreement."] },
  { vi: ["Có thể cùng phát triển vật liệu theo thiết kế riêng không?", "Đồng phát triển ứng dụng là một hướng hợp tác được đề xuất. Bạn có thể mô tả phom dáng, bề mặt, màu sắc và quy cách mong muốn trong bản brief. Khả năng thực hiện sẽ cần được đánh giá qua nghiên cứu và mẫu thử."], en: ["Can a material be developed for a specific design?", "Application co-development is a proposed partnership direction. Your brief can describe silhouettes, surface, color and specifications. Feasibility will need to be assessed through research and sampling."] },
  { vi: ["Thông số kỹ thuật và chứng nhận đã được xác nhận chưa?", "Thông số hiện tại là mục tiêu trong kế hoạch phát triển. Thành phần, chất lượng, hồ sơ nguồn gốc và các chứng nhận cần được kiểm nghiệm, xác minh trước khi sử dụng trong công bố thương mại."], en: ["Have technical specifications and certifications been verified?", "Current specifications are development targets. Composition, quality, origin records and certifications need testing and verification before being used in commercial claims."] },
];

function PartnerThreads() {
  return <svg className="bp-threads" viewBox="0 0 1200 700" fill="none" aria-hidden="true">{Array.from({ length: 9 }, (_, index) => <path key={index} d={`M${210 + index * 20} 760C${350 + index * 21} 420 ${790 + index * 14} ${625 - index * 17} ${1200 + index * 22} ${-70 + index * 13}`} stroke="currentColor" strokeWidth=".65" />)}</svg>;
}

export function PartnerExperience() {
  const { lang } = useLanguage();
  const { reduced, enabled, intro } = useMotion();
  const root = useRef<HTMLElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [audience, setAudience] = useState(0);
  const vi = lang === "vi";
  const t = (vietnamese: string, english: string) => vi ? vietnamese : english;
  const selected = audiences[audience];
  const audienceCopy = selected[lang];
  const moving = enabled && !reduced;

  useEffect(() => {
    if (!root.current || !enabled || intro !== "done" || reduced) return;
    gsap.registerPlugin(ScrollTrigger);
    const reveals = new Map<HTMLElement, gsap.core.Tween>();
    const context = gsap.context(() => {
      gsap.from(".bp-hero-copy > *", { y: 23, opacity: 0, stagger: .09, duration: .95, ease: "power3.out", clearProps: "transform,opacity" });
      gsap.from(".bp-hero-visual", { y: 35, opacity: 0, duration: 1.2, delay: .2, ease: "power3.out", clearProps: "transform,opacity" });
      root.current?.querySelectorAll<HTMLElement>(".bp-reveal").forEach(element => {
        const tween = gsap.from(element, { y: 26, opacity: 0, duration: .85, ease: "power3.out", clearProps: "transform,opacity", scrollTrigger: { trigger: element, start: "top 94%", once: true } });
        reveals.set(element, tween);
      });
      gsap.fromTo(".bp-hero-image img", { yPercent: -3, scale: 1.08 }, { yPercent: 3, scale: 1.02, ease: "none", scrollTrigger: { trigger: ".bp-hero", start: "top top", end: "bottom top", scrub: .7 } });
      gsap.fromTo(".bp-process-line", { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: ".bp-process-steps", start: "top 70%", end: "bottom 70%", scrub: .5 } });
    }, root);
    const element = root.current;
    const refresh = () => ScrollTrigger.refresh();
    const showFocusedContent = (event: FocusEvent) => {
      if (!(event.target instanceof Element)) return;
      for (const [container, tween] of reveals) {
        if (container.contains(event.target)) tween.progress(1);
      }
    };
    element.addEventListener("load", refresh, true);
    element.addEventListener("toggle", refresh, true);
    element.addEventListener("focusin", showFocusedContent);
    let disposed = false;
    document.fonts.ready.then(() => { if (!disposed) refresh(); });
    return () => { disposed = true; element.removeEventListener("load", refresh, true); element.removeEventListener("toggle", refresh, true); element.removeEventListener("focusin", showFocusedContent); context.revert(); };
  }, [intro, enabled, reduced, lang]);

  function onTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % audiences.length;
    else if (event.key === "ArrowLeft") next = (index + audiences.length - 1) % audiences.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = audiences.length - 1;
    else return;
    event.preventDefault();
    setAudience(next);
    tabRefs.current[next]?.focus();
  }

  return <main id="main" ref={root} className="partner-page" data-partner-motion={moving ? "on" : "off"} data-ready={intro === "done"}>
    <section className="bp-hero" aria-labelledby="bp-title">
      <PartnerThreads />
      <div className="bp-hero-copy">
        <p className="bp-kicker"><span />SENPINE / B2B PARTNERSHIPS</p>
        <p className="bp-hero-pretitle">{t("VẬT LIỆU BẢN ĐỊA. TẦM NHÌN ĐỒNG HÀNH.", "LOCAL FIBERS. A SHARED VISION.")}</p>
        <h1 id="bp-title">{t("Một chất liệu mới.", "A new material.")}<br /><em>{t("Một lợi thế riêng.", "A distinct advantage.")}</em></h1>
        <p className="bp-hero-description">{t("Định hướng phát triển vải từ lá dứa và tơ sen cho thương hiệu, nhà thiết kế và đối tác sản xuất. Cùng tìm chất liệu phù hợp để ý tưởng của bạn có một bản sắc riêng.", "Exploring pineapple and lotus textiles for brands, designers and manufacturing partners. Find a material direction that gives your idea a distinct identity.")}</p>
        <div className="bp-hero-actions"><Link href="#partner-materials" className="bp-button bp-button-gold">{t("Khám phá vật liệu", "Explore materials")}<ArrowDown size={17} /></Link><Link href="#partner-start" className="bp-hero-text-link">{t("Trao đổi hợp tác", "Discuss a partnership")}<ArrowUpRight size={17} /></Link></div>
        <p className="bp-hero-status"><span />{t("Danh mục và chương trình hợp tác đang trong giai đoạn phát triển.", "The portfolio and partnership program are in development.")}</p>
      </div>
      <div className="bp-hero-visual">
        <div className="bp-visual-header"><span>MATERIAL PORTFOLIO / 01—03</span><span>VIETNAM</span></div>
        <div className="bp-hero-image"><Image src="/images/materials.webp" alt={t("Hình minh họa ba bề mặt vải theo định hướng chất liệu tự nhiên", "Illustration of three fabric surfaces inspired by natural materials")} fill sizes="(max-width: 800px) 90vw, 46vw" loading="eager" /><span className="bp-image-caption">{t("HÌNH MINH HỌA ĐỊNH HƯỚNG CHẤT LIỆU", "MATERIAL DIRECTION ILLUSTRATION")}</span></div>
        <div className="bp-portfolio-card"><div><span className="bp-portfolio-mark" aria-hidden="true">✳</span><span>{t("TỪ NGUỒN SỢI VIỆT", "FROM VIETNAMESE FIBERS")}<strong>{t("Đến giá trị cho thương hiệu.", "To value for your brand.")}</strong></span></div><div className="bp-portfolio-materials">{materials.map(material => <Link key={material.id} href={`/materials/${material.id}`}><span>{material.number}</span>{material.name}<ArrowUpRight size={14} /></Link>)}</div></div>
        <span className="bp-visual-coordinate" aria-hidden="true">BOTANICAL TEXTILES / SENPINE</span>
      </div>
    </section>

    <div className="bp-scope-strip"><p>{t("MỘT ĐỊNH HƯỚNG.\nNHIỀU KHẢ NĂNG.", "ONE DIRECTION.\nMANY POSSIBILITIES.")}</p><div><strong>03</strong><span>{t("Dòng vật liệu đề xuất", "Proposed material lines")}</span></div><div><strong>02</strong><span>{t("Nguồn sợi thực vật", "Botanical fiber sources")}</span></div><div><Leaf size={27} strokeWidth={1} /><span>{t("Nguồn cảm hứng bản địa", "Rooted in Vietnam")}</span></div></div>

    <section className="bp-section bp-value" aria-labelledby="bp-value-title">
      <div className="bp-section-heading bp-reveal"><p className="bp-kicker">01 / {t("GIÁ TRỊ HỢP TÁC", "PARTNERSHIP VALUE")}</p><h2 id="bp-value-title">{t("Từ một chất liệu.", "From a material.")}<br /><em>{t("Đến một hướng phát triển.", "To a direction for growth.")}</em></h2><p>{t("Ba hướng SenPine đề xuất để cùng đối tác đưa nguồn sợi thực vật vào những ứng dụng có ý nghĩa.", "Three proposed ways to explore meaningful applications of botanical fibers with our partners.")}</p></div>
      <div className="bp-offering-grid">
        {[
          { icon: Leaf, title: t("Vật liệu có bản sắc", "Materials with identity"), text: t("Danh mục từ lá dứa và tơ sen, với ba hướng bề mặt và ứng dụng để cân nhắc cho sản phẩm của bạn.", "Pineapple and lotus fibers, with three surface and application directions to consider for your products."), label: t("PINEFIBER / BLEND / SENSILK", "PINEFIBER / BLEND / SENSILK") },
          { icon: Layers3, title: t("Cùng phát triển ứng dụng", "Application co-development"), text: t("Bắt đầu từ brief, trao đổi quy cách và đánh giá mẫu thử để tìm sự phù hợp giữa chất liệu và thiết kế.", "Start with a brief, discuss specifications and evaluate samples to find the fit between material and design."), label: t("BRIEF → MẪU → ỨNG DỤNG", "BRIEF → SAMPLE → APPLICATION") },
          { icon: ScanLine, title: t("Thông tin để ra quyết định", "Information for decisions"), text: t("Định hướng hồ sơ nguồn sợi và thông số vật liệu, giúp làm rõ những gì cần xác minh trước khi hợp tác.", "Planned fiber origin records and material specifications help define what needs verification before partnering."), label: t("NGUỒN GỐC / QUY CÁCH / KIỂM NGHIỆM", "ORIGIN / SPECIFICATIONS / TESTING") },
        ].map((offering, index) => <article className="bp-offering bp-reveal" key={index}><div className="bp-offering-top"><offering.icon size={26} strokeWidth={1.2} /><span>0{index + 1}</span></div><h3>{offering.title}</h3><p>{offering.text}</p><span className="bp-offering-label">{offering.label}</span></article>)}
      </div>
    </section>

    <section id="partner-materials" className="bp-section bp-materials" aria-labelledby="bp-materials-title">
      <div className="bp-section-heading bp-reveal"><p className="bp-kicker">02 / {t("DANH MỤC VẬT LIỆU", "MATERIAL PORTFOLIO")}</p><h2 id="bp-materials-title">{t("Chất liệu phù hợp.", "The right material.")}<br /><em>{t("Bắt đầu từ ứng dụng.", "Starts with the application.")}</em></h2><Link href="/materials" className="bp-text-link">{t("Khám phá Material Lab", "Explore Material Lab")}<ArrowUpRight size={18} /></Link></div>
      <div className="bp-material-grid">{materials.map((material, index) => {
        const profile = materialProfiles[index][lang];
        return <Link key={material.id} href={`/materials/${material.id}`} className={`bp-material-card bp-reveal bp-material-${index}`}>
          <div className="bp-material-image"><Image src={materialImages[index].src} alt={materialImages[index].alt} fill sizes="(max-width: 700px) 88vw, 30vw" /><span>{material.code}</span><span className="bp-material-image-note">{t("ẢNH THAM KHẢO", "REFERENCE IMAGE")}</span></div>
          <div className="bp-material-card-body"><div className="bp-material-name"><span>0{index + 1}</span><h3>{material.name}</h3><ArrowUpRight size={20} /></div><p className="bp-material-character">{profile.character}</p><p className="bp-material-detail">{profile.detail}</p><dl><div><dt>{t("Thành phần định hướng", "Proposed composition")}</dt><dd>{profile.composition}</dd></div><div><dt>{t("Ứng dụng đề xuất", "Suggested applications")}</dt><dd>{profile.use}</dd></div></dl><span className="bp-material-open">{t("Xem hồ sơ vật liệu", "View material profile")}<ArrowRight size={16} /></span></div>
        </Link>;
      })}</div>
      <p className="bp-material-note">{t("Danh mục trong đề án. Thành phần, bề mặt và tính năng thực tế cần được xác nhận bằng mẫu thử và kiểm nghiệm.", "Project portfolio. Actual composition, surface and performance need confirmation through sampling and testing.")}</p>
    </section>

    <section className="bp-section bp-fit" aria-labelledby="bp-fit-title">
      <div className="bp-fit-intro bp-reveal"><p className="bp-kicker">03 / {t("GIẢI PHÁP THEO NHU CẦU", "YOUR PROJECT, YOUR DIRECTION")}</p><h2 id="bp-fit-title">{t("Mỗi đối tác,", "Every partner,")}<br /><em>{t("một bài toán riêng.", "a different brief.")}</em></h2><p>{t("Chọn vai trò của bạn để nhìn rõ hướng trao đổi và những thông tin nên chuẩn bị.", "Select your role to explore a conversation direction and the information to prepare.")}</p><span className="bp-fit-monogram" aria-hidden="true">S<span>✳</span>P</span></div>
      <div className="bp-fit-workbench bp-reveal"><div className="bp-audience-tabs" role="tablist" aria-label={t("Chọn nhóm đối tác", "Choose partner type")}>{audiences.map((item, index) => <button key={index} ref={element => { tabRefs.current[index] = element; }} id={`bp-audience-tab-${index}`} role="tab" type="button" aria-selected={audience === index} aria-controls="bp-audience-panel" tabIndex={audience === index ? 0 : -1} onClick={() => setAudience(index)} onKeyDown={event => onTabKey(event, index)}>{item[lang].label}</button>)}</div>
        <div id="bp-audience-panel" className="bp-audience-panel" role="tabpanel" aria-labelledby={`bp-audience-tab-${audience}`} tabIndex={0} key={audience}><p className="bp-kicker">{t("ĐỊNH HƯỚNG ĐỒNG HÀNH", "A PARTNERSHIP DIRECTION")}</p><h3>{audienceCopy.title}</h3><p>{audienceCopy.description}</p><ul>{audienceCopy.points.map(point => <li key={point}><Check size={17} strokeWidth={1.4} />{point}</li>)}</ul><div className="bp-brief-hint"><FileText size={20} strokeWidth={1.3} /><p>{audienceCopy.brief}</p></div><div className="bp-audience-actions"><Link href="/business/request-quote" className="bp-text-link">{t("Phác thảo nhu cầu hợp tác", "Outline your project")}<ArrowUpRight size={18} /></Link><Link href={`/materials/${materials[selected.material].id}`} className="bp-recommendation">{t("Gợi ý khám phá", "Explore a direction")}<strong>{materials[selected.material].name}<ArrowUpRight size={14} /></strong></Link></div></div>
      </div>
    </section>

    <section className="bp-process" aria-labelledby="bp-process-title">
      <div className="bp-process-intro bp-reveal"><p className="bp-kicker">04 / {t("LỘ TRÌNH HỢP TÁC DỰ KIẾN", "PROPOSED PARTNERSHIP PROCESS")}</p><h2 id="bp-process-title">{t("Rõ từng bước.", "Clarity at every step.")}<br /><em>{t("Vững mỗi quyết định.", "Confidence in each decision.")}</em></h2><p>{t("Một lộ trình cùng đánh giá, cùng xác nhận. Để những quyết định tiếp theo có cơ sở ngay từ đầu.", "A process of shared evaluation and confirmation, so each next decision has a clear foundation.")}</p><div className="bp-process-photo"><Image src={detailsImages.rawFiber.src} alt={detailsImages.rawFiber.alt} fill sizes="(max-width: 800px) 88vw, 35vw" /><span>{t("NGUỒN SỢI / HÌNH THAM KHẢO", "FIBER SOURCE / REFERENCE IMAGE")}</span></div></div>
      <div className="bp-process-steps"><span className="bp-process-track" aria-hidden="true"><span className="bp-process-line" /></span>{steps.map((step, index) => <article className="bp-process-step bp-reveal" key={index}><span className="bp-step-number">0{index + 1}</span><div><h3>{step[lang].title}</h3><p>{step[lang].text}</p><span className="bp-step-output"><Check size={14} />{step[lang].output}</span></div></article>)}<p className="bp-process-note">{t("Quy trình được đề xuất. Mẫu, tài liệu và điều kiện cung ứng sẽ cần được xác nhận trước thương mại hóa.", "A proposed process. Samples, documentation and supply terms need confirmation before commercialization.")}</p></div>
    </section>

    <section className="bp-section bp-clarity" aria-labelledby="bp-clarity-title">
      <div className="bp-clarity-intro bp-reveal"><p className="bp-kicker">05 / {t("THÔNG TIN TRƯỚC HỢP TÁC", "BEFORE WE BEGIN")}</p><h2 id="bp-clarity-title">{t("Sự tin tưởng", "Trust begins")}<br /><em>{t("bắt đầu từ rõ ràng.", "with clarity.")}</em></h2><p>{t("Những câu hỏi cần được làm rõ, trước khi bạn dành nguồn lực cho một chất liệu mới.", "Questions worth clarifying before you invest resources in a new material direction.")}</p><Link href="/trace" className="bp-text-link">{t("Xem định hướng truy xuất", "Explore traceability")}<ArrowUpRight size={18} /></Link></div>
      <div className="bp-faq bp-reveal">{questions.map((question, index) => <details key={index}><summary>{question[lang][0]}<ChevronDown size={19} /></summary><p>{question[lang][1]}</p></details>)}</div>
      <details className="bp-dossier"><summary><FileText size={18} /><span>{t("Tài liệu định hướng sản xuất & phát triển khách hàng", "Production & customer development references")}</span><ChevronDown size={19} /></summary><div className="bp-dossier-content"><p>{t("Thiết bị tham khảo trong đề án, minh họa hướng xây dựng dây chuyền; không phải máy móc hay nhà xưởng đang vận hành của SenPine.", "Equipment references from the project illustrate a proposed production line, not operating SenPine machinery or facilities.")}</p><div className="bp-equipment">{[detailsImages.decorticator, detailsImages.spinning, detailsImages.loom].map((image, index) => <figure key={image.src}><Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes="(max-width: 600px) 85vw, 25vw" /><figcaption>{[t("Xử lý xơ", "Fiber extraction"), t("Kéo sợi", "Spinning"), t("Dệt vải", "Weaving")][index]}</figcaption></figure>)}</div><a href={detailsImages.customerRoadmap.src} target="_blank" rel="noopener noreferrer" className="bp-text-link">{t("Xem sơ đồ phát triển khách hàng dự kiến", "View the proposed customer development roadmap")}<ArrowUpRight size={17} /></a></div></details>
    </section>

    <section id="partner-start" className="bp-start" aria-labelledby="bp-start-title"><PartnerThreads /><div className="bp-start-heading bp-reveal"><p className="bp-kicker">LET’S BUILD SOMETHING MEANINGFUL</p><h2 id="bp-start-title">{t("Một ý tưởng của bạn.", "Your next idea.")}<br /><em>{t("Một khởi đầu cùng SenPine.", "A new beginning with SenPine.")}</em></h2><p>{t("Bạn muốn tìm hiểu chất liệu hay đã có một dự án trong đầu? Chọn điểm bắt đầu phù hợp.", "Exploring a material, or already have a project in mind? Choose where to begin.")}</p></div><div className="bp-start-options">
      <Link href="/business/request-sample" className="bp-start-card bp-reveal"><span>01 / MATERIAL SAMPLE</span><div><Layers3 size={27} strokeWidth={1.2} /><ArrowUpRight size={25} /></div><h3>{t("Bắt đầu từ bộ mẫu.", "Start with samples.")}</h3><p>{t("Khám phá luồng lựa chọn vật liệu và mô tả ứng dụng bạn muốn thử.", "Explore the material selection journey and describe the application you want to trial.")}</p><strong>{t("Tìm hiểu yêu cầu mẫu", "Explore sample inquiries")}<ArrowRight size={17} /></strong></Link>
      <Link href="/business/request-quote" className="bp-start-card bp-start-card-primary bp-reveal"><span>02 / PROJECT BRIEF</span><div><FileText size={27} strokeWidth={1.2} /><ArrowUpRight size={25} /></div><h3>{t("Bắt đầu từ dự án.", "Start with a project.")}</h3><p>{t("Phác thảo nhu cầu, quy cách, sản lượng và thời gian dự kiến của bạn.", "Outline your requirements, specifications, volume and proposed timing.")}</p><strong>{t("Phác thảo nhu cầu hợp tác", "Outline your project")}<ArrowRight size={17} /></strong></Link>
    </div><p className="bp-start-note">{t("Biểu mẫu trải nghiệm · Thông tin chưa được gửi đi và chưa tạo yêu cầu hợp tác thực tế.", "Demo forms · Information is not sent and no real partnership request is created.")}</p></section>
  </main>;
}
