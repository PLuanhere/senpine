import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "@playwright/test";

const base = process.env.SENPINE_URL || "http://localhost:3000";
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const routes = ["/", "/story", "/materials", "/materials/pinefiber", "/materials/blend", "/materials/sensilk", "/collection", "/products/ao-so-mi-tu-nhien", "/products/vay-dang-dai", "/products/khan-choang", "/products/tui-vai", "/products/mu-bucket", "/products/vi-vai", "/trace", "/trace/SP-PF-001", "/trace/SP-SB-001", "/trace/SP-SS-001", "/business", "/business/request-sample", "/business/request-quote", "/sustainability", "/about", "/contact", "/saved", "/experience/checkout"];
const screenshots = new Set(["/", "/story", "/materials", "/collection", "/business", "/about", "/trace", "/contact", "/products/ao-so-mi-tu-nhien"]);
const errors = [];
const report = [];
await mkdir(".artifacts", { recursive: true });

async function ready(page, route) {
  const response = await page.goto(`${base}${route}`, { waitUntil: "domcontentloaded" });
  assert.equal(response?.status(), 200, route);
  await page.waitForFunction(() => document.querySelector(".botanical-intro, .route-arrival"));
  if (await page.locator(".botanical-intro").isVisible()) await page.keyboard.press("Escape");
  await page.locator(".botanical-intro").waitFor({ state: "detached" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => getComputedStyle(document.querySelector("main h1")).opacity === "1");
}

async function inspect(page) {
  return page.evaluate(() => {
    const heading = getComputedStyle(document.querySelector("main h1"));
    const families = [];
    const tiny = [];
    const clipped = [];
    document.querySelectorAll("main *, .site-header *, .footer *").forEach((element) => {
      if (!(element instanceof HTMLElement) || element.closest('[aria-hidden="true"], .sr-only')) return;
      const directText = [...element.childNodes].filter((node) => node.nodeType === Node.TEXT_NODE).map((node) => node.textContent).join("").trim();
      if (!directText && !element.matches("input, select, textarea")) return;
      const box = element.getBoundingClientRect();
      if (!box.width || !box.height) return;
      const style = getComputedStyle(element);
      const entry = { selector: element.className || element.tagName, text: (directText || element.getAttribute("placeholder") || "").slice(0, 75), size: style.fontSize };
      if (!style.fontFamily.includes("Be Vietnam Pro")) families.push({ ...entry, family: style.fontFamily });
      if (parseFloat(style.fontSize) < 13) tiny.push(entry);
      if (element.clientWidth > 5 && element.scrollWidth > element.clientWidth + 2 && !["auto", "scroll"].includes(style.overflowX)) clipped.push(entry);
    });
    return { heading: { family: heading.fontFamily, size: heading.fontSize, weight: heading.fontWeight, line: heading.lineHeight, tracking: heading.letterSpacing }, families, tiny, clipped, overflow: document.documentElement.scrollWidth > innerWidth };
  });
}

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
  page.on("pageerror", (error) => errors.push(error.message));
  for (const width of [1440, 1024, 768, 390, 360]) {
    await page.setViewportSize({ width, height: width > 768 ? 1000 : 900 });
    let home;
    for (const route of routes) {
      await ready(page, route);
      const result = await inspect(page);
      report.push({ width, route, ...result });
      if (route === "/") home = result.heading;
      assert.deepEqual(result.heading, home, `Page title differs from Home: ${route} at ${width}px`);
      assert.deepEqual(result.families, [], `Font family mismatch: ${route} at ${width}px`);
      assert.deepEqual(result.tiny, [], `Unreadable small text: ${route} at ${width}px`);
      assert.equal(result.overflow, false, `Page overflow: ${route} at ${width}px`);
      if ([1440, 390].includes(width) && screenshots.has(route)) {
        const name = route === "/" ? "home" : route.replaceAll("/", "-").slice(1);
        await page.screenshot({ path: `.artifacts/type-${name}-${width}.png` });
      }
    }
    console.log(`PASS: typography on ${routes.length} routes at ${width}px.`);
  }
  await ready(page, "/story");
  for (const [label, route] of [["Vật liệu", "/materials"], ["Bộ sưu tập", "/collection"], ["Liên hệ", "/contact"]]) {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.getByRole("navigation", { name: "Điều hướng chính" }).getByRole("link", { name: label, exact: true }).click();
    await page.waitForURL(`**${route}`);
    await page.waitForFunction(() => getComputedStyle(document.querySelector("main h1")).opacity === "1");
    const result = await inspect(page);
    assert.deepEqual(result.families, [], `Font changes after client navigation: ${route}`);
    assert.equal(result.heading.size, "86.4px");
  }
  assert.deepEqual(errors, [], "Browser errors");
  console.log("PASS: Home type scale, sans serif font, readable labels, responsive text, and client navigation.");
} finally {
  await writeFile(".artifacts/typography-audit.json", JSON.stringify(report, null, 2));
  await browser.close();
}
