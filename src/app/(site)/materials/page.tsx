import type { Metadata } from "next";
import { MaterialsExperience } from "@/components/materials-experience";
import "./materials.css";

export const metadata: Metadata = { title: "Vật liệu | SenPine", description: "PineFiber, SenPine Blend và SenSilk: ba hướng vật liệu trong đề án SenPine." };

export default function MaterialsPage() {
  return <MaterialsExperience />;
}
