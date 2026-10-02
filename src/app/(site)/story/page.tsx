import type { Metadata } from "next";
import Image from "next/image";
import { CtaBand, InlineLink, PageHero, PageSectionHeading } from "@/components/editorial";
import { journey } from "@/lib/content";

export const metadata: Metadata = { title: "Câu chuyện | SenPine", description: "Hành trình từ lá dứa và tơ sen đến vật liệu dệt trong đề án SenPine." };

export default function StoryPage() {
  return <main id="main"><PageHero ribbon="story" eyebrow="01 / CÂU CHUYỆN SENPINE" title="Từ điều tự nhiên đến điều ta chạm mỗi ngày." description="Một cách hình dung mới về vật liệu dệt, bắt đầu từ lá dứa sau thu hoạch và những sợi tơ sen quý." image="/images/origins.webp" imageAlt="Ảnh concept hoa sen, lá dứa và vải dệt" />
    <section className="page-section story-opening"><PageSectionHeading index="01" eyebrow="KHỞI ĐẦU" title="Nhìn lại một chiếc lá." /><div className="editorial-prose"><p>Lá dứa thường được nhìn qua trái dứa. SenPine bắt đầu từ phần lá sau thu hoạch và đặt câu hỏi: liệu nó có thể đi xa hơn trong đời sống dưới dạng sợi dệt?</p><p>Ở một nhịp khác, tơ sen gợi lên sự kiên nhẫn và độ tinh tế. Đề án kết nối hai hướng nguyên liệu: lá dứa cho tiềm năng ứng dụng rộng, tơ sen cho những dòng giới hạn.</p><p>Đây là định hướng nghiên cứu và kinh doanh của SenPine. Nguồn cung, đặc tính sợi và quy trình sản xuất cần được kiểm chứng bằng mẫu thực tế.</p><InlineLink href="/materials">Khám phá các dòng vật liệu</InlineLink></div></section>
    <section className="story-photo"><Image src="/images/botanical.webp" alt="Ảnh minh họa sen, lá dứa và sợi thực vật" fill sizes="100vw" /><div><span>FROM NATURE</span><strong>01 — 07</strong><span>TO YOUR EVERYDAY</span></div></section>
    <section className="page-section"><PageSectionHeading index="02" eyebrow="HÀNH TRÌNH DỰ KIẾN" title="Bảy bước đến một tấm vải." description="Từ nguyên liệu đến sản phẩm, mỗi bước cần có tiêu chuẩn và bằng chứng phù hợp trước khi triển khai thương mại." /><div className="story-timeline">{journey.map((step, index) => <article key={step.label}><span>0{index + 1}</span><div><p className="eyebrow">{step.label}</p><h3>{step.title}</h3><p>{step.text}</p></div></article>)}</div></section>
    <CtaBand eyebrow="CHẶNG TIẾP THEO" title="Một câu chuyện cần được chạm vào." text="Xem ba hướng phát triển vật liệu và các thông tin hiện có trong đề án." href="/materials" action="Đến Material Lab" />
  </main>;
}
