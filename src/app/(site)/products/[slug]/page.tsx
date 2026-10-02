import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { CtaBand, ProductCard } from "@/components/editorial";
import { ProductArtwork } from "@/components/product-artwork";
import { ProductActions } from "@/components/product-actions";
import { currency, products } from "@/lib/content";

export function generateStaticParams() { return products.map((product) => ({ slug: product.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  return { title: product ? `${product.name} | SenPine` : "Không tìm thấy thiết kế | SenPine", description: product ? `${product.name} — thiết kế concept thuộc Everyday Collection.` : undefined };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  if (!product) notFound();
  return <main id="main"><section className="detail-hero product-detail-hero"><ProductArtwork id={product.id} className="detail-artwork" /><div className="detail-copy"><Link href="/collection" className="back-link"><ArrowLeft size={20} /> Everyday Collection</Link><p className="eyebrow">{product.category.toUpperCase()} / CONCEPT 2027</p><h1>{product.name}</h1><p className="detail-english">{product.english}</p><p className="detail-lead">Một thiết kế được hình dung cho đời sống hằng ngày, lấy cảm hứng từ bề mặt vải có nguồn gốc thực vật.</p><div className="detail-facts"><div><span>GIÁ TRONG KẾ HOẠCH</span><strong>{currency(product.price)}</strong></div><div><span>MÀU MINH HỌA</span><strong>{product.color}</strong></div><div><span>TRẠNG THÁI</span><strong>Thiết kế concept · chưa mở bán</strong></div></div><ProductActions id={product.id} /><p className="page-note">Hình tham khảo được trích từ đề án SenPine. Thành phần vải, kích thước và quy cách sản xuất chưa được xác nhận. Giỏ là trải nghiệm demo, không tạo đơn hàng.</p></div></section>
    <section className="page-section product-story"><div><p className="eyebrow">01 / Ý TƯỞNG THIẾT KẾ</p><h2>Một lựa chọn có câu chuyện.</h2></div><div><p>SenPine phát triển danh mục trang phục và phụ kiện như một cách thử nghiệm ứng dụng của vật liệu. Mỗi thiết kế concept đặt ra câu hỏi về độ rũ, cảm giác chạm và khả năng sử dụng thực tế.</p><p>Thông tin về dòng vải sử dụng cho từng sản phẩm sẽ chỉ được cập nhật sau khi có mẫu thử và kiểm tra phù hợp.</p><Link className="text-link" href="/materials">Tìm hiểu định hướng vật liệu <ArrowUpRight size={20} /></Link></div></section>
    <section className="page-section page-section-alt"><div className="page-section-heading"><p className="eyebrow">02 / CÙNG BỘ SƯU TẬP</p><h2>Có thể bạn cũng thích.</h2></div><div className="editorial-grid three">{products.filter((item) => item.id !== product.id).slice(0, 3).map((item) => <ProductCard key={item.slug} id={item.id} />)}</div></section>
    <CtaBand eyebrow="TỪ TỰ NHIÊN" title="Theo dấu ý tưởng vật liệu." text="Xem ví dụ về hồ sơ truy xuất dự kiến, với dữ liệu demo được ghi rõ." href="/trace" action="Mở hộ chiếu vật liệu" />
  </main>;
}
