import { detailsImages } from "@/lib/imagery";
import type { Metadata } from "next";
import Image from "next/image";
import { CtaBand, PageHero, PageSectionHeading } from "@/components/editorial";

export const metadata: Metadata = { title: "Định hướng bền vững | SenPine", description: "Những câu hỏi và cam kết cần kiểm chứng trong quá trình phát triển vật liệu SenPine." };

export default function SustainabilityPage() {
  return <main id="main"><PageHero ribbon="sustainability" eyebrow="06 / RESPONSIBLE THINKING" title="Làm tốt hơn bắt đầu bằng đo lường." description="SenPine hướng đến sử dụng nguyên liệu thực vật, nhưng mọi lợi ích môi trường cần dữ liệu, kiểm nghiệm và phạm vi đánh giá rõ ràng." image={detailsImages.lotusSorting.src} imageAlt={detailsImages.lotusSorting.alt} />
    <section className="page-section"><PageSectionHeading index="01" eyebrow="ĐỊNH HƯỚNG" title="Ba câu hỏi theo suốt hành trình." /><div className="fact-grid"><article><span>01</span><h3>Nguồn nguyên liệu ở đâu?</h3><p>SenPine đề xuất tận dụng lá dứa sau thu hoạch và tơ sen tại Việt Nam. Vùng nguyên liệu, lượng thu gom và cách vận chuyển sẽ cần được xác nhận.</p></article><article><span>02</span><h3>Quy trình tác động thế nào?</h3><p>Nước, năng lượng, hóa chất và chất thải trong từng công đoạn cần được ghi nhận trước khi công bố chỉ số môi trường.</p></article><article><span>03</span><h3>Vải dùng được bao lâu?</h3><p>Độ bền, chăm sóc và vòng đời sử dụng sẽ phụ thuộc vào công thức và thử nghiệm của từng loại vải.</p></article></div></section>
    <section className="page-section page-section-alt sustainability-split"><div><PageSectionHeading index="02" eyebrow="MINH BẠCH" title="Điều đã biết và điều còn cần chứng minh." /><p>Đề án cho biết nguồn nguyên liệu định hướng và sơ đồ công đoạn dự kiến. SenPine chưa có dữ liệu thực tế để xác nhận mức giảm phát thải, mức tiết kiệm nước, khả năng phân hủy hay chứng nhận môi trường của các dòng vải.</p><p>Những thông tin này chỉ nên xuất hiện cùng phương pháp đo, phạm vi đánh giá và kết quả kiểm nghiệm phù hợp.</p></div><div className="sustainability-image"><Image src={detailsImages.pinefiber.src} alt={detailsImages.pinefiber.alt} fill sizes="(max-width: 700px) 100vw, 45vw" /></div></section>
    <CtaBand eyebrow="HÀNH TRÌNH VẬT LIỆU" title="Tìm hiểu từng bước trước khi kết luận." text="Đọc câu chuyện từ nguyên liệu đến ứng dụng được SenPine đề xuất." href="/story" action="Đọc câu chuyện" />
  </main>;
}
