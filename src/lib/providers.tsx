"use client";

import React from "react";
import { ThemeProvider } from "./theme-context";
import { LanguageProvider } from "./language-context";
import { MotionProvider } from "./motion-context";
import { SiteMotion } from "@/components/site-motion";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <MotionProvider><SiteMotion>{children}</SiteMotion></MotionProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
