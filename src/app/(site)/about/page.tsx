import type { Metadata } from "next";
import { CtaBand, PageHero, PageSectionHeading } from "@/components/editorial";

export const metadata: Metadata = { title: "Về SenPine", description: "Giới thiệu đề án khởi nghiệp SenPine về vật liệu dệt từ lá dứa và tơ sen." };

export default function AboutPage() {
  return <main id="main"><PageHero ribbon="about" eyebrow="07 / VỀ SENPINE" title="Một đề án bắt đầu từ hai nguồn sợi Việt." description="SenPine được hình dung như một doanh nghiệp B2B2C phát triển vật liệu dệt từ lá dứa và tơ sen." image="/images/botanical.webp" imageAlt="Hình ảnh đại diện concept SenPine" dark />
    <section className="page-section about-statement"><PageSectionHeading index="01" eyebrow="ĐỊNH HƯỚNG" title="Để vật liệu có một đời sống mới." /><div><p>Trong đề án, lá dứa là nguồn nguyên liệu chính, hướng đến khả năng sản xuất vải ứng dụng. Tơ sen là nguyên liệu khan hiếm, phù hợp với những dòng giới hạn. Kênh B2B tập trung vào vật liệu; bộ sưu tập B2C giúp khám phá trải nghiệm của người sử dụng.</p><p>SenPine hiện ở giai đoạn lập kế hoạch. Những mốc thành lập, đầu tư cơ sở và mở rộng thị trường trong báo cáo là mục tiêu dự kiến, chưa phải kết quả vận hành.</p></div></section>
    <section className="page-section page-section-alt"><PageSectionHeading index="02" eyebrow="LỘ TRÌNH ĐỀ XUẤT" title="Từng bước để biến ý tưởng thành mẫu thử." /><div className="about-timeline"><article><span>01—06</span><h3>Chuẩn bị</h3><p>Hoàn thiện kế hoạch, thiết kế sản phẩm và vùng nguyên liệu.</p></article><article><span>07—14</span><h3>Thử nghiệm</h3><p>Định hướng cơ sở sản xuất, thiết bị và kiểm tra vật liệu.</p></article><article><span>15—24</span><h3>Ra thị trường</h3><p>Trải nghiệm thương mại dự kiến và ổn định quy trình.</p></article><article><span>25—42</span><h3>Mở rộng</h3><p>Mục tiêu cân bằng tài chính và tìm cơ hội quốc tế.</p></article></div><p className="page-note">Các con số là số tháng theo kế hoạch đề tài, không phải tiến độ thực hiện đã xác nhận.</p></section>
    <CtaBand eyebrow="KẾT NỐI" title="Cùng trao đổi về hướng đi này." text="Khám phá kênh hợp tác vật liệu hoặc gửi lời nhắn trong trải nghiệm demo." href="/contact" action="Đến trang liên hệ" />
  </main>;
}
