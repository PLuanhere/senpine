import type { Metadata } from "next";
import { StoryExperience } from "@/components/story-experience";
import "./story.css";

export const metadata: Metadata = {
  title: "Câu chuyện | SenPine",
  description: "Theo một chiếc lá qua hành trình từ nguyên liệu, người làm nghề đến vật liệu dệt trong đề án SenPine.",
};

export default function StoryPage() {
  return <StoryExperience />;
}
