import type { Metadata } from "next";
import { BusinessForm } from "@/components/business-form";
import { PageHero } from "@/components/editorial";

export const metadata: Metadata = { title: "Bộ mẫu vật liệu | SenPine", description: "Trải nghiệm biểu mẫu yêu cầu bộ mẫu vật liệu SenPine." };

export default function SamplePage() {
  return <main id="main"><PageHero eyebrow="FOR BUSINESS / MATERIAL SAMPLE" title="Một mẫu vải có thể mở đầu ý tưởng." description="Chọn dòng vật liệu và mô tả ứng dụng bạn đang hình dung. Biểu mẫu này là bản demo, chưa tiếp nhận yêu cầu mẫu thật." image="/images/materials.webp" imageAlt="Các mẫu bề mặt vải concept" /><section className="page-section form-page"><div><p className="eyebrow">01 / THÔNG TIN MẪU</p><h2>Mô tả điều bạn muốn thử.</h2><p>SenPine định hướng có bộ mẫu và thông tin vật liệu cho các cuộc trao đổi B2B. Ở giai đoạn này, biểu mẫu chỉ cho thấy cách trải nghiệm dự kiến hoạt động.</p></div><BusinessForm kind="sample" /></section></main>;
}
