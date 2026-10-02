"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Clock3, MapPin, Search, Sprout, X, Coins, FlaskConical, ShieldCheck, Handshake } from "lucide-react";
import { careerDepartments, careerJobs, careerLocation, careerSalary, normalizeCareerSearch } from "@/lib/careers";
import { useLanguage } from "@/lib/language-context";
import { usePageEffects } from "@/lib/use-page-effects";
import { PageAtmosphere } from "@/components/page-atmosphere";
import { CareerWeave, MotionRibbon } from "@/components/page-motion-art";
import { detailsImages } from "@/lib/imagery";

const benefits = [
  { vi: ["Thu nhập có cơ sở", "Lương theo chuyên môn, phụ cấp theo công việc và thưởng gắn với kết quả. Mức trên từng vị trí là dự toán trong đề án."], en: ["A clear pay framework", "Role-based salary, work-related allowances and performance rewards. Listed amounts are project budget estimates."] },
  { vi: ["Học từ công việc thật", "Định hướng đào tạo về sợi thực vật, quy trình dệt và chất lượng; phối hợp cùng nghiên cứu, thiết kế và sản xuất."], en: ["Learn through practice", "Planned training in botanical fibres, textile processes and quality, with research, design and production collaboration."] },
  { vi: ["Làm việc có trách nhiệm", "Định hướng bảo hộ cho công việc sản xuất, môi trường làm việc an toàn và cách đánh giá minh bạch."], en: ["Work responsibly", "Planned protective equipment for production roles, a safe workspace and transparent evaluation."] },
  { vi: ["Cùng xây nền tảng", "Đóng góp vào một dự án từ giai đoạn phát triển: chủ động đề xuất, ghi nhận cải tiến và nhìn thấy kết quả công việc."], en: ["Build the foundations", "Contribute while the project develops: propose ideas, document improvements and see the results of your work."] },
];
const steps = [
  { vi: ["Hồ sơ ứng tuyển", "Chuẩn bị CV, chọn đúng vị trí và bổ sung portfolio hoặc dự án liên quan."], en: ["Your application", "Prepare a CV, choose the relevant role and add a portfolio or related project."] },
  { vi: ["Trao đổi ban đầu", "Làm rõ kinh nghiệm, kỳ vọng, thời gian có thể bắt đầu và sự phù hợp với công việc."], en: ["An initial conversation", "Discuss experience, expectations, availability and alignment with the role."] },
  { vi: ["Gặp nhóm chuyên môn", "Trao đổi tình huống thực tế hoặc bài tập phù hợp với vị trí. Phạm vi được thông báo trước."], en: ["Meet the team", "Discuss practical scenarios or a relevant task, with the scope shared beforehand."] },
  { vi: ["Thống nhất & đồng hành", "Trao đổi kết quả, thống nhất điều kiện làm việc và kế hoạch hướng dẫn khi bắt đầu."], en: ["Agree the next steps", "Discuss the outcome, working conditions and an onboarding plan."] },
];

