import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CtaBand, PageHero, PageSectionHeading } from "@/components/editorial";

export const metadata: Metadata = { title: "Dành cho đối tác | SenPine", description: "Khám phá định hướng hợp tác vật liệu thực vật B2B của SenPine." };

export default function BusinessPage() {
  return <main id="main"><PageHero ribbon="business" eyebrow="05 / FOR BUSINESS" title="Cùng tìm một ứng dụng mới cho vật liệu." description="SenPine định hướng làm việc với nhà thiết kế, thương hiệu và đối tác sản xuất qua mẫu vật liệu và trao đổi yêu cầu ứng dụng." image="/images/materials.webp" imageAlt="Ba chất liệu vải concept" />
    <section className="page-section"><PageSectionHeading index="01" eyebrow="BẮT ĐẦU HỢP TÁC" title="Chọn điểm khởi đầu." /><div className="business-choice"><Link href="/business/request-sample"><span>01 / MATERIAL SAMPLE</span><h3>Khám phá bộ mẫu.</h3><p>Một luồng yêu cầu mẫu minh họa giúp bạn chọn dòng vật liệu và mô tả ứng dụng.</p><ArrowUpRight size={27} /></Link><Link href="/business/request-quote"><span>02 / PROJECT BRIEF</span><h3>Trao đổi ý tưởng.</h3><p>Gửi bản mô tả dự án demo, khối lượng dự kiến và nhu cầu hợp tác của bạn.</p><ArrowUpRight size={27} /></Link></div></section>
    <section className="page-section page-section-alt"><PageSectionHeading index="02" eyebrow="QUY TRÌNH DỰ KIẾN" title="Từ ý tưởng đến mẫu phù hợp." /><div className="fact-grid"><article><span>01</span><h3>Hiểu nhu cầu</h3><p>Chất liệu, ứng dụng, sản lượng và thời gian là những thông tin đầu tiên cần trao đổi.</p></article><article><span>02</span><h3>Thử mẫu</h3><p>Bộ mẫu và Material Fact Sheet được đề xuất để đánh giá cảm giác chạm và thông số sau kiểm nghiệm.</p></article><article><span>03</span><h3>Phát triển ứng dụng</h3><p>Điều chỉnh quy cách, kiểm tra chất lượng và xác nhận phương án cung ứng trước thương mại hóa.</p></article></div><p className="page-note">Đây là quy trình được đề xuất trong đề án. Bộ mẫu, tài liệu thông số và dịch vụ thương mại chưa được công bố.</p></section>
    <CtaBand eyebrow="MATERIAL LAB" title="Bắt đầu bằng việc hiểu chất liệu." text="Xem ba dòng vật liệu trong kế hoạch SenPine." href="/materials" action="Xem các vật liệu" />
  </main>;
}
