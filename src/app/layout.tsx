import type { Metadata } from "next";
import "@fontsource/be-vietnam-pro/400.css";
import "@fontsource/be-vietnam-pro/500.css";
import "@fontsource/be-vietnam-pro/600.css";
import "@fontsource/be-vietnam-pro/700.css";
import "./typography.css";
import "./globals.css";
import "./pages.css";
import "./clean-layout.css";
import "./home-motion.css";
import "./site-motion.css";
import "./page-effects.css";
import { Providers } from "@/lib/providers";

export const metadata: Metadata = {
  title: "SenPine — Đề án vật liệu dệt từ lá dứa và tơ sen",
  description: "Khám phá đề án SenPine: các hướng phát triển vật liệu dệt từ lá dứa và tơ sen, cùng bộ sưu tập thiết kế minh họa.",
  keywords: [
    "SenPine",
    "Vải sinh học",
    "Tơ sen",
    "Sợi lá dứa",
    "Thời trang bền vững",
    "PineFiber",
    "SenSilk",
    "Dệt may tuần hoàn Việt Nam",
  ],
  authors: [{ name: "Dự án SenPine" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" data-theme="light" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
