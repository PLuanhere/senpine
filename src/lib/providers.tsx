"use client";

import React from "react";
import { ThemeProvider } from "./theme-context";
import { LanguageProvider } from "./language-context";
import { MotionProvider } from "./motion-context";
import { SiteMotion } from "@/components/site-motion";
import { SenPineChatbot } from "@/components/senpine-chatbot";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <MotionProvider><SiteMotion>{children}</SiteMotion><SenPineChatbot /></MotionProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
