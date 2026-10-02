import { detailsImages } from "@/lib/imagery";
import type { Metadata } from "next";
import { BusinessForm } from "@/components/business-form";
import { PageHero } from "@/components/editorial";

export const metadata: Metadata = { title: "Đề xuất hợp tác | SenPine", description: "Trải nghiệm biểu mẫu đề xuất hợp tác với SenPine." };

export default function QuotePage() {
  return <main id="main"><PageHero eyebrow="FOR BUSINESS / PROJECT BRIEF" title="Cùng phác thảo một chất liệu mới." description="Mô tả ý tưởng, ứng dụng và phạm vi dự kiến để xem luồng yêu cầu hợp tác trong bản demo SenPine." image={detailsImages.blend.src} imageAlt={detailsImages.blend.alt} /><section className="page-section form-page"><div><p className="eyebrow">01 / Ý TƯỞNG HỢP TÁC</p><h2>Chia sẻ điều bạn đang tìm kiếm.</h2><p>Thông tin trong biểu mẫu giúp mô phỏng bước tiếp nhận nhu cầu. Chưa có phản hồi hay báo giá thương mại qua website này.</p></div><BusinessForm kind="quote" /></section></main>;
}
