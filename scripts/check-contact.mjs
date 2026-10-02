import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium } from "@playwright/test";

const base = process.env.SENPINE_URL || "http://localhost:3000";
await mkdir(".artifacts", { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
const posts = [];
page.on("pageerror", (error) => errors.push(error.message));
page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
page.on("request", (request) => { if (request.method() === "POST") posts.push(request.url()); });

async function ready() {
  await page.locator(".botanical-intro").waitFor({ state: "detached" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1600);
}

async function open(route = "/contact") {
  const response = await page.goto(`${base}${route}`, { waitUntil: "networkidle" });
  assert.equal(response.status(), 200);
  await ready();
}

async function noOverflow() {
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "No horizontal overflow");
}

try {
  await open("/story");
  const header = page.getByRole("navigation", { name: "Điều hướng chính" });
  assert.equal(await header.getByRole("link", { name: "Về SenPine", exact: true }).count(), 0);
  await header.getByRole("link", { name: "Liên hệ", exact: true }).click();
  await page.waitForURL("**/contact");
  await ready();
  assert.equal(await header.getByRole("link", { name: "Liên hệ", exact: true }).getAttribute("aria-current"), "page");
  assert.equal(await page.locator(".footer").getByRole("link", { name: "Về SenPine", exact: true }).getAttribute("href"), "/about");
  await noOverflow();
  await page.screenshot({ path: ".artifacts/contact-desktop.png" });
  const transform = await page.locator(".ct-floating-note").evaluate((element) => getComputedStyle(element).transform);
  await page.evaluate(() => scrollTo({ top: 300, behavior: "instant" }));
  await page.waitForTimeout(1300);
  assert.notEqual(await page.locator(".ct-floating-note").evaluate((element) => getComputedStyle(element).transform), transform, "Hero note moves with scrolling");

  for (const [label, id, heading] of [
    ["Hợp tác & phát triển", "business", "Cùng mở một hướng mới."],
    ["Thiết kế & bộ sưu tập", "collection", "Kể tiếp câu chuyện thiết kế."],
    ["Câu chuyện & kết nối", "other", "Mỗi góc nhìn đều có giá trị."],
    ["Vật liệu & bộ mẫu", "materials", "Bắt đầu từ chất liệu."],
  ]) {
    const card = page.locator(".ct-topic-grid").getByRole("button", { name: new RegExp(label) });
    await card.click();
    assert.equal(await card.getAttribute("aria-pressed"), "true");
    assert.equal(await page.getByLabel("Chủ đề trao đổi", { exact: true }).inputValue(), id);
    assert.equal(await page.locator(".ct-guidance h3").innerText(), heading);
    assert.equal(await page.getByLabel("Chất liệu quan tâm", { exact: true }).count(), id === "other" ? 0 : 1);
  }
  await page.getByLabel("Chất liệu quan tâm", { exact: true }).selectOption("SenPine Blend");
  const submit = page.getByRole("button", { name: "Xem lại lời nhắn", exact: true });
  await submit.click();
  assert.equal(await page.locator(".ct-review").count(), 0, "Required fields prevent an empty review");
  await page.getByLabel("Họ và tên *", { exact: true }).fill("  Nguyễn Thiết Kế  ");
  await page.getByLabel("Email *", { exact: true }).fill("invalid-email");
  await page.getByLabel("Nội dung lời nhắn *", { exact: true }).fill("Tôi muốn khám phá các chất liệu cho một bộ sưu tập phụ kiện.");
  await submit.click();
  assert.equal(await page.locator(".ct-review").count(), 0, "Invalid email prevents a review");
  assert.ok(await page.getByLabel("Email *", { exact: true }).evaluate((element) => !element.validity.valid));
  await page.getByLabel("Email *", { exact: true }).fill("designer@example.com");
  await page.getByLabel("Họ và tên *", { exact: true }).fill("            ");
  await submit.click();
  assert.match(await page.locator(".ct-form").getByRole("alert").innerText(), /Hãy nhập họ và tên/);
  assert.ok(await page.getByLabel("Họ và tên *", { exact: true }).evaluate((element) => document.activeElement === element));
  await page.getByLabel("Họ và tên *", { exact: true }).fill("  Nguyễn Thiết Kế  ");
  await page.getByLabel("Nội dung lời nhắn *", { exact: true }).fill("              a              ");
  await submit.click();
  assert.match(await page.locator(".ct-form").getByRole("alert").innerText(), /ít nhất 10 ký tự/);
  assert.equal(await page.getByLabel("Nội dung lời nhắn *", { exact: true }).getAttribute("aria-invalid"), "true");
  await page.getByLabel("Nội dung lời nhắn *", { exact: true }).fill("Tôi muốn khám phá các chất liệu cho một bộ sưu tập phụ kiện.\nMong tìm hiểu thêm về cấu trúc dệt và cảm giác bề mặt.");
  await page.getByLabel(/Thương hiệu \/ Tổ chức/).fill("Studio Demo");
  await page.getByLabel("Chủ đề trao đổi", { exact: true }).selectOption("business");
  assert.equal(await page.getByLabel("Chất liệu quan tâm", { exact: true }).inputValue(), "SenPine Blend");
  assert.equal(await page.getByLabel("Họ và tên *", { exact: true }).inputValue(), "  Nguyễn Thiết Kế  ", "Changing subject preserves the draft");
  await page.locator(".ct-form-shell").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
  await page.screenshot({ path: ".artifacts/contact-form.png" });
  await submit.click();
  await page.locator(".ct-review").waitFor();
  assert.match(await page.getByRole("status").innerText(), /chưa được gửi đến SenPine hoặc lưu trữ/);
  assert.match(await page.locator(".ct-review-details").innerText(), /Nguyễn Thiết Kế/);
  assert.match(await page.locator(".ct-review-details").innerText(), /SenPine Blend/);
  assert.ok(await page.locator(".ct-review-title").evaluate((element) => document.activeElement === element), "Review heading receives focus");
  assert.deepEqual(posts, [], "Demo must not submit personal details to an endpoint");
  const storage = await page.evaluate(() => JSON.stringify({ local: { ...localStorage }, session: { ...sessionStorage } }));
  assert.ok(!storage.includes("designer@example.com") && !storage.includes("Studio Demo"), "Contact data is not persisted");
  await page.screenshot({ path: ".artifacts/contact-review.png" });
  await page.getByRole("button", { name: "Chỉnh sửa lời nhắn", exact: true }).click();
  assert.equal(await page.getByLabel("Email *", { exact: true }).inputValue(), "designer@example.com");
  await submit.click();
  await page.getByRole("button", { name: "Viết lời nhắn mới", exact: true }).click();
  assert.equal(await page.getByLabel("Họ và tên *", { exact: true }).inputValue(), "");
  assert.equal(await page.getByLabel("Nội dung lời nhắn *", { exact: true }).inputValue(), "");

  const question = page.locator(".ct-faq-list summary").first();
  await question.focus();
  await question.press("Enter");
  assert.equal(await page.locator(".ct-faq-list details").first().getAttribute("open"), "");
  assert.equal(await page.getByRole("link", { name: "So sánh ba chất liệu", exact: true }).getAttribute("href"), "/materials");
  await page.screenshot({ path: ".artifacts/contact-faq.png" });
  await question.press("Enter");
  assert.equal(await page.locator(".ct-faq-list details").first().getAttribute("open"), null);

  await page.locator(".site-header").getByRole("button", { name: "Chuyển sang tiếng Anh", exact: true }).click();
  assert.equal(await header.getByRole("link", { name: "Contact", exact: true }).getAttribute("href"), "/contact");
  await page.getByLabel("Full name *", { exact: true }).fill("Demo Designer");
  await page.getByLabel("Email *", { exact: true }).fill("demo@example.com");
  await page.getByLabel("Your message *", { exact: true }).fill("I am researching plant fibres for a new accessories collection.");
  await page.getByLabel("Conversation subject", { exact: true }).selectOption("other");
  await page.getByRole("button", { name: "Review message", exact: true }).click();
  assert.match(await page.getByRole("status").innerText(), /has not been sent to SenPine or stored/);
  await page.locator(".site-header").getByRole("button", { name: "Giao diện tối", exact: true }).click();
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(500);
  await page.screenshot({ path: ".artifacts/contact-dark-en.png" });
  await page.locator(".site-header").getByRole("button", { name: "Switch to Vietnamese", exact: true }).click();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForTimeout(300);
  assert.equal(await page.locator("main").getAttribute("data-effects"), "on", "Full autoplay stays enabled for either device preference");
  assert.equal(await page.locator(".page-motion-ribbon-track").evaluate((element) => getComputedStyle(element).animationName), "pe-ribbon-drift");
  await page.getByRole("button", { name: "Viết lời nhắn mới", exact: true }).click();
  assert.equal(await page.locator(".ct-guidance").evaluate((element) => getComputedStyle(element).animationName), "ct-guidance-in");
  await page.locator(".site-header").getByRole("button", { name: "Giao diện sáng", exact: true }).click();
  for (const width of [360, 390, 768, 1024]) {
    await page.setViewportSize({ width, height: 844 });
    await open();
    await noOverflow();
    await page.getByRole("button", { name: "Mở menu", exact: true }).click();
    const mobileNav = page.getByRole("navigation", { name: "Điều hướng trên điện thoại" });
    assert.equal(await mobileNav.locator('a[href="/about"]').count(), 0);
    assert.equal(await mobileNav.locator('a[href="/contact"]').count(), 1, "Mobile Contact link appears once");
    await mobileNav.getByRole("link", { name: /Liên hệ/ }).click();
    assert.equal(await page.getByRole("button", { name: "Mở menu", exact: true }).getAttribute("aria-expanded"), "false");
    await page.getByLabel("Chủ đề trao đổi", { exact: true }).selectOption("business");
    await noOverflow();
    if (width === 390) {
      await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
      await page.screenshot({ path: ".artifacts/contact-mobile.png" });
      await page.locator(".ct-form-shell").scrollIntoViewIfNeeded();
      await page.screenshot({ path: ".artifacts/contact-mobile-form.png" });
      await page.getByLabel("Họ và tên *", { exact: true }).fill("Nhà thiết kế demo");
      await page.getByLabel("Email *", { exact: true }).fill("mobile@example.com");
      await page.getByLabel("Nội dung lời nhắn *", { exact: true }).fill("Tôi muốn tìm hiểu chất liệu cho một thiết kế túi vải.");
      await page.getByRole("button", { name: "Xem lại lời nhắn", exact: true }).click();
      await page.locator(".ct-review").waitFor();
      assert.ok(await page.locator(".ct-review-title").evaluate((element) => {
        const box = element.getBoundingClientRect();
        return box.top >= 68 && box.bottom <= innerHeight;
      }), "Mobile review heading stays visible below the fixed header");
      await noOverflow();
      await page.screenshot({ path: ".artifacts/contact-mobile-review.png" });
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await open();
  await page.locator(".footer-theme-controls").getByRole("button", { name: "Đổi ngôn ngữ", exact: true }).click();
  await noOverflow();
  await page.locator(".ct-form-shell").scrollIntoViewIfNeeded();
  await noOverflow();
  assert.deepEqual(errors, [], "Browser errors");
  console.log("PASS: Contact navigation, topics, form validation and review, edit/reset, no submission or storage, keyboard FAQ, languages, themes, full autoplay and 360/390/768/1024px layouts.");
} finally {
  await browser.close();
}
