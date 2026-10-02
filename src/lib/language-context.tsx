"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Language = "vi" | "en";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "vi",
  setLang: () => {},
  toggleLang: () => {},
});

const LANG_KEY = "senpine:lang";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("vi");

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const savedLang = localStorage.getItem(LANG_KEY) as Language | null;
        if (savedLang === "vi" || savedLang === "en") {
          setLangState(savedLang);
          document.documentElement.setAttribute("lang", savedLang);
        }
      } catch {
        // Keep the Vietnamese default when storage is unavailable.
      }
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem(LANG_KEY, newLang);
      document.documentElement.setAttribute("lang", newLang);
    } catch {
      // Fallback
    }
  };

  const toggleLang = () => {
    setLang(lang === "vi" ? "en" : "vi");
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
