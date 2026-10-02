import type { Metadata } from "next";
import { CheckoutView } from "@/components/checkout-view";
import { PageHero } from "@/components/editorial";

export const metadata: Metadata = { title: "Giỏ trải nghiệm | SenPine", description: "Luồng xem giỏ và hoàn tất demo, không tạo đơn hàng hay thanh toán." };

export default function CheckoutPage() {
  return <main id="main"><PageHero eyebrow="TRẢI NGHIỆM / GIỎ DEMO" title="Những thiết kế bạn chọn." description="Xem lại ý tưởng yêu thích và thử luồng điền thông tin minh họa. Đây không phải đơn hàng thương mại." image="/images/generated/checkout-atelier-hero.webp" imageAlt="Túi vải, khăn họa tiết lá và cuộn chỉ tự nhiên trên bàn gỗ, cạnh lá sen và cây dứa." imageLayout="background" /><CheckoutView /></main>;
}
