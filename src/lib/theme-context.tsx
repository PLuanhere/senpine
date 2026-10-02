"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  setTheme: () => {},
  toggleTheme: () => {},
});

const THEME_KEY = "senpine:theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const savedTheme = localStorage.getItem(THEME_KEY) as Theme | null;
        if (savedTheme === "light" || savedTheme === "dark") {
          setThemeState(savedTheme);
          document.documentElement.setAttribute("data-theme", savedTheme);
        } else {
          document.documentElement.setAttribute("data-theme", "light");
        }
      } catch {
        document.documentElement.setAttribute("data-theme", "light");
      }
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(THEME_KEY, newTheme);
      document.documentElement.setAttribute("data-theme", newTheme);
    } catch {
      // Fallback
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
