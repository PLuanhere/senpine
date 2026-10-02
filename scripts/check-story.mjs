import assert from "node:assert/strict";
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const base = process.env.SENPINE_URL || "http://localhost:3000";
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
await mkdir(".artifacts", { recursive: true });
const errors = [];
const images = ["pineapple-harvest", "fiber-extraction", "fiber-drying", "spinning-machine", "weaving-machine", "lotus-embroidery", "runway-reference"];

async function ready(page) {
  await page.locator(".botanical-intro").waitFor({ state: "visible" });
  await page.keyboard.press("Escape");
  await page.locator(".botanical-intro").waitFor({ state: "detached" });
  await page.waitForFunction(() => getComputedStyle(document.querySelector("main h1")).opacity === "1" && [...document.querySelectorAll(".motion-word > span")].every((element) => getComputedStyle(element).transform === "none"));
}

try {
  for (const [width, reducedMotion] of [[1440, "no-preference"], [1024, "no-preference"], [768, "no-preference"], [390, "no-preference"], [360, "reduce"]]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion });
    const page = await context.newPage();
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("response", (response) => { if (response.status() >= 400 && /images|_next\/image/.test(response.url())) errors.push(`${response.status()}: ${response.url()}`); });
    await page.goto(`${base}/story`, { waitUntil: "networkidle" });
    await ready(page);
    assert.equal(await page.locator("main h1").count(), 1);
    assert.equal(await page.locator(".story-timeline > article").count(), 7);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Overflow at ${width}px`);
    await page.locator(".story-start").click();
    await page.waitForFunction(() => document.querySelector("#story-beginning").getBoundingClientRect().top < 210);
    await page.locator('.story-chapters a[href="#story-journey"]').click();
    await page.waitForFunction(() => document.querySelector('.story-chapters a[aria-current="location"]').getAttribute("href") === "#story-journey");

    for (let index = 0; index < 7; index++) {
      const step = `0${index + 1}`;
      await page.evaluate((id) => {
        const target = document.getElementById(id);
        window.scrollTo({ top: scrollY + target.getBoundingClientRect().top - innerHeight * .45, behavior: "instant" });
      }, `story-step-${step}`);
      await page.waitForFunction((id) => document.querySelector(".story-stage-text.is-current")?.id === id, `story-step-${step}`);
      assert.ok((await page.locator(".story-stage-image.is-active img").getAttribute("src")).includes(`${images[index]}.webp`));
      await page.waitForFunction(() => document.querySelector(".story-stage-image.is-active img")?.naturalWidth > 0);
      assert.equal(await page.locator(".story-stage-visual a[aria-current='step']").innerText(), step);
      const top = await page.locator(".story-stage-visual").evaluate((element) => element.getBoundingClientRect().top);
      const stickyTop = width > 900 ? 166 : 126;
      if (index > 0) assert.ok(Math.abs(top - stickyTop) < 2, `Image must stick beside the current text: ${width}px, top=${top}`);
      else assert.ok(top >= stickyTop && top < 430, "First image enters with its chapter before becoming sticky");
    }

    await page.locator('.story-stage-visual a[href="#story-step-02"]').click();
    await page.waitForFunction(() => document.querySelector(".story-stage-text.is-current")?.id === "story-step-02");
    await page.locator('.story-chapters a[href="#story-touch"]').click();
    await page.waitForFunction(() => document.querySelector('.story-chapters a[aria-current="location"]').getAttribute("href") === "#story-touch");
    await page.getByRole("tab", { name: /Tinh tế/ }).click();
    await page.waitForFunction(() => !document.getElementById("story-material-panel-2").hidden);
    assert.ok((await page.getByRole("tabpanel").innerText()).includes("Thời gian ở trong từng sợi."));
    await page.keyboard.press("ArrowLeft");
    assert.equal(await page.getByRole("tab", { name: /Giao thoa/ }).getAttribute("aria-selected"), "true");
    await page.keyboard.press("Home");
    assert.equal(await page.getByRole("tab", { name: /Thô mộc/ }).getAttribute("aria-selected"), "true");
    await page.keyboard.press("End");
    assert.equal(await page.getByRole("tab", { name: /Tinh tế/ }).getAttribute("aria-selected"), "true");
    assert.equal(await page.locator(".story-material-picture.is-active").count(), 1);
    if (width === 390) await page.screenshot({ path: ".artifacts/story-touch-mobile.png" });

    await page.locator(".story-process-note summary").click();
    assert.equal(await page.locator(".story-process-note").getAttribute("open"), "");
    await page.locator(".document-figure").scrollIntoViewIfNeeded();
    await page.waitForFunction(() => getComputedStyle(document.querySelector(".document-figure")).opacity === "1");
    const [popup] = await Promise.all([page.waitForEvent("popup"), page.getByRole("link", { name: "Xem ảnh đầy đủ", exact: true }).click()]);
    await popup.waitForLoadState();
    assert.ok(popup.url().endsWith("production-process.webp"));
    await popup.close();
    await page.locator(".story-process-note summary").click();
    await page.locator(".story-ending").getByRole("link", { name: "Đến Material Lab" }).click();
    await page.waitForURL("**/materials");
    await page.getByRole("heading", { name: "Ba hướng vật liệu. Ba cách kể chuyện.", exact: true }).waitFor();
    await page.waitForFunction(() => getComputedStyle(document.querySelector("main h1")).opacity === "1" && [...document.querySelectorAll(".motion-word > span")].every((element) => getComputedStyle(element).transform === "none"));
    await page.goBack();
    await page.waitForURL("**/story*");
    await page.locator(".story-chapters").waitFor({ state: "visible" });
    assert.equal(await page.locator(".story-chapters").count(), 1);
    assert.equal(await page.locator(".botanical-intro").count(), 0);
    await context.close();
  }
  assert.deepEqual(errors, []);
  console.log("PASS: Story chapters, seven scroll-driven images, sticky desktop/mobile layout, stage links, material tabs and keyboard, document diagram, client navigation; 360/390/768/1024/1440px and reduced motion.");
} catch (error) {
  console.error("Browser errors:", errors);
  throw error;
} finally {
  await browser.close();
}
