import type { Metadata } from "next";
import { PartnerExperience } from "@/components/partner-experience";
import "./business.css";

export const metadata: Metadata = { title: "Dành cho đối tác | SenPine", description: "Khám phá danh mục vật liệu từ lá dứa và tơ sen, định hướng phát triển ứng dụng và lộ trình hợp tác B2B cùng SenPine." };

export default function BusinessPage() {
  return <PartnerExperience />;
}
