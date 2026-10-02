import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { CtaBand, MaterialCard } from "@/components/editorial";
import { MaterialArtwork } from "@/components/material-artwork";
import { currency, materials } from "@/lib/content";

export function generateStaticParams() { return materials.map((material) => ({ slug: material.id })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const material = materials.find((item) => item.id === slug);
  return { title: material ? `${material.name} | SenPine` : "Không tìm thấy vật liệu | SenPine", description: material?.description };
}

export default async function MaterialDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const index = materials.findIndex((item) => item.id === slug);
  if (index < 0) notFound();
  const material = materials[index];
  return <main id="main"><section className="detail-hero"><div className="detail-copy"><Link className="back-link" href="/materials"><ArrowLeft size={20} /> Tất cả vật liệu</Link><p className="eyebrow">MATERIAL LAB / {material.origin}</p><h1>{material.name}</h1><p className="detail-lead">{material.description}</p><div className="detail-facts"><div><span>GIÁ KẾ HOẠCH / MÉT</span><strong>{currency(material.price)}</strong></div><div><span>MÃ HỒ SƠ MINH HỌA</span><strong>{material.code}</strong></div></div><Link className="button button-dark" href="/business/request-sample">Tìm hiểu bộ mẫu <ArrowUpRight size={20} /></Link></div><MaterialArtwork index={index} className="detail-artwork" /></section>
    <section className="page-section material-detail-body"><div><p className="eyebrow">01 / BẢN CHẤT VẬT LIỆU</p><h2>Từ nguồn nguyên liệu đến khả năng ứng dụng.</h2></div><div className="editorial-prose"><p>{material.detail}</p><p>SenPine định hướng phát triển quy trình từ tiếp nhận nguyên liệu, tách và xử lý sợi đến kéo sợi, dệt, hoàn thiện và kiểm tra chất lượng. Quy cách của từng dòng sẽ cần được quyết định sau giai đoạn thử mẫu.</p><p className="page-note">Ảnh AI chỉ minh họa cảm giác bề mặt. Chưa có thông số, chứng nhận hoặc kết quả kiểm nghiệm để xác nhận tính năng sản phẩm.</p><Link className="text-link" href={`/trace/${material.code}`}>Xem hồ sơ truy xuất demo <ArrowUpRight size={20} /></Link></div></section>
    <section className="page-section page-section-alt"><div className="page-section-heading"><p className="eyebrow">02 / CÁC HƯỚNG KHÁC</p><h2>Còn hai câu chuyện vật liệu.</h2></div><div className="editorial-grid two">{materials.map((item, otherIndex) => otherIndex !== index && <MaterialCard key={item.id} index={otherIndex} />)}</div></section>
    <CtaBand eyebrow="CÙNG PHÁT TRIỂN" title="Vật liệu cần một ứng dụng phù hợp." text="Mô tả dự án của bạn trong biểu mẫu demo để xem luồng yêu cầu hợp tác." href="/business/request-quote" action="Khám phá hợp tác" />
  </main>;
}
