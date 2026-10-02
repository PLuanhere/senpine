import type { Metadata } from "next";
import { CollectionBrowser } from "@/components/collection-browser";
import { CtaBand, PageHero, PageSectionHeading } from "@/components/editorial";

export const metadata: Metadata = { title: "Bộ sưu tập | SenPine", description: "Sáu thiết kế thời trang và phụ kiện concept của SenPine." };

export default function CollectionPage() {
  return <main id="main"><PageHero ribbon="collection" eyebrow="03 / EVERYDAY COLLECTION" title="Gần gũi trong từng ngày." description="Sáu thiết kế concept: một cách hình dung sợi thực vật trong trang phục và phụ kiện thường ngày." image="/images/fashion.webp" imageAlt="Người mẫu trong trang phục màu ivory, ảnh concept SenPine" />
    <section className="page-section"><PageSectionHeading index="01" eyebrow="BỘ SƯU TẬP" title="Chọn điều bạn muốn mặc và mang theo." description="Các sản phẩm hiện là ý tưởng minh họa. Giá từ kế hoạch đề tài; SenPine chưa mở bán." /><CollectionBrowser /></section>
    <CtaBand eyebrow="TỪ THIẾT KẾ ĐẾN VẬT LIỆU" title="Bạn đã xem bề mặt vải chưa?" text="Tìm hiểu ba dòng vật liệu đang được đề xuất cho dự án SenPine." href="/materials" action="Khám phá Material Lab" />
  </main>;
}