export function CareersExperience() {
  const { lang } = useLanguage();
  const root = useRef<HTMLElement>(null);
  const moving = usePageEffects(root, "careers");
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("all");
  const text = (vi: string, en: string) => lang === "vi" ? vi : en;
  const matching = careerJobs.filter((job) => (department === "all" || job.department === department) && normalizeCareerSearch(`${job.title.vi} ${job.title.en} ${careerDepartments.find((item) => item.id === job.department)?.[lang]} ${job.summary[lang]}`).includes(normalizeCareerSearch(query)));

  return <main id="main" className="careers-page page-motion" ref={root} data-effects={moving ? "on" : "off"} data-motion-choice="full">
    <section className="cr-hero" aria-labelledby="cr-title">
      <PageAtmosphere variant="careers" />
      <div className="cr-hero-copy">
        <p className="eyebrow">SENPINE / {text("TUYỂN DỤNG", "CAREERS")}</p>
        <h1 id="cr-title">{text("Cùng làm nên", "Make something")}<br /><em>{text("điều có ý nghĩa.", "meaningful together.")}</em></h1>
        <p>{text("Một hành trình mới cho sợi thực vật. Một cơ hội để bạn góp chuyên môn, sự tò mò và đôi bàn tay của mình vào từng bước phát triển.", "A new journey for botanical fibres. An opportunity to bring your expertise, curiosity and craft to each step of its development.")}</p>
        <Link href="#career-positions" className="cr-button cr-button-light">{text("Khám phá vị trí", "Explore roles")}<ArrowDown size={19} /></Link>
        <div className="cr-hero-bottom"><Sprout size={22} /><span>{text("Nghiên cứu. Sản xuất. Sáng tạo. Cùng phát triển.", "Research. Production. Creativity. Growing together.")}</span></div>
      </div>
      <div className="cr-hero-visual">
        <CareerWeave />
        <div className="cr-photo-index"><span>PEOPLE & PURPOSE</span><span>01 / SENPINE</span></div>
        <div className="cr-hero-photo"><Image src={detailsImages.extraction.src} alt={detailsImages.extraction.alt} fill priority sizes="(max-width: 900px) 100vw, 45vw" /><div className="motion-photo-alternate" aria-hidden="true"><Image src={detailsImages.lotusSorting.src} alt="" fill sizes="(max-width: 900px) 100vw, 45vw" /></div></div>
        <div className="cr-photo-note"><span>FROM FIBRE<br />TO FUTURE.</span><p>{text("Giá trị bắt đầu từ những người làm ra nó.", "Value begins with the people who make it.")}</p><span className="cr-star" aria-hidden="true">✳</span></div>
      </div>
    </section>

    <MotionRibbon scene="careers" />
    <div className="cr-chapter-bar"><span>{text("TÌM MỘT VAI TRÒ. VIẾT MỘT CHƯƠNG MỚI.", "FIND YOUR ROLE. WRITE A NEW CHAPTER.")}</span><Link href="#career-life">{text("Làm việc tại SenPine", "Life at SenPine")}<ArrowDown size={16} /></Link></div>

    <section className="cr-section cr-positions" id="career-positions" aria-labelledby="cr-positions-title">
      <div className="cr-section-heading cr-reveal"><div><p className="eyebrow">01 / {text("CƠ HỘI NGHỀ NGHIỆP", "CAREER OPPORTUNITIES")}</p><h2 id="cr-positions-title">{text("Tìm nơi bạn", "Find where you")}<br /><em>{text("có thể đóng góp.", "can contribute.")}</em></h2></div><div className="cr-heading-aside"><span className="cr-count">07</span><p>{text("nhóm chuyên môn trong kế hoạch nhân sự SenPine", "specialist teams in the SenPine staffing plan")}</p></div></div>
      <p className="cr-plan-note">{text("Các vị trí dự kiến được xây dựng từ kế hoạch nhân sự trong đề án. Chưa công bố đợt tuyển hoặc thời hạn nhận CV chính thức.", "These proposed roles are based on the project staffing plan. An official recruitment round or application deadline has not been announced.")}</p>
      <div className="cr-filters">
        <label className="cr-search"><Search size={21} /><span className="sr-only">{text("Tìm vị trí", "Search roles")}</span><input type="search" placeholder={text("Tên vị trí, chuyên môn…", "Role title, expertise…")} value={query} onChange={(event) => setQuery(event.target.value)} />{query && <button type="button" aria-label={text("Xóa tìm kiếm", "Clear search")} onClick={() => setQuery("")}><X size={17} /></button>}</label>
        <label className="cr-select"><span>{text("Bộ phận", "Department")}</span><select aria-label={text("Bộ phận", "Department")} value={department} onChange={(event) => setDepartment(event.target.value)}>{[{ id: "all", vi: "Tất cả bộ phận", en: "All departments" }, ...careerDepartments].map((item) => <option key={item.id} value={item.id}>{item[lang]}</option>)}</select></label>
      </div>
      <div className="cr-results-heading"><p role="status" aria-live="polite">{matching.length} {text("vị trí phù hợp", "matching roles")}</p><span>{text("VỊ TRÍ / ĐỊA ĐIỂM / ĐÃI NGỘ", "ROLE / LOCATION / PAY")}</span></div>
      <div className="cr-job-list">
        {matching.map((job) => <Link key={job.slug} className="cr-job-card" href={`/careers/${job.slug}`}>
          <div className="cr-job-main"><div className="cr-job-label"><span>{careerDepartments.find((item) => item.id === job.department)?.[lang]}</span><span className="cr-status">{text("Dự kiến", "Planned")}</span></div><h3>{job.title[lang]}</h3><p>{job.summary[lang]}</p><div className="cr-job-meta"><span><MapPin size={16} />{careerLocation[lang]}</span><span><Clock3 size={16} />{text("Toàn thời gian", "Full-time")}</span></div></div>
          <div className="cr-job-pay"><span>{text("Lương dự toán / tháng", "Budgeted salary / month")}</span><strong>{careerSalary(job.salary, lang)}</strong><span className="cr-job-code">{job.code}</span></div>
          <span className="cr-job-go" aria-label={text("Xem mô tả công việc", "View job description")}><ArrowUpRight size={23} /></span>
        </Link>)}
        {!matching.length && <div className="cr-empty"><Search size={28} /><h3>{text("Chưa tìm thấy vị trí phù hợp.", "No matching roles.")}</h3><p>{text("Thử từ khóa khác hoặc xem tất cả bộ phận.", "Try another keyword or browse all departments.")}</p><button className="cr-text-link" type="button" onClick={() => { setQuery(""); setDepartment("all"); }}>{text("Xóa bộ lọc", "Reset filters")}<ArrowRight size={18} /></button></div>}
      </div>
    </section>

    <section id="career-life" className="cr-section cr-life" aria-labelledby="cr-life-title">
      <div className="cr-life-image cr-reveal"><Image src={detailsImages.rawFiber.src} alt={detailsImages.rawFiber.alt} fill sizes="(max-width: 900px) 100vw, 40vw" /><span>{text("CHUYÊN MÔN TẠO NÊN GIÁ TRỊ", "EXPERTISE CREATES VALUE")}</span></div>
      <div className="cr-life-copy cr-reveal"><p className="eyebrow">02 / {text("LÀM VIỆC TẠI SENPINE", "LIFE AT SENPINE")}</p><h2 id="cr-life-title">{text("Làm tốt công việc.", "Do good work.")}<br /><em>{text("Cùng lớn lên.", "Grow together.")}</em></h2><p>{text("Chúng tôi hướng tới một đội ngũ tôn trọng chuyên môn, làm việc có phương pháp và trao đổi thẳng thắn. Một thử nghiệm tốt cần dữ liệu rõ ràng. Một sản phẩm tốt cần sự phối hợp của nhiều người.", "We aim to build a team that respects expertise, works methodically and communicates openly. Good experiments need clear data. Good products need people working together.")}</p><ul>{[text("Tôn trọng dữ liệu và cam kết công việc", "Respect evidence and commitments"), text("Chia sẻ kiến thức giữa các bộ phận", "Share knowledge across teams"), text("Quan tâm đến chất lượng và an toàn", "Care about quality and safety")].map((item) => <li key={item}><Check size={18} />{item}</li>)}</ul><Link href="/about" className="cr-text-link">{text("Hiểu thêm về SenPine", "Get to know SenPine")}<ArrowUpRight size={19} /></Link></div>
    </section>

    <section className="cr-section" aria-labelledby="cr-benefits-title"><div className="cr-section-heading cr-reveal"><div><p className="eyebrow">03 / {text("ĐỊNH HƯỚNG ĐÃI NGỘ", "OUR BENEFITS FRAMEWORK")}</p><h2 id="cr-benefits-title">{text("Cho công việc.", "For your work.")}<br /><em>{text("Và cho bạn.", "And for you.")}</em></h2></div><p>{text("Chính sách nhân sự dự kiến trong đề án. Điều kiện cụ thể sẽ được trao đổi khi vị trí mở tuyển chính thức.", "The project's proposed people policies. Specific terms will be discussed when a role officially opens.")}</p></div><div className="cr-benefits">{benefits.map((item, index) => <article className="cr-reveal" key={item.vi[0]}><div className="cr-benefit-top"><span className="cr-benefit-number">0{index + 1}</span><span className={`cr-benefit-art cr-benefit-art-${index}`} aria-hidden="true">{index === 0 ? <Coins /> : index === 1 ? <FlaskConical /> : index === 2 ? <ShieldCheck /> : <Handshake />}</span></div><h3>{item[lang][0]}</h3><p>{item[lang][1]}</p></article>)}</div></section>

    <section className="cr-section cr-process" aria-labelledby="cr-process-title"><div className="cr-section-heading cr-reveal"><div><p className="eyebrow">04 / {text("QUY TRÌNH TUYỂN CHỌN", "THE RECRUITMENT PROCESS")}</p><h2 id="cr-process-title">{text("Rõ từng bước.", "Clear at each step.")}<br /><em>{text("Hiểu nhau trước khi bắt đầu.", "Get to know each other.")}</em></h2></div><p>{text("Quy trình dự kiến gồm bốn bước. Bạn được thông tin về nội dung trao đổi và yêu cầu của vị trí trước khi tham gia.", "A proposed four-step process, with the discussion topics and role requirements shared before you take part.")}</p></div><ol className="cr-process-steps">{steps.map((item, index) => <li className="cr-reveal" key={item.vi[0]}><span>0{index + 1}</span><h3>{item[lang][0]}</h3><p>{item[lang][1]}</p></li>)}</ol></section>

    <section className="cr-section cr-faq" aria-labelledby="cr-faq-title"><div className="cr-reveal"><div className="cr-faq-ornament" aria-hidden="true"><span>✳</span><i /><i /></div><p className="eyebrow">05 / {text("TRƯỚC KHI ỨNG TUYỂN", "BEFORE YOU APPLY")}</p><h2 id="cr-faq-title">{text("Bạn muốn", "Want to")}<br /><em>{text("biết thêm?", "know more?")}</em></h2></div><div className="cr-questions cr-reveal">{[
      [text("SenPine đã mở nhận CV chưa?", "Is SenPine accepting applications?"), text("Đây là trang tuyển dụng mô phỏng của đề án. Bạn có thể xem mô tả công việc, chọn CV và trải nghiệm biểu mẫu trên từng trang vị trí. Thông tin và CV không được gửi hoặc lưu vào hệ thống tuyển dụng.", "This is the project's simulated careers page. You can explore descriptions, select a CV and try the application form on each role page. Details and CVs are not submitted or stored in a recruitment system.")],
      [text("Tôi cần chuẩn bị hồ sơ gì?", "What should I prepare?"), text("Một CV cập nhật, thông tin liên hệ và mô tả kinh nghiệm liên quan. Vị trí thiết kế và Marketing nên kèm portfolio; vị trí R&D có thể bổ sung tóm tắt đề tài hoặc thử nghiệm.", "An up-to-date CV, contact details and relevant experience. Design and marketing roles benefit from a portfolio; R&D applicants can include a research or experiment summary.")],
      [text("Nơi làm việc ở đâu?", "Where would I work?"), text("Đề án dự kiến cơ sở tại KCN Sông Hậu, khu vực Cần Thơ. Địa điểm, hình thức làm việc và lịch làm việc của từng vị trí sẽ được xác nhận khi mở tuyển.", "The project proposes a facility in Song Hau Industrial Park, Can Tho. The location, work arrangement and schedule for each role will be confirmed when recruitment opens.")],
      [text("Mức lương trên website có ý nghĩa gì?", "What do the listed salaries mean?"), text("Đây là mức lương bình quân dự toán theo bộ phận trong báo cáo, không phải đề nghị tuyển dụng. Mức thực tế, phụ cấp và thưởng sẽ được trao đổi theo vị trí, chuyên môn và thời điểm tuyển.", "These are department-level average salary budgets from the report, not employment offers. Actual pay, allowances and rewards will be discussed for each role and recruitment round.")],
    ].map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></section>
    <section className="cr-bottom-cta"><Sprout size={37} strokeWidth={1.2} /><div><p className="eyebrow">YOUR NEXT CHAPTER</p><h2>{text("Một vai trò phù hợp đang chờ bạn khám phá.", "Explore a role that fits you.")}</h2></div><Link href="#career-positions" className="cr-button cr-button-light">{text("Xem các vị trí", "Browse roles")}<ArrowUpRight size={19} /></Link></section>
  </main>;
}
