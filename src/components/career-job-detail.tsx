"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { usePageEffects } from "@/lib/use-page-effects";
import { ArrowLeft, ArrowUpRight, Check, CheckCircle2, Clock3, FileText, MapPin, Upload } from "lucide-react";
import { careerDepartments, careerJobs, careerLocation, careerSalary, type CareerJob } from "@/lib/careers";
import { useLanguage } from "@/lib/language-context";

export function CareerJobDetail({ job }: { job: CareerJob }) {
  const { lang } = useLanguage();
  const text = (vi: string, en: string) => lang === "vi" ? vi : en;
  const [cvName, setCvName] = useState("");
  const [fileError, setFileError] = useState<"type" | "size" | null>(null);
  const [completed, setCompleted] = useState<{ name: string; cv: string } | null>(null);
  const root = useRef<HTMLElement>(null);
  const moving = usePageEffects(root, "career-detail");
  const cvInput = useRef<HTMLInputElement>(null);
  const confirmation = useRef<HTMLDivElement>(null);
  const department = careerDepartments.find((item) => item.id === job.department)!;

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (fileError || !cvInput.current?.files?.length) { cvInput.current?.focus(); return; }
    const fields = new FormData(event.currentTarget);
    setCompleted({ name: String(fields.get("name")).trim(), cv: cvName });
    event.currentTarget.reset();
    setCvName("");
    requestAnimationFrame(() => { confirmation.current?.focus({ preventScroll: true }); confirmation.current?.scrollIntoView({ behavior: "auto", block: "center" }); });
  }

  return <main id="main" className="careers-page cr-detail-page page-motion" ref={root} data-effects={moving ? "on" : "off"} data-motion-choice="full">
    <section className="cr-detail-hero">
      <Link href="/careers#career-positions" className="back-link"><ArrowLeft size={19} />{text("Tất cả vị trí", "All roles")}</Link>
      <div className="cr-job-label"><p className="eyebrow">{department[lang]} / {job.code}</p><span className="cr-status">{text("Dự kiến", "Planned")}</span></div>
      <h1>{job.title[lang]}</h1><p className="cr-detail-summary">{job.summary[lang]}</p>
      <div className="cr-job-meta"><span><MapPin size={18} />{careerLocation[lang]}</span><span><Clock3 size={18} />{text("Toàn thời gian", "Full-time")}</span><span>{job.experience[lang]}</span></div>
    </section>
    <div className="cr-detail-layout cr-section">
      <div className="cr-detail-content">
        <section aria-labelledby="cr-duty-title"><p className="eyebrow">01 / YOUR ROLE</p><h2 id="cr-duty-title">{text("Bạn sẽ làm gì?", "What will you do?")}</h2><ul>{job.duties[lang].map((item) => <li key={item}>{item}</li>)}</ul></section>
        <section aria-labelledby="cr-requirement-title"><p className="eyebrow">02 / YOUR EXPERIENCE</p><h2 id="cr-requirement-title">{text("Điều chúng tôi tìm kiếm.", "What we are looking for.")}</h2><ul>{job.requirements[lang].map((item) => <li key={item}>{item}</li>)}</ul></section>
        <section aria-labelledby="cr-offer-title"><p className="eyebrow">03 / GROW WITH US</p><h2 id="cr-offer-title">{text("Định hướng quyền lợi.", "Our benefits framework.")}</h2><ul>{[
          text("Lương cơ bản theo vai trò và chuyên môn; phụ cấp theo tính chất công việc.", "Role-based pay and work-related allowances."),
          text("Thưởng dự kiến gắn với chất lượng, tiến độ và kết quả công việc của bộ phận.", "Proposed rewards linked to quality, progress and team results."),
          text("Đào tạo chuyên môn, hướng dẫn công việc và cơ hội phối hợp giữa các bộ phận.", "Professional development, role guidance and cross-team collaboration."),
          text("Định hướng bảo hiểm, nghỉ phép và bảo hộ lao động theo kế hoạch nhân sự.", "Insurance, leave and protective equipment under the proposed people plan."),
        ].map((item) => <li key={item}>{item}</li>)}</ul><p className="cr-plan-note">{text("Thông tin dựa trên đề án. Điều kiện làm việc và đãi ngộ thực tế cần được xác nhận khi mở tuyển.", "Based on the project plan. Actual working conditions and benefits need confirmation when recruitment opens.")}</p></section>
        <section aria-labelledby="cr-documents-title"><p className="eyebrow">04 / GET READY</p><h2 id="cr-documents-title">{text("Hồ sơ nên chuẩn bị.", "What to prepare.")}</h2><p>{job.portfolio[lang]}</p><div className="cr-document-tip"><FileText size={23} /><p>{text("CV định dạng PDF, DOC hoặc DOCX, tối đa 5 MB. Đặt tên file rõ ràng, ví dụ: HoTen_CV. Portfolio có thể là đường dẫn đến các sản phẩm bạn muốn giới thiệu.", "Upload a PDF, DOC or DOCX CV up to 5 MB, with a clear filename such as YourName_CV. Your portfolio can be a link to work you would like to share.")}</p></div></section>

        <section className="cr-application" id="career-application" aria-labelledby="cr-application-title">
          <p className="eyebrow">05 / YOUR APPLICATION</p><h2 id="cr-application-title">{text("Giới thiệu về bạn.", "Tell us about yourself.")}</h2><p className="cr-plan-note">{text("Ứng tuyển mô phỏng · Thông tin và CV chỉ dùng trong phiên trải nghiệm, không được gửi hoặc lưu vào hệ thống tuyển dụng.", "Simulated application · Your details and CV are used only for this experience and are not submitted or stored in a recruitment system.")}</p>
          {completed ? <div className="cr-application-complete" role="status" tabIndex={-1} ref={confirmation}>
            <CheckCircle2 size={39} strokeWidth={1.4} /><h3>{text("Đã hoàn tất ứng tuyển mô phỏng.", "Your simulated application is complete.")}</h3><p>{text("Cảm ơn", "Thank you")}, {completed.name}. {text("Bạn đã trải nghiệm bước ứng tuyển cho vị trí", "You have completed the application experience for")} <strong>{job.title[lang]}</strong>.</p><dl><div><dt>{text("Mã vị trí", "Role code")}</dt><dd>{job.code}</dd></div><div><dt>CV</dt><dd>{completed.cv}</dd></div></dl><p>{text("Đây là xác nhận của bản mô phỏng. Hồ sơ và file CV chưa được gửi đến nhà tuyển dụng.", "This confirms the simulation only. Your application and CV have not been sent to an employer.")}</p><button className="cr-text-link" onClick={() => setCompleted(null)}>{text("Thử lại biểu mẫu", "Try the form again")}<ArrowUpRight size={18} /></button>
          </div> : <form className="cr-application-form" onSubmit={onSubmit}>
            <div className="cr-form-row"><label>{text("Họ và tên", "Full name")} *<input name="name" required pattern=".*\S.*" maxLength={120} autoComplete="name" placeholder={text("Tên đầy đủ của bạn", "Your full name")} /></label><label>Email *<input name="email" type="email" required maxLength={200} autoComplete="email" placeholder="you@example.com" /></label></div>
            <div className="cr-form-row"><label>{text("Số điện thoại", "Phone number")} *<input name="phone" type="tel" required pattern="\+?[0-9][0-9 ]{7,19}" autoComplete="tel" title={text("Nhập số điện thoại gồm 8–20 chữ số hoặc khoảng trắng, có thể bắt đầu bằng dấu +.", "Enter 8–20 digits or spaces, optionally starting with +.")} placeholder={text("Số điện thoại liên hệ", "Your contact number")} /></label><label>{text("Portfolio / hồ sơ chuyên môn", "Portfolio / professional profile")}<input name="portfolio" type="url" pattern="https?://.+" maxLength={500} placeholder="https://…" /></label></div>
            <label className="cr-upload-label">{text("Đính kèm CV", "Attach your CV")} *<span className="cr-upload"><Upload size={24} /><span>{cvName || text("Chọn CV từ thiết bị", "Choose a CV from your device")}<small>PDF, DOC, DOCX · {text("Tối đa", "Up to")} 5 MB</small></span><input ref={cvInput} type="file" name="cv" accept=".pdf,.doc,.docx" required aria-describedby="cr-file-help" aria-invalid={!!fileError} onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) { setCvName(""); setFileError(null); return; }
              const error = !/\.(pdf|doc|docx)$/i.test(file.name) ? "type" : file.size > 5 * 1024 * 1024 || file.size === 0 ? "size" : null;
              setFileError(error);
              if (error) { event.target.value = ""; setCvName(""); } else setCvName(file.name);
            }} /></span></label>
            <p id="cr-file-help" className={fileError ? "cr-field-error" : "cr-file-help"} role={fileError ? "alert" : undefined}>{fileError === "type" ? text("Vui lòng chọn file PDF, DOC hoặc DOCX.", "Please choose a PDF, DOC or DOCX file.") : fileError === "size" ? text("File cần có nội dung và không vượt quá 5 MB.", "The file must not be empty and must be no larger than 5 MB.") : text("File được chọn để mô phỏng đính kèm; không tải lên máy chủ.", "The file simulates an attachment and is not uploaded.")}</p>
            <label>{text("Điều bạn muốn chia sẻ", "What would you like to share?")}<textarea name="intro" rows={5} maxLength={3000} placeholder={text("Kinh nghiệm liên quan, lý do bạn quan tâm và thời gian có thể bắt đầu…", "Relevant experience, your interest in the role and availability…")} /></label>
            <button type="submit" className="cr-button">{text("Gửi hồ sơ mô phỏng", "Submit simulated application")}<ArrowUpRight size={19} /></button>
          </form>}
        </section>
      </div>
      <aside className="cr-role-aside"><div className="cr-role-summary"><p className="eyebrow">{text("THÔNG TIN VỊ TRÍ", "ROLE AT A GLANCE")}</p><dl><div><dt>{text("Bộ phận", "Department")}</dt><dd>{department[lang]}</dd></div><div><dt>{text("Địa điểm", "Location")}</dt><dd>{careerLocation[lang]}</dd></div><div><dt>{text("Hình thức", "Work type")}</dt><dd>{text("Toàn thời gian", "Full-time")}</dd></div><div><dt>{text("Lương dự toán / tháng", "Budgeted salary / month")}</dt><dd className="cr-role-salary">{careerSalary(job.salary, lang)}</dd></div><div><dt>{text("Trạng thái", "Status")}</dt><dd>{text("Vị trí dự kiến · ứng tuyển mô phỏng", "Planned role · simulated application")}</dd></div></dl><Link href="#career-application" className="cr-button">{text("Ứng tuyển mô phỏng", "Try the application")}<ArrowUpRight size={18} /></Link><p className="cr-file-help">{text("Chưa có thời hạn nhận hồ sơ chính thức.", "No official application deadline has been announced.")}</p></div><div className="cr-candidate-checklist"><h3>{text("Trước khi bắt đầu", "Before you start")}</h3>{[text("CV được cập nhật", "An up-to-date CV"), text("Thông tin liên hệ rõ ràng", "Clear contact details"), text("Portfolio theo yêu cầu vị trí", "A role-relevant portfolio")].map((item) => <p key={item}><Check size={16} />{item}</p>)}<Link href="/careers#cr-process-title" className="cr-text-link">{text("Xem quy trình tuyển chọn", "View the process")}<ArrowUpRight size={17} /></Link></div></aside>
    </div>
    <section className="cr-section cr-other-roles"><p className="eyebrow">{text("TIẾP TỤC KHÁM PHÁ", "KEEP EXPLORING")}</p><h2>{text("Những vai trò khác.", "Other ways to contribute.")}</h2><div>{careerJobs.filter((item) => item.slug !== job.slug).slice(0, 3).map((item) => <Link href={`/careers/${item.slug}`} key={item.slug}><span>{careerDepartments.find((entry) => entry.id === item.department)?.[lang]}</span><h3>{item.title[lang]}</h3><ArrowUpRight size={22} /></Link>)}</div></section>
  </main>;
}
