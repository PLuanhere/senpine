import type { Metadata } from "next";
import { CollectionBrowser } from "@/components/collection-browser";
import "./collection.css";

export const metadata: Metadata = { title: "Bộ sưu tập | SenPine", description: "Khám phá sáu thiết kế concept thời trang và phụ kiện từ sợi thực vật trong bộ sưu tập Everyday của SenPine." };

export default function CollectionPage() {
  return <main id="main" className="collection-page"><CollectionBrowser /></main>;
}
