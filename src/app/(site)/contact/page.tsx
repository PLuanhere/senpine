import type { Metadata } from "next";
import { ContactExperience } from "@/components/contact-experience";
import "./contact.css";

export const metadata: Metadata = {
  title: "Liên hệ | SenPine",
  description: "Kết nối với câu chuyện SenPine: tìm hiểu vật liệu tơ sen và sợi lá dứa, chuẩn bị brief hợp tác, khám phá bộ sưu tập và giải đáp các câu hỏi về dự án.",
};

export default function ContactPage() {
  return <ContactExperience />;
}
