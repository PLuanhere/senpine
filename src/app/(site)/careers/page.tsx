import type { Metadata } from "next";
import { CareersExperience } from "@/components/careers-experience";
import "./careers.css";

export const metadata: Metadata = { title: "Tuyển dụng | SenPine", description: "Khám phá các vị trí, mô tả công việc, định hướng đãi ngộ và quy trình tuyển dụng tại SenPine." };

export default function CareersPage() {
  return <CareersExperience />;
}
