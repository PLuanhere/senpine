import assert from "node:assert/strict";
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const base = process.env.SENPINE_URL || "http://localhost:3000";
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
await mkdir(".artifacts", { recursive: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
const pageErrors = [];
page.on("pageerror", (error) => pageErrors.push(error.message));

async function open(path) {
  const response = await page.goto(`${base}${path}`, { waitUntil: "networkidle" });
  assert.equal(response?.status(), 200, path);
  if (await page.locator(".botanical-intro").isVisible()) await page.keyboard.press("Escape");
  await page.locator(".botanical-intro").waitFor({ state: "detached" });
  assert.ok(await page.locator("main h1").count(), `Missing heading: ${path}`);
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Horizontal overflow: ${path}`);
}

try {
  const routes = ["/", "/story", "/materials", "/materials/pinefiber", "/materials/blend", "/materials/sensilk", "/collection", "/products/ao-so-mi-tu-nhien", "/products/vay-dang-dai", "/products/khan-choang", "/products/tui-vai", "/products/mu-bucket", "/products/vi-vai", "/trace", "/trace/SP-PF-001", "/trace/SP-SB-001", "/trace/SP-SS-001", "/business", "/business/request-sample", "/business/request-quote", "/sustainability", "/about", "/contact", "/saved", "/experience/checkout"];
  for (const path of routes) await open(path);
  await open("/");
  const typography = await page.evaluate(() => ({ heading: getComputedStyle(document.querySelector("h1")).fontFamily, body: getComputedStyle(document.body).fontFamily, label: Number.parseFloat(getComputedStyle(document.querySelector(".eyebrow")).fontSize) }));
  assert.match(typography.heading, /Be Vietnam Pro/);
  assert.match(typography.body, /Be Vietnam Pro/);
  assert.ok(typography.label >= 12);
  await page.screenshot({ path: ".artifacts/site-home-desktop.png" });

  await open("/collection");
  assert.equal(await page.locator(".collection-grid .editorial-card").count(), 6);
  await page.getByRole("button", { name: /Phụ kiện/ }).click();
  assert.equal(await page.locator(".collection-grid .editorial-card").count(), 4);
  await page.getByRole("link", { name: /Khăn choàng/ }).first().click();
  await page.waitForURL("**/products/khan-choang");
  await page.getByRole("button", { name: "Lưu thiết kế" }).click();
  await page.getByRole("button", { name: "Thêm vào giỏ trải nghiệm" }).click();
  await page.getByRole("link", { name: /Giỏ trải nghiệm/ }).click();
  await page.waitForURL("**/experience/checkout");
  assert.ok((await page.locator(".checkout-items").innerText()).includes("Khăn choàng"));
  await page.getByRole("button", { name: "Tăng số lượng Khăn choàng" }).click();
  assert.ok((await page.locator(".summary-line").innerText()).includes("820.000"));
  await page.getByLabel("Họ tên *").fill("Người dùng thử");
  await page.getByLabel("Email *").fill("test@example.com");
  await page.getByLabel("Tỉnh / thành phố *").fill("Cần Thơ");
  await page.getByRole("button", { name: "Hoàn tất trải nghiệm demo" }).click();
  assert.ok((await page.getByRole("status").innerText()).includes("Không có đơn hàng"));
  await open("/saved");
  assert.ok((await page.locator(".saved-card").innerText()).includes("Khăn choàng"));

  await open("/trace");
  await page.locator("#trace-code").fill("SP-SB-001");
  await page.getByRole("button", { name: "Truy xuất hồ sơ" }).click();
  await page.waitForURL("**/trace/SP-SB-001");
  assert.ok((await page.locator("main").innerText()).includes("SenPine Blend"));
  await open("/trace");
  await page.locator("#trace-code").fill("UNKNOWN");
  await page.getByRole("button", { name: "Truy xuất hồ sơ" }).click();
  assert.ok(await page.locator("#trace-error").isVisible());

  await open("/business/request-sample");
  await page.getByLabel("Họ và tên *").fill("Nhà thiết kế thử");
  await page.getByLabel("Email *").fill("designer@example.com");
  await page.getByLabel("Thương hiệu / tổ chức *").fill("Studio Demo");
  await page.getByLabel("Mô tả nhu cầu *").fill("Tôi đang thử nghiệm một bộ sưu tập phụ kiện từ vải thực vật.");
  await page.getByRole("button", { name: "Hoàn tất trải nghiệm demo" }).click();
  assert.ok((await page.getByRole("status").innerText()).includes("chưa được gửi hay lưu"));

  for (const width of [360, 390, 768, 1024]) {
    await page.setViewportSize({ width, height: 844 });
    for (const path of ["/", "/story", "/materials", "/collection", "/products/ao-so-mi-tu-nhien", "/trace", "/business", "/about", "/experience/checkout"]) await open(path);
    await open("/");
    await page.screenshot({ path: `.artifacts/site-home-${width}.png` });
    await open("/collection");
    await page.locator(".collection-grid").scrollIntoViewIfNeeded();
    await page.screenshot({ path: `.artifacts/site-collection-${width}.png` });
    await page.getByRole("button", { name: "Mở menu" }).click();
    await page.getByRole("navigation", { name: "Điều hướng trên điện thoại" }).getByRole("link", { name: /Vật liệu/ }).click();
    await page.waitForURL("**/materials");
  }
  assert.deepEqual(pageErrors, [], "Browser errors");
  console.log(`PASS: ${routes.length} routes, typeface, readable labels, filters, saved products, cart demo, trace lookup, B2B form, mobile navigation and widths 360/390/768/1024.`);
} finally {
  await browser.close();
}
