import type { Metadata } from "next";
import { PageHero } from "@/components/editorial";
import { SavedView } from "@/components/saved-view";

export const metadata: Metadata = { title: "Thiết kế đã lưu | SenPine", description: "Danh sách thiết kế concept SenPine mà bạn yêu thích." };

export default function SavedPage() {
  return <main id="main"><PageHero eyebrow="YOUR EDIT / ĐÃ LƯU" title="Những điều bạn muốn giữ lại." description="Các thiết kế bạn chọn được lưu trên trình duyệt này để tiếp tục khám phá." image="/images/generated/saved-keepsakes-hero.webp" imageAlt="Khăn choàng và vải mộc xếp trên kệ gỗ cạnh bình lá sen, trong ánh nắng dịu." imageLayout="background" /><SavedView /></main>;
}
