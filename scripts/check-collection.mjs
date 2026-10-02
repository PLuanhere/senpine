import assert from "node:assert/strict";
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const base = process.env.SENPINE_URL || "http://localhost:3000";
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
await mkdir(".artifacts", { recursive: true });
const errors = [];

try {
  for (const [width, reducedMotion] of [[1440, "no-preference"], [1024, "no-preference"], [768, "no-preference"], [390, "no-preference"], [360, "reduce"]]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion });
    const page = await context.newPage();
    page.on("pageerror", error => errors.push(error.message));
    const response = await page.goto(`${base}/collection`, { waitUntil: "networkidle" });
    assert.equal(response.status(), 200);
    await page.locator(".botanical-intro").waitFor({ state: "visible" });
    await page.keyboard.press("Escape");
    await page.locator(".botanical-intro").waitFor({ state: "detached" });
    await page.waitForFunction(() => document.querySelector('.collection-experience')?.dataset.ready === "true");
    await page.waitForTimeout(1000);
    assert.equal(await page.locator("main h1").count(), 1);
    assert.equal(await page.locator(".collection-grid .editorial-card").count(), 6);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Horizontal overflow: ${width}`);
    const ids = await page.locator("main svg [id]").evaluateAll(nodes => nodes.map(node => node.id));
    assert.equal(new Set(ids).size, ids.length, "SVG gradients and clips must have unique IDs");
    if (width === 1440 || width === 390) await page.screenshot({ path: `.artifacts/collection-hero-${width}.png` });

    const next = page.getByRole("button", { name: "Thiết kế tiếp theo", exact: true });
    for (const slug of ["vay-dang-dai", "khan-choang", "tui-vai", "mu-bucket", "vi-vai", "ao-so-mi-tu-nhien"]) {
      await next.click();
      assert.equal(await page.locator(".collection-feature-object").getAttribute("href"), `/products/${slug}`);
    }
    await page.getByRole("button", { name: "Thiết kế trước", exact: true }).click();
    assert.equal(await page.locator(".collection-feature-object").getAttribute("href"), "/products/vi-vai");
    await page.locator(".collection-satellite-left").click();
    assert.equal(await page.locator(".collection-feature-object").getAttribute("href"), "/products/khan-choang");

    await page.locator(".collection-explore").click();
    await page.waitForFunction(() => document.querySelector("#collection-designs").getBoundingClientRect().top < 200);
    for (const [filter, count] of [["Trang phục", 2], ["Phụ kiện", 4], ["Tất cả", 6]]) {
      const control = page.getByRole("button", { name: new RegExp(filter) });
      await control.click();
      assert.equal(await control.getAttribute("aria-pressed"), "true");
      assert.equal(await page.locator(".collection-grid .editorial-card").count(), count);
      assert.match(await page.locator(".collection-result-count").innerText(), new RegExp(`0${count}`));
    }
    for (const card of await page.locator(".collection-design-card").all()) {
      await card.scrollIntoViewIfNeeded();
      await card.focus();
      await page.waitForFunction(() => getComputedStyle(document.activeElement).opacity === "1");
    }
    if (width === 1440 || width === 390) await page.locator(".collection-catalog").screenshot({ path: `.artifacts/collection-catalog-${width}.png`, style: ".site-header, .skip-link, .reading-progress, nextjs-portal { visibility: hidden !important; }" });

    await page.locator("footer").getByRole("button", { name: "Đổi ngôn ngữ" }).click();
    await page.getByRole("heading", { name: "Everyday essentials." }).waitFor();
    await page.getByRole("button", { name: /Accessories/ }).click();
    assert.equal(await page.locator(".collection-grid .editorial-card").count(), 4);
    await page.locator("footer").getByRole("button", { name: "Đổi giao diện sáng tối" }).click();
    assert.equal(await page.locator("html").getAttribute("data-theme"), "dark");
    if (width === 1440) {
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
      await page.screenshot({ path: ".artifacts/collection-dark-1440.png" });
    }
    if (reducedMotion === "reduce") {
      assert.equal(await page.locator(".collection-experience").getAttribute("data-motion"), "off");
      assert.equal(await page.locator(".collection-feature-object > svg").evaluate(node => getComputedStyle(node).animationName), "none");
    }
    await page.locator(".collection-grid a[href='/products/khan-choang']").focus();
    await page.keyboard.press("Enter");
    await page.waitForURL("**/products/khan-choang");
    assert.ok(await page.locator("main h1").isVisible());
    await page.goBack();
    await page.waitForURL("**/collection*");
    try {
      await page.locator(".collection-experience").waitFor({ state: "visible", timeout: 10000 });
    } catch (error) {
      console.error("Back navigation:", width, page.url(), await page.locator("main").innerText(), errors);
      await page.screenshot({ path: ".artifacts/collection-back-failure.png" });
      throw error;
    }
    assert.equal(await page.locator(".collection-experience").count(), 1);
    assert.equal(await page.locator(".botanical-intro").count(), 0);
    await context.close();
  }
  assert.deepEqual(errors, [], "Browser errors");
  console.log("PASS: Six featured designs, previous/next wraparound, satellite selection, category filters, SVG IDs, English, dark mode, keyboard navigation and back navigation; desktop/tablet/mobile and reduced motion.");
} finally {
  await browser.close();
}
