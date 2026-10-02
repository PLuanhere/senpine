import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium } from "@playwright/test";

const base = process.env.SENPINE_URL || "http://localhost:3000";
await mkdir(".artifacts", { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
const errors = [];
const submissions = [];
page.on("pageerror", (error) => errors.push(error.message));
page.on("request", (request) => { if (request.method() === "POST") submissions.push(request.url()); });

async function open(route) {
  const response = await page.goto(`${base}${route}`, { waitUntil: "domcontentloaded" });
  assert.equal(response?.status(), 200, route);
  await page.waitForFunction(() => document.querySelector(".botanical-intro, .route-arrival"));
  if (await page.locator(".botanical-intro").isVisible()) await page.keyboard.press("Escape");
  await page.locator(".botanical-intro").waitFor({ state: "detached" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1000);
}
async function fit() {
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, "Horizontal overflow");
  assert.match(await page.locator("main h1").evaluate((e) => getComputedStyle(e).fontFamily), /Be Vietnam Pro/);
}

try {
  await open("/business");
  assert.equal(new URL(page.url()).pathname, "/careers");
  const nav = page.getByRole("navigation", { name: "Điều hướng chính" });
  assert.equal(await nav.getByRole("link", { name: "Tuyển dụng", exact: true }).getAttribute("href"), "/careers");
  assert.equal(await nav.getByRole("link", { name: "Đối tác", exact: true }).count(), 0);
  assert.equal(await page.locator(".cr-job-card").count(), 7);
  const jobRoutes = await page.locator(".cr-job-card").evaluateAll((links) => links.map((link) => link.getAttribute("href")));
  await page.getByLabel("Tìm vị trí", { exact: true }).fill("thiet ke");
  assert.equal(await page.locator(".cr-job-card").count(), 2);
  await page.getByRole("button", { name: "Xóa tìm kiếm" }).click();
  await page.getByLabel("Bộ phận", { exact: true }).selectOption("research");
  assert.equal(await page.locator(".cr-job-card").count(), 1);
  await page.getByLabel("Tìm vị trí", { exact: true }).fill("unmatchedxyz");
  assert.equal(await page.locator(".cr-job-card").count(), 0);
  await page.getByRole("button", { name: "Xóa bộ lọc" }).click();
  assert.equal(await page.locator(".cr-job-card").count(), 7);
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(400);
  await page.screenshot({ path: ".artifacts/careers-desktop.png" });
  await page.locator(".cr-filters").scrollIntoViewIfNeeded();
  await page.screenshot({ path: ".artifacts/careers-positions.png" });

  for (const route of jobRoutes) {
    await open(route);
    for (const id of ["cr-duty-title", "cr-requirement-title", "cr-offer-title", "cr-documents-title", "cr-application-title"]) assert.ok(await page.locator(`#${id}`).isVisible());
    await fit();
  }
  await open(jobRoutes[0]);
  await page.getByRole("link", { name: "Ứng tuyển mô phỏng", exact: true }).click();
  await page.getByRole("button", { name: "Gửi hồ sơ mô phỏng" }).click();
  assert.equal(await page.locator(".cr-application-complete").count(), 0, "Required fields must block completion");
  await page.getByLabel("Họ và tên", { exact: false }).fill("Nguyễn Minh Anh");
  await page.getByLabel("Email", { exact: false }).fill("candidate@example.com");
  await page.getByLabel("Số điện thoại", { exact: false }).fill("0901234567");
  const cv = page.locator('input[name="cv"]');
  await cv.setInputFiles({ name: "invalid.exe", mimeType: "application/octet-stream", buffer: Buffer.from("invalid") });
  assert.match(await page.locator("#cr-file-help").innerText(), /PDF, DOC hoặc DOCX/);
  await cv.setInputFiles({ name: "large.pdf", mimeType: "application/pdf", buffer: Buffer.alloc(5 * 1024 * 1024 + 1) });
  assert.match(await page.locator("#cr-file-help").innerText(), /không vượt quá 5 MB/);
  await cv.setInputFiles({ name: "MinhAnh_CV.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF-1.7 simulated CV") });
  await page.getByRole("button", { name: "Gửi hồ sơ mô phỏng" }).click();
  await page.locator(".cr-application-complete").waitFor();
  assert.match(await page.locator(".cr-application-complete").innerText(), /MinhAnh_CV.pdf/);
  assert.match(await page.locator(".cr-application-complete").innerText(), /chưa được gửi/);
  assert.equal(await page.locator(".cr-application-complete").evaluate((e) => document.activeElement === e), true, "Confirmation must receive focus");
  assert.deepEqual(submissions, [], "Simulated applications must not transmit personal data");
  await page.screenshot({ path: ".artifacts/careers-application-complete.png" });
  await page.getByRole("button", { name: "Thử lại biểu mẫu" }).click();
  assert.equal(await page.locator('input[name="name"]').inputValue(), "");
  assert.equal(await cv.inputValue(), "");

  for (const width of [360, 390, 768, 1024]) {
    await page.setViewportSize({ width, height: 900 });
    await open("/careers");
    await fit();
    if (width === 390) {
      await page.screenshot({ path: ".artifacts/careers-mobile.png" });
      await page.locator(".cr-filters").scrollIntoViewIfNeeded();
      await page.screenshot({ path: ".artifacts/careers-positions-mobile.png" });
    }
    for (const route of jobRoutes) { await open(route); await fit(); }
    if (width === 390) {
      await page.locator(".cr-application").scrollIntoViewIfNeeded();
      await page.screenshot({ path: ".artifacts/careers-form-mobile.png" });
    }
  }
  await page.setViewportSize({ width: 390, height: 900 });
  await open("/careers");
  await page.getByRole("button", { name: "Mở menu" }).click();
  await page.getByRole("navigation", { name: "Điều hướng trên điện thoại" }).getByRole("link", { name: /Tuyển dụng/ }).click();
  assert.equal(await page.locator("#site-mobile-nav").count(), 0);
  await page.locator(".footer-theme-controls").getByRole("button", { name: "Đổi ngôn ngữ" }).click();
  assert.match(await page.locator("main h1").innerText(), /Make something/);
  await page.getByLabel("Department", { exact: true }).selectOption("marketing");
  assert.equal(await page.locator(".cr-job-card").count(), 1);
  await page.locator(".cr-job-card").click();
  await page.waitForURL("**/careers/chuyen-vien-noi-dung-marketing");
  await page.locator(".cr-detail-hero h1").waitFor();
  assert.match(await page.locator("main h1").innerText(), /Content & Marketing/);
  await fit();
  await page.locator(".footer-theme-controls").getByRole("button", { name: "Đổi giao diện sáng tối" }).click();
  await page.screenshot({ path: ".artifacts/careers-detail-dark.png" });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await open("/careers");
  await page.waitForTimeout(1000);
  assert.equal(await page.locator(".cr-hero h1").evaluate((e) => getComputedStyle(e).opacity), "1");
  const initial = await page.locator(".cr-hero-photo > img").evaluate((e) => getComputedStyle(e).transform);
  await page.evaluate(() => scrollTo({ top: 400, behavior: "instant" }));
  await page.waitForTimeout(1000);
  assert.notEqual(await page.locator(".cr-hero-photo > img").evaluate((e) => getComputedStyle(e).transform), initial);
  await page.getByLabel("Department", { exact: true }).selectOption("research");
  assert.equal(await page.locator(".cr-job-card").count(), 1);
  await page.locator(".cr-life-copy").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1100);
  assert.equal(await page.locator(".cr-life-copy").evaluate((e) => getComputedStyle(e).opacity), "1");
  await page.emulateMedia({ reducedMotion: "reduce" });
  assert.equal(await page.locator("main").getAttribute("data-effects"), "on", "Full autoplay stays on when the device requests reduced motion");
  assert.equal(await page.locator(".page-motion-ribbon-track").evaluate((e) => getComputedStyle(e).animationName), "pe-ribbon-drift");
  assert.deepEqual(errors, [], "Browser errors");
  console.log("PASS: navigation, legacy redirect, 7 job descriptions, accent-insensitive search, filters, CV validation, local-only application simulation, reset, 360/390/768/1024px, English and dark theme.");
} finally { await browser.close(); }
