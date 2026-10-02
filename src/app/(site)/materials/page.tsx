import type { Metadata } from "next";
import { CtaBand, MaterialCard, PageHero, PageSectionHeading } from "@/components/editorial";
import { materials } from "@/lib/content";

export const metadata: Metadata = { title: "Vật liệu | SenPine", description: "PineFiber, SenPine Blend và SenSilk: ba hướng vật liệu trong đề án SenPine." };

export default function MaterialsPage() {
  return <main id="main"><PageHero ribbon="materials" eyebrow="02 / MATERIAL LAB" title="Ba hướng vật liệu. Ba cách kể chuyện." description="Khám phá định hướng phát triển vải từ lá dứa, tơ sen và sự kết hợp của cả hai." image="/images/materials.webp" imageAlt="Ba bề mặt vải concept trên nền đá sáng" />
    <section className="page-section"><PageSectionHeading index="01" eyebrow="DÒNG VẬT LIỆU" title="Chọn bề mặt bạn muốn tìm hiểu." description="Hình ảnh, giá và mô tả dưới đây là concept theo kế hoạch đề tài, chưa phải mẫu thương mại đã kiểm nghiệm." /><div className="editorial-grid three">{materials.map((item, index) => <MaterialCard key={item.id} index={index} />)}</div></section>
    <section className="page-section page-section-alt"><PageSectionHeading index="02" eyebrow="SO SÁNH" title="Mỗi dòng, một vai trò." /><div className="compare-table" role="table" aria-label="So sánh ba dòng vật liệu"><div role="row" className="compare-table-head"><span role="columnheader">DÒNG VẢI</span><span role="columnheader">NGUỒN GỐC ĐỊNH HƯỚNG</span><span role="columnheader">ỨNG DỤNG ĐỊNH HƯỚNG</span><span role="columnheader">GIÁ KẾ HOẠCH / MÉT</span></div>{materials.map((item, index) => <div role="row" key={item.id}><strong role="cell">{item.name}</strong><span role="cell">{["Lá dứa sau thu hoạch", "Lá dứa và tơ sen", "Tơ từ cuống sen"][index]}</span><span role="cell">{["Vải ứng dụng, phụ kiện", "Thiết kế vải pha", "Dòng giới hạn"][index]}</span><span role="cell">{new Intl.NumberFormat("vi-VN").format(item.price)} ₫</span></div>)}</div><p className="page-note">Tỷ lệ 95% lá dứa và 5% tơ sen của SenPine Blend chỉ là đề xuất concept. Thông số kỹ thuật và tác động môi trường cần được kiểm nghiệm.</p></section>
    <CtaBand eyebrow="DÀNH CHO ĐỐI TÁC" title="Bắt đầu từ một mẫu vải." text="Khám phá cách bộ mẫu vật liệu dự kiến hỗ trợ nhà thiết kế và thương hiệu." href="/business/request-sample" action="Xem yêu cầu bộ mẫu" />
  </main>;
}
