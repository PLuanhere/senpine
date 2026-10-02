"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronDown, Handshake, Layers, Leaf, Mail, MessageCircle, PencilLine, ShieldCheck, Shirt, Sprout } from "lucide-react";
import { contactChannels, contactQuestions, contactTopics, type ContactTopicId } from "@/lib/contact-content";
import { useLanguage } from "@/lib/language-context";
import { usePageEffects } from "@/lib/use-page-effects";
import { PageAtmosphere } from "@/components/page-atmosphere";
import { ContactSignal, MotionRibbon, WritingThread } from "@/components/page-motion-art";

const topicIcons = [Layers, Handshake, Shirt, MessageCircle];
const emptyDraft = { name: "", email: "", organisation: "", message: "", material: "undecided" };
type Draft = typeof emptyDraft;

export function ContactExperience() {
  const root = useRef<HTMLElement>(null);
  const formSection = useRef<HTMLElement>(null);
  const formShell = useRef<HTMLDivElement>(null);
  const messageHeading = useRef<HTMLHeadingElement>(null);
  const nameInput = useRef<HTMLInputElement>(null);
  const messageInput = useRef<HTMLTextAreaElement>(null);
  const reviewTitle = useRef<HTMLHeadingElement>(null);
  const uid = useId();
  const { lang } = useLanguage();
  const moving = usePageEffects(root, "contact");
  const vi = lang === "vi";
  const text = (vietnamese: string, english: string) => vi ? vietnamese : english;
  const [topicId, setTopicId] = useState<ContactTopicId>("materials");
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<"name" | "message" | null>(null);
  const topic = contactTopics.find((item) => item.id === topicId)!;
  const filled = Number(draft.name.trim().length > 0) + Number(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email)) + Number(draft.message.trim().length >= 10);
  const materialLabel = draft.material === "undecided" ? text("Cần tư vấn thêm", "Open to guidance") : draft.material;

  useEffect(() => {
    if (submitted) {
      reviewTitle.current?.focus({ preventScroll: true });
      formShell.current?.scrollIntoView({ behavior: "instant", block: "start" });
    }
  }, [submitted]);

  function updateDraft(field: keyof Draft, value: string) {
    setDraft((current) => ({ ...current, [field]: value }));
    if (error === field) setError(null);
  }

  function chooseTopic(id: ContactTopicId, goToForm = false) {
    setTopicId(id);
    setSubmitted(false);
    setError(null);
    if (goToForm) {
      requestAnimationFrame(() => {
        formSection.current?.scrollIntoView({ behavior: moving ? "smooth" : "instant", block: "start" });
        messageHeading.current?.focus({ preventScroll: true });
      });
    }
  }

  function reviewMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.name.trim()) {
      setError("name");
      nameInput.current?.focus();
      return;
    }
    if (draft.message.trim().length < 10) {
      setError("message");
      messageInput.current?.focus();
      return;
    }
    // This project has no receiving endpoint. Keep personal details in component state only.
    setDraft((current) => ({ ...current, name: current.name.trim(), email: current.email.trim(), organisation: current.organisation.trim(), message: current.message.trim() }));
    setError(null);
    setSubmitted(true);
  }

  function editMessage(reset = false) {
    if (reset) setDraft(emptyDraft);
    setSubmitted(false);
    requestAnimationFrame(() => nameInput.current?.focus({ preventScroll: true }));
  }

  return <main id="main" className="ct-page page-motion" ref={root} data-moving={moving} data-effects={moving ? "on" : "off"} data-motion-choice="full">
    <section className="ct-hero" aria-labelledby={`${uid}-title`}>
      <PageAtmosphere variant="contact" />
      <div className="ct-hero-copy">
        <p className="ct-eyebrow"><span className="ct-dot" />08 / {text("LIÊN HỆ SENPINE", "CONTACT SENPINE")}</p>
        <h1 id={`${uid}-title`}>{text("Dệt kết nối.", "Weave connections.")}<br /><span>{text("Mở câu chuyện.", "Begin a story.")}</span></h1>
        <p className="ct-lead">{text("Từ một sợi tơ đến một ý tưởng mới. Hãy bắt đầu câu chuyện của bạn cùng vật liệu tự nhiên và thiết kế SenPine.", "From a single fibre to a new idea. Begin your story with natural materials and SenPine design.")}</p>
        <div className="ct-actions">
          <a href="#contact-message" className="ct-button">{text("Chuẩn bị lời nhắn", "Prepare a message")}<ArrowUpRight size={19} /></a>
          <a href="#contact-info" className="ct-text-link">{text("Thông tin liên hệ", "Contact information")}<ArrowDown size={17} /></a>
        </div>
        <p className="ct-hero-caption"><Leaf size={17} />{text("Vật liệu Việt. Ý tưởng của bạn. Câu chuyện chung.", "Vietnamese fibres. Your ideas. Our shared story.")}</p>
      </div>
      <div className="ct-hero-visual">
        <ContactSignal />
        <svg className="ct-threads" viewBox="0 0 650 700" fill="none" aria-hidden="true">{Array.from({ length: 5 }, (_, index) => <path key={index} pathLength="1" d={`M${70 + index * 15} 710C${-120 + index * 25} 280 ${800 - index * 30} 590 ${610 - index * 15} -30`} stroke="currentColor" strokeWidth="1" />)}</svg>
        <figure className="ct-picture-inner">
          <div className="ct-picture"><Image className="ct-hero-image" src="/images/generated/saved-keepsakes-hero.webp" alt={text("Minh họa góc chất liệu với vải sợi tự nhiên, lá sen và lá dứa trong ánh sáng ấm", "Illustration of natural fabrics, lotus and pineapple leaves in warm light")} fill sizes="(max-width: 768px) 100vw, 48vw" preload /><div className="motion-photo-alternate" aria-hidden="true"><Image src="/images/generated/checkout-atelier-hero.webp" alt="" fill sizes="(max-width: 768px) 100vw, 48vw" /></div></div>
          <figcaption><span>SenPine / {text("Không gian ý tưởng", "A space for ideas")}</span><span>{text("Hình minh họa", "Illustration")}</span></figcaption>
        </figure>
        <div className="ct-floating-note"><div className="ct-note-motion"><div className="ct-note-inner">
          <Sprout size={28} strokeWidth={1.25} />
          <p>{text("Một ý tưởng nhỏ.", "A small idea.")}<br />{text("Nhiều khả năng mới.", "New possibilities.")}</p>
          <div className="ct-note-stitches" aria-hidden="true" />
          <span>PineFiber · SenSilk · Blend</span>
        </div></div></div>
      </div>
    </section>

    <MotionRibbon scene="contact" />
    <section id="contact-info" className="ct-contact-info ct-section" aria-labelledby={`${uid}-channels`}>
      <div className="ct-section-heading ct-reveal">
        <div><p className="ct-eyebrow">{text("THÔNG TIN LIÊN HỆ", "CONTACT INFORMATION")}</p><h2 id={`${uid}-channels`}>{text("Kết nối theo cách của bạn.", "Connect your way.")}</h2></div>
        <p>{text("Một cuộc trò chuyện gần gũi, một brief chi tiết hay đơn giản là theo dõi câu chuyện SenPine. Mỗi kênh mở một hướng kết nối.", "A friendly conversation, a detailed brief or simply following the SenPine story. Each channel opens a way to connect.")}</p>
      </div>
      <div className="ct-channel-grid">
        {contactChannels.map((channel) => {
          const Icon = channel.id === "email" ? Mail : MessageCircle;
          const available = Boolean(channel.value && channel.href);
          return <article className="ct-channel-card ct-reveal" key={channel.id} data-channel={channel.id}>
            <div className="ct-channel-top"><span className={`ct-channel-icon ct-channel-icon-${channel.id}`}>{channel.id === "facebook" ? <span className="ct-facebook-glyph" aria-hidden="true">f</span> : <Icon size={25} strokeWidth={1.4} aria-hidden="true" />}</span><span className="ct-channel-purpose">{channel.purpose[lang]}</span></div>
            <h3>{channel.name[lang]}</h3>
            <p>{channel.description[lang]}</p>
            <div className="ct-channel-bottom">
              {available ? <><span className="ct-channel-value">{channel.value}</span><a href={channel.href!} className="ct-channel-link" target={channel.id === "email" ? undefined : "_blank"} rel={channel.id === "email" ? undefined : "noopener noreferrer"}>{channel.action[lang]}<ArrowUpRight size={18} aria-hidden="true" /></a></> : <><span className="ct-channel-value ct-channel-placeholder">{channel.placeholder}</span><span className="ct-channel-status"><span aria-hidden="true" />{text("Thông tin mẫu", "Sample details")}</span></>}
            </div>
          </article>;
        })}
      </div>
      {contactChannels.some((channel) => !channel.value || !channel.href) && <p className="ct-contact-info-note ct-reveal">{text("Các mục có nhãn “Thông tin mẫu” minh họa bố cục liên hệ. Bạn có thể", "Channels marked “Sample details” illustrate the contact layout. You can")} <a href="#contact-message">{text("chuẩn bị lời nhắn bên dưới", "prepare a message below")}</a>.</p>}
    </section>

    <section id="contact-directions" className="ct-directions ct-section" aria-labelledby={`${uid}-directions`}>
      <div className="ct-section-heading ct-reveal">
        <div><p className="ct-eyebrow">01 / {text("CHỌN ĐIỂM BẮT ĐẦU", "CHOOSE A STARTING POINT")}</p><h2 id={`${uid}-directions`}>{text("Bạn muốn kể câu chuyện gì?", "What is your story?")}</h2></div>
        <p>{text("Chọn một hướng trao đổi để lời nhắn có thêm gợi ý phù hợp. Ý tưởng chưa hoàn chỉnh cũng là một khởi đầu.", "Choose a direction for a little guidance with your message. An unfinished idea is a good beginning too.")}</p>
      </div>
      <div className="ct-topic-grid" role="group" aria-label={text("Chọn hướng trao đổi", "Choose a conversation direction")}>
        {contactTopics.map((item, index) => {
          const Icon = topicIcons[index];
          return <button key={item.id} type="button" className="ct-topic-card" aria-pressed={topicId === item.id} onClick={() => chooseTopic(item.id, true)}>
            <span className="ct-card-top"><span className="ct-topic-icon"><Icon size={25} strokeWidth={1.3} /></span><span className="ct-card-number">0{index + 1}</span></span>
            <span className="ct-card-title">{item.label[lang]}</span>
            <span className="ct-card-description">{item.description[lang]}</span>
            <span className="ct-card-audience">{item.audience[lang]}</span>
            <span className="ct-card-action">{topicId === item.id ? text("Đang chọn", "Selected") : text("Bắt đầu tại đây", "Start here")}{topicId === item.id ? <Check size={18} /> : <ArrowUpRight size={18} />}</span>
          </button>;
        })}
      </div>
    </section>

    <section id="contact-message" className="ct-message-section ct-section" ref={formSection} aria-labelledby={`${uid}-message-heading`}>
      <div className="ct-message-intro ct-reveal">
        <p className="ct-eyebrow">02 / {text("KHÔNG GIAN TRAO ĐỔI", "SPACE FOR CONVERSATION")}</p>
        <h2 id={`${uid}-message-heading`} ref={messageHeading} tabIndex={-1}>{text("Một lời nhắn,", "One message,")}<br /><span>{text("một khởi đầu.", "a new beginning.")}</span></h2>
        <p>{text("Kể một chút về bạn và điều bạn đang ấp ủ. Chúng tôi đã chuẩn bị vài gợi ý để bạn dễ bắt đầu.", "Tell a little about yourself and what you have in mind. We have prepared a few prompts to help you begin.")}</p>
        <div className="ct-guidance" key={topicId}>
          <span className="ct-mini-label"><PencilLine size={16} />{text("GỢI Ý CHO LỜI NHẮN", "A LITTLE GUIDANCE")}</span>
          <h3>{topic.heading[lang]}</h3>
          <p>{topic.guidance[lang]}</p>
          <ul>{topic.checklist[lang].map((item) => <li key={item}><Check size={15} />{item}</li>)}</ul>
          <Link href={topic.link} className="ct-text-link">{topic.linkLabel[lang]}<ArrowUpRight size={17} /></Link>
        </div>
        <div className="ct-channel-note"><ShieldCheck size={23} strokeWidth={1.4} /><div><h3>{text("Về kênh kết nối hiện tại", "Our current contact channel")}</h3><p>{text("SenPine đang được giới thiệu dưới dạng đề án. Email, số điện thoại và địa chỉ tiếp nhận chính thức chưa được xác nhận. Biểu mẫu bên cạnh là trải nghiệm chuẩn bị nội dung, chưa gửi lời nhắn đi.", "SenPine is currently presented as a project. An official email, phone number and receiving address have not been confirmed. This form helps prepare your message; it does not send it.")}</p></div></div>
      </div>
      <div className="ct-form-shell ct-reveal" ref={formShell}>
        {submitted ? <div className="ct-review">
          <span className="ct-review-icon"><Check size={30} strokeWidth={1.5} /></span>
          <p className="ct-eyebrow">{text("BẢN XEM LẠI · CHƯA GỬI ĐI", "MESSAGE REVIEW · NOT SENT")}</p>
          <h3 ref={reviewTitle} tabIndex={-1} className="ct-review-title">{text("Lời nhắn đã sẵn sàng để xem lại.", "Your message is ready to review.")}</h3>
          <p role="status">{text("Thông tin hợp lệ cho trải nghiệm demo. Nội dung chỉ xuất hiện trong phiên này, chưa được gửi đến SenPine hoặc lưu trữ.", "Your details are valid for this demo. The message exists only in this session; it has not been sent to SenPine or stored.")}</p>
          <dl className="ct-review-details">
            <div><dt>{text("Người liên hệ", "Contact name")}</dt><dd>{draft.name}</dd></div>
            <div><dt>Email</dt><dd>{draft.email}</dd></div>
            {draft.organisation && <div><dt>{text("Tổ chức", "Organisation")}</dt><dd>{draft.organisation}</dd></div>}
            <div><dt>{text("Chủ đề", "Subject")}</dt><dd>{topic.label[lang]}</dd></div>
            {topicId !== "other" && <div><dt>{text("Chất liệu", "Material")}</dt><dd>{materialLabel}</dd></div>}
          </dl>
          <div className="ct-review-message"><span className="ct-mini-label">{text("LỜI NHẮN CỦA BẠN", "YOUR MESSAGE")}</span><p>{draft.message}</p></div>
          <div className="ct-review-actions"><button className="ct-button" type="button" onClick={() => editMessage()}>{text("Chỉnh sửa lời nhắn", "Edit message")}<PencilLine size={17} /></button><button className="ct-text-link" type="button" onClick={() => editMessage(true)}>{text("Viết lời nhắn mới", "Start a new message")}<ArrowRight size={17} /></button></div>
        </div> : <form className="ct-form" onSubmit={reviewMessage} aria-label={text("Chuẩn bị lời nhắn cho SenPine", "Prepare a message for SenPine")}>
          <WritingThread /><div className="ct-form-heading"><div><span className="ct-mini-label">{text("LỜI NHẮN CỦA BẠN", "YOUR MESSAGE")}</span><h3>{text("Cùng bắt đầu nhé.", "Let’s begin.")}</h3></div><span className="ct-form-demo">{text("Trải nghiệm demo", "Demo experience")}</span></div>
          <p className="ct-form-description">{text("Các mục có dấu * cần được điền. Bạn có thể xem lại và chỉnh sửa trước khi rời trang.", "Fields marked * are required. You can review and edit your message before leaving the page.")}</p>
          <div className="ct-fields">
            <div className="ct-field"><label htmlFor={`${uid}-name`}>{text("Họ và tên", "Full name")} *</label><input id={`${uid}-name`} ref={nameInput} name="name" autoComplete="name" required maxLength={100} value={draft.name} placeholder={text("Tên của bạn", "Your name")} aria-invalid={error === "name" || undefined} aria-describedby={error === "name" ? `${uid}-error` : undefined} onChange={(event) => updateDraft("name", event.target.value)} /></div>
            <div className="ct-field"><label htmlFor={`${uid}-email`}>Email *</label><input id={`${uid}-email`} type="email" name="email" autoComplete="email" required maxLength={150} value={draft.email} placeholder="you@example.com" onChange={(event) => updateDraft("email", event.target.value)} /></div>
            <div className="ct-field ct-field-wide"><label htmlFor={`${uid}-organisation`}>{text("Thương hiệu / Tổ chức", "Brand / Organisation")} <span>{text("(không bắt buộc)", "(optional)")}</span></label><input id={`${uid}-organisation`} name="organisation" autoComplete="organization" maxLength={150} value={draft.organisation} placeholder={text("Thương hiệu, studio, trường học…", "Brand, studio, university…")} onChange={(event) => updateDraft("organisation", event.target.value)} /></div>
            <div className={`ct-field ${topicId === "other" ? "ct-field-wide" : ""}`}><label htmlFor={`${uid}-subject`}>{text("Chủ đề trao đổi", "Conversation subject")}</label><select id={`${uid}-subject`} name="subject" value={topicId} onChange={(event) => chooseTopic(event.target.value as ContactTopicId)}>{contactTopics.map((item) => <option value={item.id} key={item.id}>{item.label[lang]}</option>)}</select></div>
            {topicId !== "other" && <div className="ct-field"><label htmlFor={`${uid}-material`}>{text("Chất liệu quan tâm", "Material of interest")}</label><select id={`${uid}-material`} name="material" value={draft.material} onChange={(event) => updateDraft("material", event.target.value)}><option value="undecided">{text("Cần tư vấn thêm", "Open to guidance")}</option><option>PineFiber</option><option>SenSilk</option><option>SenPine Blend</option></select></div>}
            <div className="ct-field ct-field-wide"><label htmlFor={`${uid}-message`}>{text("Nội dung lời nhắn", "Your message")} *</label><textarea ref={messageInput} id={`${uid}-message`} name="message" rows={6} required minLength={10} maxLength={1500} value={draft.message} placeholder={topic.placeholder[lang]} aria-invalid={error === "message" || undefined} aria-describedby={`${uid}-message-hint${error === "message" ? ` ${uid}-error` : ""}`} onChange={(event) => updateDraft("message", event.target.value)} /><div className="ct-message-hint" id={`${uid}-message-hint`}><span>{text("Ít nhất 10 ký tự có nội dung.", "At least 10 meaningful characters.")}</span><span>{draft.message.length} / 1500</span></div></div>
          </div>
          {error && <p className="ct-form-error" role="alert" id={`${uid}-error`}>{error === "name" ? text("Hãy nhập họ và tên có nội dung, không chỉ khoảng trắng.", "Enter a name with visible characters, not only spaces.") : text("Lời nhắn cần ít nhất 10 ký tự sau khi bỏ khoảng trắng ở hai đầu.", "Your message needs at least 10 characters after trimming surrounding spaces.")}</p>}
          <div className="ct-form-progress"><span>{text("Đã chuẩn bị", "Prepared")} {filled}/3 {text("mục cần thiết", "required fields")}</span><div aria-hidden="true">{[0, 1, 2].map((index) => <span key={index} data-filled={index < filled} />)}</div></div>
          <button className="ct-button ct-submit" type="submit">{text("Xem lại lời nhắn", "Review message")}<ArrowUpRight size={19} /></button>
          <p className="ct-form-footnote"><ShieldCheck size={16} />{text("Chỉ xem lại trong trình duyệt. Dữ liệu không được gửi hoặc lưu trữ; bản nháp mất khi rời hoặc tải lại trang.", "Browser review only. Details are not sent or stored; the draft is cleared when you leave or reload the page.")}</p>
        </form>}
      </div>
    </section>

    <section className="ct-next ct-section" aria-labelledby={`${uid}-next`}>
      <div className="ct-next-heading ct-reveal"><p className="ct-eyebrow">{text("TỪ Ý TƯỞNG ĐẾN LỜI NHẮN", "FROM AN IDEA TO A MESSAGE")}</p><h2 id={`${uid}-next`}>{text("Kết nối bắt đầu thật đơn giản.", "A simple way to connect.")}</h2></div>
      <ol className="ct-next-steps">{[
        { title: text("Chọn hướng trao đổi", "Choose your direction"), description: text("Vật liệu, hợp tác, thiết kế hay một góc nhìn mới — chọn điều bạn quan tâm.", "Materials, partnerships, designs or a new perspective — choose what interests you.") },
        { title: text("Phác thảo mong muốn", "Outline your idea"), description: text("Thêm vài chi tiết về ứng dụng, mục tiêu và những câu hỏi đang có.", "Add a few details about your application, goals and the questions on your mind.") },
        { title: text("Xem lại câu chuyện", "Review your story"), description: text("Kiểm tra và chỉnh sửa bản nháp. Trải nghiệm hiện dừng ở bước xem lại trong trình duyệt.", "Check and edit your draft. The current experience ends with a review in your browser.") },
      ].map((item, index) => <li key={index} className="ct-reveal"><span className="ct-step-number">0{index + 1}</span><h3>{item.title}</h3><p>{item.description}</p></li>)}</ol>
    </section>

    <section className="ct-faq ct-section" aria-labelledby={`${uid}-faq`}>
      <div className="ct-faq-intro ct-reveal"><ContactSignal compact /><p className="ct-eyebrow">03 / {text("TRƯỚC KHI BẠN HỎI", "BEFORE YOU ASK")}</p><h2 id={`${uid}-faq`}>{text("Một vài điều", "A few things")}<br />{text("bạn muốn biết.", "you might wonder.")}</h2><p>{text("Những câu trả lời giúp bạn hiểu rõ vật liệu, cách khám phá và giai đoạn hiện tại của SenPine.", "A little clarity on the materials, how to explore them and where SenPine is today.")}</p><a href="#contact-message" className="ct-text-link">{text("Bạn có câu hỏi khác?", "Have another question?")}<ArrowUpRight size={17} /></a></div>
      <div className="ct-faq-list ct-reveal">{contactQuestions.map((item, index) => <details key={index}><summary><span className="ct-faq-number">0{index + 1}</span><span>{item.question[lang]}</span><ChevronDown size={20} /></summary><div className="ct-faq-answer"><p>{item.answer[lang]}</p>{"href" in item && <Link href={item.href} className="ct-text-link">{item.link[lang]}<ArrowUpRight size={16} /></Link>}</div></details>)}</div>
    </section>

    <section className="ct-project ct-section ct-reveal" aria-labelledby={`${uid}-project`}>
      <div className="ct-project-mark" aria-hidden="true"><Sprout size={60} strokeWidth={1} /><span>SenPine.</span></div>
      <div className="ct-project-copy"><p className="ct-eyebrow">{text("HIỂU NHAU TỪ CÂU CHUYỆN", "GET TO KNOW THE STORY")}</p><h2 id={`${uid}-project`}>{text("Từ thiên nhiên Việt, hướng đến những kết nối bền vững.", "Rooted in Vietnam, growing lasting connections.")}</h2><p>{text("SenPine là đề án nghiên cứu và khởi nghiệp về vải sinh học từ tơ sen và sợi lá dứa trong thời trang bền vững. Câu chuyện thương hiệu, mô hình doanh nghiệp và lộ trình đề xuất được tập hợp trong hồ sơ dự án.", "SenPine is a research and entrepreneurship project exploring lotus silk and pineapple leaf fibres in sustainable fashion. The project profile brings together its brand story, business model and proposed roadmap.")}</p><div className="ct-project-credit"><span>IUH / {text("Khoa Quản trị Kinh doanh", "Faculty of Business Administration")}</span><span>{text("Nhóm 4 · DHTMDT20C", "Group 4 · DHTMDT20C")}</span></div><Link href="/about" className="ct-button">{text("Khám phá toàn bộ SenPine", "Discover the SenPine story")}<ArrowUpRight size={19} /></Link></div>
    </section>
  </main>;
}
