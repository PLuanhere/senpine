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

async function ready() {
  await page.locator(".botanical-intro").waitFor({ state: "detached" });
  await page.waitForTimeout(1900);
}

async function open() {
  const response = await page.goto(`${base}/about`, { waitUntil: "networkidle" });
  assert.equal(response.status(), 200);
  await ready();
}

async function noOverflow() {
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "Page must not overflow horizontally");
}

async function quickView(name) {
  const trigger = page.locator(".ab-product-grid").getByRole("button", { name: `Xem nhanh ${name}`, exact: true });
  await trigger.click();
  await page.getByRole("dialog", { name, exact: true }).waitFor();
  assert.equal(await page.evaluate(() => document.body.style.overflow), "hidden", "Dialog locks background scrolling");
  assert.ok(await page.locator(".ab-product-dialog").evaluate((element) => element.matches(":modal")), "Native dialog traps focus");
  await page.getByRole("button", { name: "Phóng lớn thiết kế" }).click();
  assert.equal(await page.getByRole("slider", { name: "Phóng đại" }).inputValue(), "1.25");
  await page.getByRole("tab", { name: "Ảnh tham khảo", exact: true }).click();
  assert.equal(await page.getByRole("slider", { name: "Phóng đại" }).inputValue(), "1");
  assert.equal(await page.locator(".ab-dialog-art img").count(), 1);
  await page.keyboard.press("Escape");
  await page.locator(".ab-product-dialog").waitFor({ state: "hidden" });
  assert.ok(await trigger.evaluate((element) => document.activeElement === element), "Escape returns focus to the opener");
  assert.notEqual(await page.evaluate(() => document.body.style.overflow), "hidden", "Closing restores background scrolling");
}

