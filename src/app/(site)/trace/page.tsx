import type { Metadata } from "next";
import { CtaBand, PageHero, PageSectionHeading } from "@/components/editorial";
import { TraceLookup } from "@/components/trace-lookup";

export const metadata: Metadata = { title: "Truy xuất vật liệu | SenPine", description: "Trải nghiệm hộ chiếu vật liệu minh họa của SenPine." };

export default function TracePage() {
  return <main id="main"><PageHero ribbon="trace" eyebrow="04 / MATERIAL PASSPORT" title="Một câu chuyện có thể theo dấu." description="Ý tưởng hộ chiếu vật liệu giúp người xem hiểu nguồn nguyên liệu và các bước tạo vải. Ba mã dưới đây chỉ là hồ sơ demo." image="/images/botanical.webp" imageAlt="Nguyên liệu sen, lá dứa và vải concept" dark />
    <section className="page-section trace-page-main"><PageSectionHeading index="01" eyebrow="TÌM HỒ SƠ" title="Mở một hộ chiếu mẫu." description="Nhập mã hoặc chọn một trong ba hồ sơ minh họa. Chưa có dữ liệu của lô sản xuất thực tế." /><TraceLookup /></section>
    <section className="page-section page-section-alt"><PageSectionHeading index="02" eyebrow="Ý TƯỞNG TRUY XUẤT" title="Một hồ sơ sẽ kể điều gì?" /><div className="fact-grid"><article><span>01</span><h3>Nguồn nguyên liệu</h3><p>Vùng nguyên liệu, loại nguyên liệu và thời điểm thu gom khi có dữ liệu thật.</p></article><article><span>02</span><h3>Hành trình xử lý</h3><p>Những bước quan trọng từ xử lý sợi đến dệt và hoàn thiện.</p></article><article><span>03</span><h3>Kết quả kiểm tra</h3><p>Thông tin kiểm nghiệm sẽ được bổ sung khi có thử mẫu và tiêu chuẩn phù hợp.</p></article></div></section>
    <CtaBand eyebrow="MATERIAL LAB" title="Từ mã mẫu đến bề mặt vải." text="Ba dòng vật liệu dự kiến là điểm khởi đầu của trải nghiệm truy xuất." href="/materials" action="Xem vật liệu" />
  </main>;
}
