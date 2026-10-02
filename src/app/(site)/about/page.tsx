import type { Metadata } from "next";
import { AboutExperience } from "@/components/about-experience";
import "./about.css";

export const metadata: Metadata = {
  title: "Về SenPine | Từ thiên nhiên Việt đến vật liệu và thiết kế",
  description: "Khám phá SenPine: nguồn gốc thương hiệu, tầm nhìn, mô hình B2B2C, ba hướng vật liệu, sáu thiết kế concept và lộ trình phát triển đề xuất trong 42 tháng.",
};

export default function AboutPage() {
  return <AboutExperience />;
}