try {
  await open();
  await noOverflow();
  await page.screenshot({ path: ".artifacts/about-desktop.png" });
  const frame = page.locator(".ab-hero-frame-0");
  const firstTransform = await frame.evaluate((element) => getComputedStyle(element).transform);
  await page.evaluate(() => scrollTo({ top: 400, behavior: "instant" }));
  await page.waitForTimeout(1200);
  assert.notEqual(await frame.evaluate((element) => getComputedStyle(element).transform), firstTransform, "Hero frames move with scrolling");
  await page.getByRole("tab", { name: "B2C / Trải nghiệm thiết kế" }).click();
  assert.match(await page.locator(".ab-business-detail").innerText(), /Để chất liệu bước vào đời sống/);
  await page.getByRole("tab", { name: "B2C / Trải nghiệm thiết kế" }).press("Home");
  assert.match(await page.locator(".ab-business-detail").innerText(), /Cùng phát triển/);
  await page.getByRole("tab", { name: "SenPine Blend", exact: true }).click();
  assert.match(await page.locator(".ab-material-panel").innerText(), /95% lá dứa/);
  await page.getByRole("tab", { name: "SenPine Blend", exact: true }).press("ArrowRight");
  assert.equal(await page.getByRole("tab", { name: "SenSilk", exact: true }).getAttribute("aria-selected"), "true");
  assert.equal(await page.getByRole("link", { name: "Mở hồ sơ SenSilk", exact: true }).getAttribute("href"), "/materials/sensilk");

  const names = ["Áo sơ mi tự nhiên", "Váy dáng dài", "Khăn choàng", "Túi vải", "Mũ bucket", "Ví vải"];
  for (const name of names) await quickView(name);
  const card = page.locator(".ab-product-visual").first();
  await card.scrollIntoViewIfNeeded();
  const bounds = await card.boundingBox();
  await page.mouse.move(bounds.x + bounds.width * .8, bounds.y + bounds.height * .3);
  assert.notEqual(await card.evaluate((element) => element.style.getPropertyValue("--ab-ry")), "0deg", "Frames respond to the mouse");
  await page.screenshot({ path: ".artifacts/about-showroom.png" });
  await page.locator(".ab-product-grid").getByRole("button", { name: "Xem nhanh Áo sơ mi tự nhiên", exact: true }).click();
  const modal = page.getByRole("dialog", { name: "Áo sơ mi tự nhiên", exact: true });
  await modal.getByRole("button", { name: "Lưu thiết kế", exact: true }).click();
  assert.equal(await modal.getByRole("button", { name: "Đã lưu thiết kế", exact: true }).getAttribute("aria-pressed"), "true");
  await page.screenshot({ path: ".artifacts/about-quick-view.png" });
  await modal.getByRole("link", { name: "Mở hồ sơ sản phẩm" }).click();
  await page.waitForURL("**/products/ao-so-mi-tu-nhien");
  assert.notEqual(await page.evaluate(() => document.body.style.overflow), "hidden");
  await page.goto(`${base}/saved`, { waitUntil: "networkidle" });
  await ready();
  assert.match(await page.locator("main").innerText(), /Áo sơ mi tự nhiên/);
  await page.getByRole("navigation", { name: "Điều hướng chính" }).getByRole("link", { name: "Về SenPine", exact: true }).click();
  await page.waitForURL("**/about");
  await page.waitForTimeout(1500);
  assert.equal(await page.locator(".ab-product-grid").getByRole("button", { name: "Bỏ lưu Áo sơ mi tự nhiên", exact: true }).getAttribute("aria-pressed"), "true");

  for (const title of ["Từ vùng nguyên liệu", "Tách xơ, phát triển sợi", "Dệt, hoàn thiện, kiểm tra", "Thiết kế, trải nghiệm, theo dấu"]) {
    const button = page.locator(".ab-process-steps").getByRole("button", { name: new RegExp(title) });
    await button.click();
    assert.equal(await button.getAttribute("aria-expanded"), "true");
    assert.equal(await page.locator('.ab-process-steps [aria-expanded="true"]').count(), 1);
  }
  await page.getByRole("tab", { name: "Chặng 6 / 31–42", exact: true }).click();
  assert.match(await page.locator(".ab-future-panel").innerText(), /Mở cơ hội quốc tế/);
  await page.getByRole("tab", { name: "Chặng 6 / 31–42", exact: true }).press("Home");
  assert.match(await page.locator(".ab-future-panel").innerText(), /Chuẩn bị đầu tư/);

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForTimeout(300);
  assert.equal(await page.locator(".ab-hero-background").evaluate((element) => getComputedStyle(element).transform), "none");
  assert.equal(await page.locator(".ab-hero-circle").evaluate((element) => getComputedStyle(element).animationName), "none");
  for (const width of [360, 390, 768, 1024]) {
    await page.setViewportSize({ width, height: 844 });
    await open();
    await noOverflow();
    if (width === 390) await page.screenshot({ path: ".artifacts/about-mobile.png" });
    await quickView("Khăn choàng");
    await page.getByRole("tab", { name: "Chặng 6 / 31–42", exact: true }).click();
    await noOverflow();
  }
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 390, height: 844 });
  await open();
  await quickView("Túi vải");
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await open();
  await page.locator(".footer-theme-controls").getByRole("button", { name: "Đổi giao diện sáng tối" }).click();
  await page.waitForTimeout(400);
  await page.evaluate(() => scrollTo({ top: 1100, behavior: "instant" }));
  await page.screenshot({ path: ".artifacts/about-dark.png" });
  await page.locator(".footer-theme-controls").getByRole("button", { name: "Đổi ngôn ngữ" }).click();
  assert.match(await page.locator("main h1").innerText(), /Vietnamese nature/);
  await page.getByRole("tab", { name: "Stage 6 / 31–42", exact: true }).click();
  assert.match(await page.locator(".ab-future-panel").innerText(), /Explore beyond Vietnam/);
  await page.locator(".ab-product-grid").getByRole("button", { name: "Quick view The Daily Tote", exact: true }).click();
  await page.getByRole("dialog", { name: "The Daily Tote", exact: true }).waitFor();
  await page.getByRole("button", { name: "Close quick view" }).click();
  assert.deepEqual(errors, [], "Browser errors");
  console.log("PASS: six product dialogs, image views, zoom, saved designs, focus and scroll restoration, pointer tilt, scroll motion, business/material/roadmap tabs, process, mobile, reduced motion, dark theme and English.");
} finally {
  await browser.close();
}
