"use client";

import { createContext, useCallback, useContext, useEffect, useState, useSyncExternalStore } from "react";

const reducedQuery = "(prefers-reduced-motion: reduce)";
const subscribe = (callback: () => void) => {
  const query = window.matchMedia(reducedQuery);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
};
const snapshot = () => window.matchMedia(reducedQuery).matches;
const serverSnapshot = () => false;

type MotionState = {
  enabled: boolean;
  reduced: boolean;
  intro: "pending" | "playing" | "done";
  finishIntro: () => void;
};

const MotionContext = createContext<MotionState | null>(null);

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const reduced = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const [intro, setIntro] = useState<MotionState["intro"]>("pending");

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      // Every full page load has an intro. Client navigation preserves this provider.
      // An obsolete saved pause must never silently disable the experience.
      setIntro("playing");
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const finishIntro = useCallback(() => {
    setIntro("done");
  }, []);

  return (
    <MotionContext.Provider value={{ enabled: true, reduced, intro, finishIntro }}>
      {children}
    </MotionContext.Provider>
  );
}

export function useMotion() {
  const context = useContext(MotionContext);
  if (!context) throw new Error("useMotion requires MotionProvider");
  return context;
}
