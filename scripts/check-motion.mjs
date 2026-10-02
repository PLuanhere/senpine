import assert from "node:assert/strict";
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const base = process.env.SENPINE_URL || "http://localhost:3000";
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
await mkdir(".artifacts", { recursive: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
await context.addInitScript(() => {
  localStorage.setItem("senpine-motion", "paused");
  sessionStorage.setItem("senpine-intro", "seen");
});
const page = await context.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });

async function ready() {
  if (await page.locator(".botanical-intro").isVisible()) await page.keyboard.press("Escape");
  await page.locator(".botanical-intro").waitFor({ state: "detached" });
  await page.waitForTimeout(50);
  await page.waitForFunction(() => getComputedStyle(document.querySelector("main h1")).opacity === "1");
  await page.waitForFunction(() => [...document.querySelectorAll(".motion-word > span")].every((element) => getComputedStyle(element).transform === "none"));
  await page.waitForTimeout(350);
}

try {
  await page.goto(base, { waitUntil: "domcontentloaded" });
  await page.getByRole("dialog", { name: "SenPine." }).waitFor();
  assert.equal(await page.locator(".motion-content").getAttribute("inert"), "");
  await page.waitForTimeout(1100);
  await page.screenshot({ path: ".artifacts/motion-intro.png" });
  await page.getByRole("button", { name: "Bỏ qua intro" }).click();
  await ready();
  assert.equal(await page.locator("html").getAttribute("data-motion"), "enabled", "Obsolete saved pause must not disable animation");
  assert.equal(await page.locator(".motion-controls").count(), 0, "The unwanted floating controls are removed");
  assert.equal(await page.locator(".motion-content").getAttribute("inert"), null);

  const firstScene = await page.locator(".hero-scene.is-active img").getAttribute("src");
  await page.waitForFunction((src) => document.querySelector(".hero-scene.is-active img")?.getAttribute("src") !== src, firstScene, { timeout: 8000 });
  await page.reload({ waitUntil: "networkidle" });
  await page.getByRole("dialog", { name: "SenPine." }).waitFor();
  await ready();
  await page.mouse.wheel(0, 450);
  await page.waitForFunction(() => scrollY > 100);
  assert.notEqual(await page.locator(".reading-progress > div").evaluate((element) => getComputedStyle(element).transform), "matrix(0, 0, 0, 1, 0, 0)");
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForFunction(() => scrollY < 2);

  // Client navigation must initialize new route effects without replaying the intro.
  await page.locator(".desktop-nav").getByRole("link", { name: "Câu chuyện", exact: true }).click();
  await page.waitForURL("**/story");
  await ready();
  assert.equal(await page.locator(".motion-content").getAttribute("data-scene"), "narrative");
  assert.equal(await page.locator(".botanical-intro").count(), 0);
  await page.screenshot({ path: ".artifacts/motion-story-desktop.png" });
  const lastStep = page.locator(".story-timeline article").last();
  assert.ok(Number(await lastStep.evaluate((element) => getComputedStyle(element).opacity)) < 1, "Lower story steps wait for the viewport");
  await lastStep.scrollIntoViewIfNeeded();
  await page.waitForFunction(() => getComputedStyle(document.querySelector(".story-timeline article:last-child")).opacity === "1");

  const routes = [
    ["/materials", "weave"], ["/materials/pinefiber", "weave"], ["/materials/blend", "weave"], ["/materials/sensilk", "weave"],
    ["/collection", "runway"], ["/products/ao-so-mi-tu-nhien", "atelier"], ["/products/vay-dang-dai", "atelier"],
    ["/products/khan-choang", "atelier"], ["/products/tui-vai", "atelier"], ["/products/mu-bucket", "atelier"], ["/products/vi-vai", "atelier"],
    ["/trace", "scan"], ["/trace/SP-PF-001", "scan"], ["/trace/SP-SB-001", "scan"], ["/trace/SP-SS-001", "scan"],
    ["/business", "blueprint"], ["/business/request-sample", "form"], ["/business/request-quote", "form"],
    ["/sustainability", "leaf"], ["/about", "orbit"], ["/contact", "connect"], ["/saved", "keepsake"], ["/experience/checkout", "cart"],
  ];
  for (const [route, scene] of routes) {
    const response = await page.goto(`${base}${route}`, { waitUntil: "networkidle" });
    assert.equal(response.status(), 200, route);
    await ready();
    assert.equal(await page.locator(".motion-content").getAttribute("data-scene"), scene, route);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Overflow: ${route}`);
  }

  await page.goto(`${base}/collection`, { waitUntil: "networkidle" });
  await ready();
  await page.getByRole("button", { name: /Phụ kiện/ }).click();
  await page.locator(".collection-grid").scrollIntoViewIfNeeded();
  await page.waitForFunction(() => [...document.querySelectorAll(".collection-grid .editorial-card")].every((element) => getComputedStyle(element).opacity === "1"));
  assert.equal(await page.locator(".collection-grid .editorial-card").count(), 4);
  await page.screenshot({ path: ".artifacts/motion-collection-desktop.png" });

  await page.goto(`${base}/business/request-sample`, { waitUntil: "networkidle" });
  await ready();
  await page.getByLabel("Họ và tên *").fill("Nhà thiết kế thử");
  await page.getByLabel("Email *").fill("designer@example.com");
  await page.getByLabel("Thương hiệu / tổ chức *").fill("Studio Demo");
  await page.getByLabel("Mô tả nhu cầu *").fill("Thử nghiệm chất liệu cho bộ sưu tập phụ kiện.");
  await page.getByRole("button", { name: "Hoàn tất trải nghiệm demo" }).click();
  await page.waitForFunction(() => [...document.querySelectorAll(".form-complete > *")].every((element) => getComputedStyle(element).opacity === "1"));
  assert.ok(await page.getByRole("status").isVisible());

  for (const width of [360, 390, 768, 1024]) {
    await page.setViewportSize({ width, height: 844 });
    for (const route of ["/", "/story", "/materials", "/collection", "/products/khan-choang", "/trace/SP-PF-001", "/business/request-quote", "/about"]) {
      await page.goto(`${base}${route}`, { waitUntil: "networkidle" });
      await ready();
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Overflow: ${route} at ${width}`);
    }
    if (width === 390) await page.screenshot({ path: ".artifacts/motion-about-mobile.png" });
  }

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`${base}/story`, { waitUntil: "networkidle" });
  await ready();
  assert.equal(await page.locator("html").getAttribute("data-motion"), "reduced");
  assert.equal(await page.locator(".motion-ribbon-track").evaluate((element) => getComputedStyle(element).animationName), "ribbon-flow", "Ribbon loops continuously as requested");
  assert.ok(Number(await lastStep.evaluate((element) => getComputedStyle(element).opacity)) < 1, "Reduced motion still initializes gentle section fades");
  await lastStep.scrollIntoViewIfNeeded();
  await page.waitForFunction(() => getComputedStyle(document.querySelector(".story-timeline article:last-child")).opacity === "1");
  assert.equal(await page.locator(".motion-controls").count(), 0);

  await page.goto(base, { waitUntil: "networkidle" });
  await ready();
  const reducedScene = await page.locator(".hero-scene.is-active img").getAttribute("src");
  await page.waitForFunction((src) => document.querySelector(".hero-scene.is-active img")?.getAttribute("src") !== src, reducedScene, { timeout: 8000 });
  assert.notEqual(await page.locator(".hero-scene").first().evaluate((element) => getComputedStyle(element).transitionDuration), "0s", "Device preference keeps the gentle image crossfade");

  const noStorage = await browser.newContext();
  await noStorage.addInitScript(() => { Object.defineProperty(window, "sessionStorage", { get() { throw new Error("Storage blocked"); } }); Object.defineProperty(window, "localStorage", { get() { throw new Error("Storage blocked"); } }); });
  const fallback = await noStorage.newPage();
  fallback.on("pageerror", (error) => errors.push(error.message));
  await fallback.goto(`${base}/materials`, { waitUntil: "networkidle" });
  await fallback.locator(".botanical-intro").waitFor({ state: "detached", timeout: 6000 });
  assert.ok(await fallback.locator("main h1").isVisible());
  assert.equal(await fallback.locator(".motion-content").getAttribute("inert"), null);
  await noStorage.close();

  assert.deepEqual(errors, [], "Browser runtime errors");
  console.log("PASS: floating controls removed, saved pause ignored, intro on reload, Escape, automatic hero, progress, client navigation, 25 route profiles, lower-section reveals, filter animation, form success, 360/390/768/1024px, reduced-motion fades and crossfades, and blocked storage.");
} finally {
  await browser.close();
}
