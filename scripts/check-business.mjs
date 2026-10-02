import assert from "node:assert/strict";
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const base = process.env.SENPINE_URL || "http://localhost:3000";
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
await mkdir(".artifacts", { recursive: true });
const errors = [];
const cleanScreenshot = "nextjs-portal { visibility: hidden !important; }";

try {
  for (const [width, reducedMotion] of [[1440, "no-preference"], [1024, "no-preference"], [768, "no-preference"], [390, "no-preference"], [360, "reduce"]]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion });
    const page = await context.newPage();
    page.on("pageerror", error => errors.push(error.message));
    page.on("response", response => { if (response.status() >= 400 && /images|_next\/image/.test(response.url())) errors.push(`${response.status()}: ${response.url()}`); });
    const response = await page.goto(`${base}/business`, { waitUntil: "networkidle" });
    if (response.status() !== 200) console.error("Preview response:", response.status(), (await response.text()).slice(-4000), errors);
    assert.equal(response.status(), 200);
    await page.locator(".botanical-intro").waitFor({ state: "visible" });
    await page.keyboard.press("Escape");
    await page.locator(".botanical-intro").waitFor({ state: "detached" });
    await page.waitForFunction(() => document.querySelector(".partner-page")?.dataset.ready === "true");
    await page.waitForFunction(() => getComputedStyle(document.querySelector(".bp-hero-copy h1")).opacity === "1");
    assert.equal(await page.locator("main h1").count(), 1);
    assert.equal(await page.locator(".bp-material-card").count(), 3);
    assert.equal(await page.locator(".bp-process-step").count(), 4);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Overflow at ${width}px`);
    await page.waitForFunction(() => document.querySelector(".bp-hero-image img").naturalWidth > 0);
    if (width === 1440 || width === 390) await page.screenshot({ path: `.artifacts/business-hero-${width}.png`, style: cleanScreenshot });

    await page.getByRole("link", { name: "Khám phá vật liệu", exact: true }).click();
    await page.waitForFunction(() => document.getElementById("partner-materials").getBoundingClientRect().top < 210);
    for (const [index, name, text, material] of [[0, "Thương hiệu", "Tạo dấu ấn", "pinefiber"], [1, "Nhà thiết kế", "ngôn ngữ thiết kế", "blend"], [2, "Đối tác sản xuất", "Làm rõ yêu cầu", "pinefiber"]]) {
      const tab = page.getByRole("tab", { name, exact: true });
      await tab.click();
      assert.equal(await tab.getAttribute("aria-selected"), "true");
      assert.equal(await page.getByRole("tabpanel").getAttribute("aria-labelledby"), `bp-audience-tab-${index}`);
      assert.ok((await page.getByRole("tabpanel").innerText()).includes(text));
      assert.equal(await page.locator(".bp-recommendation").getAttribute("href"), `/materials/${material}`);
      assert.ok(await page.locator("#bp-audience-panel").isVisible());
    }
    await page.keyboard.press("ArrowLeft");
    assert.equal(await page.getByRole("tab", { name: "Nhà thiết kế", exact: true }).getAttribute("aria-selected"), "true");
    await page.keyboard.press("Home");
    assert.equal(await page.getByRole("tab", { name: "Thương hiệu", exact: true }).getAttribute("aria-selected"), "true");
    await page.keyboard.press("End");
    assert.equal(await page.getByRole("tab", { name: "Đối tác sản xuất", exact: true }).getAttribute("aria-selected"), "true");
    for (const faq of await page.locator(".bp-faq details").all()) {
      await faq.locator("summary").click();
      assert.equal(await faq.getAttribute("open"), "");
      assert.ok(await faq.locator("p").isVisible());
      await faq.locator("summary").click();
    }
    await page.locator(".bp-dossier > summary").focus();
    await page.keyboard.press("Enter");
    assert.equal(await page.locator(".bp-dossier").getAttribute("open"), "");
    assert.equal(await page.locator(".bp-equipment img").count(), 3);
    await page.locator(".bp-dossier > summary").click();
    assert.equal(await page.locator(".bp-dossier").getAttribute("open"), null);

    for (const target of await page.locator(".bp-reveal").all()) {
      await target.scrollIntoViewIfNeeded();
      await page.waitForFunction(selector => [...document.querySelectorAll(selector)].filter(element => element.getBoundingClientRect().top < innerHeight && element.getBoundingClientRect().bottom > 0).every(element => getComputedStyle(element).opacity === "1"), ".bp-reveal");
    }
    if (width === 1440 || width === 390) await page.screenshot({ path: `.artifacts/business-full-${width}.png`, fullPage: true, style: `${cleanScreenshot} .site-header, .skip-link, .reading-progress { visibility: hidden !important; }` });

    await page.locator("footer").getByRole("button", { name: "Đổi ngôn ngữ" }).click();
    await page.getByRole("heading", { name: "A new material. A distinct advantage." }).waitFor();
    await page.getByRole("tab", { name: "Designers", exact: true }).click();
    assert.ok((await page.getByRole("tabpanel").innerText()).includes("design language"));
    await page.locator("footer").getByRole("button", { name: "Đổi giao diện sáng tối" }).click();
    assert.equal(await page.locator("html").getAttribute("data-theme"), "dark");
    if (width === 1440) {
      await page.locator(".bp-fit").scrollIntoViewIfNeeded();
      await page.screenshot({ path: ".artifacts/business-dark-1440.png", style: cleanScreenshot });
    }
    if (reducedMotion === "reduce") {
      assert.equal(await page.locator(".partner-page").getAttribute("data-partner-motion"), "off");
      assert.equal(await page.locator(".bp-hero .bp-threads").evaluate(element => getComputedStyle(element).animationName), "none");
    }
    for (const path of ["request-sample", "request-quote"]) {
      await page.locator(`.bp-start-options a[href='/business/${path}']`).focus();
      await page.keyboard.press("Enter");
      await page.waitForURL(`**/business/${path}`);
      await page.locator(".business-form").waitFor({ state: "visible" });
      await page.goBack();
      await page.waitForURL("**/business*");
      await page.locator(".partner-page").waitFor({ state: "visible" });
      assert.equal(await page.locator(".botanical-intro").count(), 0);
    }
    await context.close();
  }
  assert.deepEqual(errors, [], "Browser errors");
  console.log("PASS: Partner materials, audience tabs and keyboard navigation, FAQs, reference dossier, sample/brief links, browser back, English and dark mode; 360/390/768/1024/1440px, reduced motion and no browser/image errors.");
} finally {
  await browser.close();
}
