import assert from "node:assert/strict";
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const base = process.env.SENPINE_URL || "http://localhost:3000";
await mkdir(".artifacts", { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });

async function open() {
  const response = await page.goto(`${base}/materials`, { waitUntil: "networkidle" });
  assert.equal(response.status(), 200);
  await page.locator(".botanical-intro").waitFor({ state: "detached" });
  await page.waitForTimeout(1900);
}

async function noOverflow() {
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "Page overflows horizontally");
}

try {
  await open();
  await noOverflow();
  await page.screenshot({ path: ".artifacts/materials-desktop.png" });
  const start = await page.locator(".ml-swatch-0").evaluate((element) => getComputedStyle(element).transform);
  await page.evaluate(() => scrollTo({ top: 430, behavior: "instant" }));
  await page.waitForTimeout(1200);
  assert.notEqual(await page.locator(".ml-swatch-0").evaluate((element) => getComputedStyle(element).transform), start, "Swatches must move with scrolling");
  await page.locator(".ml-workbench").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
  await page.getByRole("button", { name: "Phóng lớn vật liệu" }).click();
  assert.equal(await page.getByRole("slider").inputValue(), "1.25");
  await page.waitForTimeout(600);
  assert.match(await page.locator(".ml-inspection-layer.is-selected .ml-inspection-zoom").getAttribute("style"), /scale\(1\.25\)/);
  await page.getByRole("tab", { name: /SenPine Blend/ }).click();
  assert.equal(await page.getByRole("slider").inputValue(), "1", "Switching material resets magnification");
  assert.match(await page.getByRole("tabpanel").innerText(), /Hai nguồn sợi/);
  assert.match(await page.locator(".ml-inspection-layer.is-selected img").getAttribute("src"), /blend-fibers/);
  await page.getByRole("tab", { name: /SenPine Blend/ }).press("ArrowRight");
  assert.equal(await page.getByRole("tab", { name: /SenSilk/ }).getAttribute("aria-selected"), "true");
  assert.match(await page.getByRole("tabpanel").innerText(), /Tinh tế/);
  await page.getByRole("tab", { name: /SenSilk/ }).press("Home");
  assert.equal(await page.getByRole("tab", { name: /PineFiber/, exact: false }).first().getAttribute("aria-selected"), "true");
  const slider = page.getByRole("slider");
  await slider.focus();
  await slider.press("End");
  assert.equal(await slider.inputValue(), "2.5");
  assert.ok(await page.getByRole("button", { name: "Phóng lớn vật liệu" }).isDisabled());
  await slider.press("Home");
  assert.ok(await page.getByRole("button", { name: "Thu nhỏ vật liệu" }).isDisabled());
  await page.screenshot({ path: ".artifacts/materials-explorer.png" });

  for (const id of ["pinefiber", "blend", "sensilk"]) {
    await page.locator(`#material-${id}`).scrollIntoViewIfNeeded();
    await page.waitForTimeout(1400);
    assert.equal(await page.locator(`#material-${id} .ml-material-copy`).evaluate((element) => getComputedStyle(element).opacity), "1");
  }
  await page.locator("#material-pinefiber").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
  await page.screenshot({ path: ".artifacts/materials-pinefiber.png" });
  for (const selector of [".ml-process", ".ml-compare", ".ml-sample-cta"]) {
    await page.locator(selector).scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);
  }
  await page.screenshot({ path: ".artifacts/materials-full.png", fullPage: true });
  await page.locator('.ml-sample-cta a[href="/business/request-sample"]').click();
  await page.waitForURL("**/business/request-sample");
  await page.getByRole("navigation", { name: "Điều hướng chính" }).getByRole("link", { name: "Vật liệu", exact: true }).click();
  await page.waitForURL("**/materials");
  await page.locator(".ml-workbench").scrollIntoViewIfNeeded();
  await page.getByRole("tab", { name: /SenSilk/ }).click();
  assert.match(await page.getByRole("tabpanel").innerText(), /Tinh tế/);

  // Preference changes must revert scroll transforms without hiding content.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForTimeout(300);
  assert.equal(await page.locator(".ml-material-photo img").first().evaluate((element) => getComputedStyle(element).transform), "none");
  assert.equal(await page.locator(".ml-inspection-layer").first().evaluate((element) => getComputedStyle(element).transitionDuration), "0s");

  for (const width of [360, 390, 768, 1024]) {
    await page.setViewportSize({ width, height: 844 });
    await open();
    await noOverflow();
    if (width === 390) await page.screenshot({ path: ".artifacts/materials-mobile.png" });
    await page.locator(".ml-workbench").scrollIntoViewIfNeeded();
    await page.getByRole("tab", { name: /SenPine Blend/ }).click();
    await page.getByRole("button", { name: "Phóng lớn vật liệu" }).click();
    assert.equal(await page.getByRole("slider").inputValue(), "1.25");
    await noOverflow();
    if (width === 390) await page.screenshot({ path: ".artifacts/materials-mobile-explorer.png" });
    await page.locator("#material-compare").scrollIntoViewIfNeeded();
    if (width < 768) assert.ok(await page.locator(".ml-comparison-scroll").evaluate((element) => element.scrollWidth > element.clientWidth), "Comparison scrolls within its own region");
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.locator(".footer-theme-controls").getByRole("button", { name: "Đổi giao diện sáng tối" }).click();
  await page.waitForTimeout(400);
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  await page.screenshot({ path: ".artifacts/materials-dark.png" });
  await page.locator(".footer-theme-controls").getByRole("button", { name: "Đổi ngôn ngữ" }).click();
  assert.match(await page.locator("h1").innerText(), /Natural/);
  await page.locator(".ml-workbench").scrollIntoViewIfNeeded();
  await page.getByRole("tab", { name: /SenSilk/ }).click();
  assert.match(await page.getByRole("tabpanel").innerText(), /Delicate/);
  assert.equal(await page.getByRole("link", { name: "Open material profile" }).getAttribute("href"), "/materials/sensilk");
  assert.deepEqual(errors, [], "Browser errors");
  console.log("PASS: scroll motion, switching samples, keyboard tabs, zoom limits, route return, reduced motion, 360/390/768/1024px, dark theme and English.");
} finally {
  await browser.close();
}
