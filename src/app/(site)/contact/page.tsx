import { detailsImages } from "@/lib/imagery";
import type { Metadata } from "next";
import Link from "next/link";
import { BusinessForm } from "@/components/business-form";
import { PageHero } from "@/components/editorial";

export const metadata: Metadata = { title: "Liên hệ | SenPine", description: "Trang liên hệ minh họa của dự án SenPine." };

export default function ContactPage() {
  return <main id="main"><PageHero ribbon="contact" eyebrow="08 / LIÊN HỆ" title="Bắt đầu bằng một cuộc trò chuyện." description="Bạn quan tâm đến câu chuyện vật liệu, bộ sưu tập hay hướng hợp tác của SenPine? Hãy thử biểu mẫu liên hệ demo." image={detailsImages.runway.src} imageAlt={detailsImages.runway.alt} /><section className="page-section form-page"><div><p className="eyebrow">CÙNG KẾT NỐI</p><h2>Một lời nhắn có thể mở đầu điều mới.</h2><p>Đây là website minh họa của đề án. Chưa có kênh email hay địa chỉ tiếp nhận chính thức được xác nhận trong dự án.</p><div className="contact-links"><Link href="/business/request-sample">Tìm hiểu bộ mẫu vật liệu ↗</Link><Link href="/business/request-quote">Mô tả nhu cầu hợp tác ↗</Link></div></div><BusinessForm kind="contact" /></section></main>;
}
