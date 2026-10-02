import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { MaterialArtwork } from "@/components/material-artwork";
import { materials } from "@/lib/content";

export function generateStaticParams() { return materials.map((item) => ({ code: item.code })); }
export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const { code } = await params;
  return { title: `Hồ sơ mẫu ${code} | SenPine`, description: "Hộ chiếu vật liệu demo SenPine, không phải hồ sơ lô sản xuất thực tế." };
}

export default async function TraceDetailPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const index = materials.findIndex((item) => item.code === code);
  if (index < 0) notFound();
  const material = materials[index];
  return <main id="main"><section className="trace-detail-head"><Link className="back-link" href="/trace"><ArrowLeft size={20} /> Tra mã khác</Link><p className="eyebrow">HỘ CHIẾU VẬT LIỆU / BẢN MINH HỌA</p><h1>{material.name}</h1><p>{material.code} · Mã demo, chưa đại diện cho lô hàng thật.</p></section><div className="trace-detail-banner"><MaterialArtwork index={index} /><span>DEMO</span></div>
    <section className="page-section material-detail-body"><div><p className="eyebrow">01 / NGUỒN GỐC DỰ KIẾN</p><h2>Một hồ sơ bắt đầu từ nguyên liệu.</h2></div><div className="editorial-prose"><p>{material.detail}</p><dl className="trace-definition"><div><dt>Nhóm nguyên liệu</dt><dd>{material.origin}</dd></div><div><dt>Quốc gia định hướng</dt><dd>Việt Nam</dd></div><div><dt>Dữ liệu vùng trồng</dt><dd>Chưa có trong bản demo</dd></div><div><dt>Kết quả kiểm nghiệm</dt><dd>Chưa có trong bản demo</dd></div></dl><Link className="text-link" href={`/materials/${material.id}`}>Đọc về vật liệu này <ArrowUpRight size={20} /></Link></div></section>
    <section className="page-section page-section-alt"><div className="page-section-heading"><p className="eyebrow">02 / QUY TRÌNH ĐỊNH HƯỚNG</p><h2>Từ sợi đến tấm vải.</h2></div><div className="fact-grid"><article><span>01</span><h3>Nguyên liệu & xử lý</h3><p>Tiếp nhận, phân loại và xử lý sợi theo quy trình cần được thử nghiệm.</p></article><article><span>02</span><h3>Kéo sợi & dệt</h3><p>Định hình sợi dệt và cấu trúc vải phù hợp với từng ứng dụng.</p></article><article><span>03</span><h3>Hoàn thiện & kiểm tra</h3><p>Đánh giá chất lượng mẫu trước khi thông tin lô có thể được công bố.</p></article></div><p className="page-note">Các bước trên mô tả kế hoạch dự kiến; chưa xác nhận cơ sở sản xuất, thời điểm hay kết quả cho mã demo này.</p></section>
  </main>;
}
