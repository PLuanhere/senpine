"use client";

import { useSyncExternalStore } from "react";

const eventName = "senpine:store";
const savedKey = "senpine:saved";
const cartKey = "senpine:cart";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(eventName, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(eventName, callback);
  };
}

function read(key: string, fallback: string) {
  try { return window.localStorage.getItem(key) ?? fallback; }
  catch { return fallback; }
}

function write(key: string, value: unknown) {
  try { window.localStorage.setItem(key, JSON.stringify(value)); }
  catch { /* Browser storage may be disabled; keep this session responsive. */ }
  window.dispatchEvent(new Event(eventName));
}

function parseSaved(value: string): number[] {
  try {
    const data: unknown = JSON.parse(value);
    return Array.isArray(data) ? data.filter((id): id is number => Number.isInteger(id) && id >= 0 && id < 6) : [];
  } catch { return []; }
}

function parseCart(value: string): Record<number, number> {
  try {
    const data: unknown = JSON.parse(value);
    if (!data || typeof data !== "object" || Array.isArray(data)) return {};
    return Object.fromEntries(Object.entries(data).filter(([id, quantity]) => Number.isInteger(Number(id)) && Number(id) >= 0 && Number(id) < 6 && typeof quantity === "number" && Number.isInteger(quantity) && quantity > 0 && quantity <= 99).map(([id, quantity]) => [Number(id), Number(quantity)]));
  } catch { return {}; }
}

export function useSaved() {
  const raw = useSyncExternalStore(subscribe, () => read(savedKey, "[]"), () => "[]");
  const saved = parseSaved(raw);
  return {
    saved,
    toggle: (id: number) => write(savedKey, saved.includes(id) ? saved.filter((item) => item !== id) : [...saved, id]),
    clear: () => write(savedKey, []),
  };
}

export function useCart() {
  const raw = useSyncExternalStore(subscribe, () => read(cartKey, "{}"), () => "{}");
  const cart = parseCart(raw);
  return {
    cart,
    add: (id: number) => write(cartKey, { ...cart, [id]: Math.min(99, (cart[id] ?? 0) + 1) }),
    update: (id: number, quantity: number) => {
      const next = { ...cart };
      if (quantity <= 0) delete next[id]; else next[id] = Math.min(99, Math.floor(quantity));
      write(cartKey, next);
    },
    clear: () => write(cartKey, {}),
  };
}
