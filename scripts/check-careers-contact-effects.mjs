import assert from "node:assert/strict";
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
await mkdir(".artifacts", { recursive: true });
const base = process.env.SENPINE_URL || "http://localhost:3000";
const style = (locator, property, pseudo = null) => locator.evaluate((node, args) => getComputedStyle(node, args.pseudo).getPropertyValue(args.property), { property, pseudo });

async function open(route) {
  await page.goto(base + route, { waitUntil: "networkidle" });
  await page.locator(".botanical-intro").waitFor({ state: "detached" });
  await page.evaluate(() => document.fonts.ready);
  await page.locator('main[data-effects="on"]').waitFor();
  await page.waitForTimeout(1500);
  assert.equal(await page.getByRole("button", { name: /Giảm chuyển động|Bật chuyển động|Phát lại hiệu ứng/ }).count(), 0, "Motion starts automatically without controls");
}
async function inspectSections(selectors) {
  for (const selector of selectors) {
    const item = page.locator(selector).first();
    await item.evaluate((node) => node.scrollIntoView({ behavior: "instant", block: "center" }));
    await page.waitForFunction((selector) => {
      const node = document.querySelector(selector);
      return node && getComputedStyle(node).opacity === "1" && getComputedStyle(node).clipPath === "none";
    }, selector);
    assert.equal(Number(await style(item, "opacity")), 1, `${selector} reveals on scroll`);
    assert.equal(await style(item, "clip-path"), "none", `${selector} finishes its mask`);
  }
}
async function pointerCard(selector) {
  const card = page.locator(selector).first();
  await card.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1300);
  const box = await card.boundingBox();
  await page.mouse.move(box.x + box.width * .7, box.y + box.height * .4);
  await page.waitForTimeout(500);
  assert.equal(await card.getAttribute("data-pointer-active"), "true");
  const hovered = await card.boundingBox();
  assert.ok(Math.abs(hovered.x - box.x) < 1 && Math.abs(hovered.y - box.y) < 1, "Hover keeps the clickable card stationary");
  assert.equal(await style(card, "opacity", "::after"), "1", "Pointer spotlight appears");
  await page.mouse.move(1, 90);
  await page.waitForTimeout(100);
  assert.equal(await card.getAttribute("data-pointer-active"), null, "Pointer decoration clears on leave");
}
async function assertVisibleHeroMotion(selector) {
  const picture = page.locator(selector);
  const positions = [];
  for (let index = 0; index < 6; index++) {
    positions.push((await picture.boundingBox()).y);
    await page.waitForTimeout(400);
  }
  assert.ok(Math.max(...positions) - Math.min(...positions) > 4, "The main hero image visibly floats without pointer input or scrolling");
}
async function replaySection(selector) {
  await page.evaluate(() => { document.activeElement?.blur(); scrollTo({ top: 0, behavior: "instant" }); });
  const item = page.locator(selector).first();
  await page.waitForFunction((selector) => document.querySelector(selector)?.getAttribute("data-reveal-state") === "pending", selector);
  assert.equal(Number(await style(item, "opacity")), 0, "A section below the viewport waits again after scrolling back");
  await item.evaluate((node) => node.scrollIntoView({ block: "center", behavior: "instant" }));
  await page.waitForFunction((selector) => document.querySelector(selector)?.getAttribute("data-reveal-state") === "entering", selector);
  assert.ok(Number(await style(item, "opacity")) < 1, "The re-entry has a visible transition");
  await page.waitForFunction((selector) => document.querySelector(selector)?.getAttribute("data-reveal-state") === "shown", selector);
}

try {
  await open("/careers");
  await assertVisibleHeroMotion(".cr-hero-photo");
  assert.equal(await style(page.locator(".atmosphere-lines path").first(), "animation-name"), "pe-thread-travel");
  const seed = page.locator(".atmosphere-seed-0");
  const before = await style(seed, "transform");
  await page.waitForTimeout(400);
  assert.notEqual(await style(seed, "transform"), before, "Hero decoration moves without scrolling");
  await page.screenshot({ path: ".artifacts/careers-effects-hero.png" });
  assert.equal(Number(await style(page.locator(".cr-benefits article").first(), "opacity")), 0, "A distant section waits for scrolling");
  await pointerCard(".cr-job-card");
  await inspectSections([".cr-life-copy > h2", ".cr-benefits article", ".cr-process-steps li", ".cr-questions details", ".cr-bottom-cta > div"]);
  await replaySection(".cr-benefits article");
  await page.locator(".cr-benefits").scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  assert.equal(await style(page.locator(".cr-benefit-number").first(), "animation-name", "::before"), "pe-orbit");
  await page.screenshot({ path: ".artifacts/careers-effects-benefits.png" });
  await page.getByRole("searchbox").fill("zzzz");
  await page.getByRole("button", { name: "Xóa bộ lọc" }).click();
  await page.locator(".cr-job-card").last().scrollIntoViewIfNeeded();
  await page.waitForTimeout(1400);
  assert.equal(Number(await style(page.locator(".cr-job-card").last(), "opacity")), 1, "Remounted filter results reveal correctly");
  await page.locator(".cr-job-card").first().click();
  await page.waitForURL("**/careers/*");
  await page.waitForTimeout(1500);
  await inspectSections([".cr-detail-content h2", ".cr-application-form", ".cr-other-roles > div > a"]);

  await open("/contact");
  await assertVisibleHeroMotion(".ct-picture");
  await page.screenshot({ path: ".artifacts/contact-effects-hero.png" });
  assert.equal(await style(page.locator(".ct-note-stitches"), "animation-name"), "pe-stitch-run");
  await pointerCard(".ct-channel-card");
  await pointerCard(".ct-topic-card");
  await inspectSections([".ct-message-intro > h2", ".ct-form-shell", ".ct-next-steps li", ".ct-faq-list details", ".ct-project-copy > h2"]);
  await replaySection(".ct-topic-card");
  await page.locator(".ct-topic-grid").scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await page.screenshot({ path: ".artifacts/contact-effects-topics.png" });

  for (const route of ["/careers", "/contact"]) {
    await page.setViewportSize({ width: 390, height: 844 });
    await open(route);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "Motion decoration stays within the mobile screen");
    await page.screenshot({ path: `.artifacts/${route.slice(1)}-effects-mobile.png` });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.locator('main[data-motion-choice="full"][data-effects="on"]').waitFor();
    assert.equal(await style(page.locator(".page-motion-ribbon-track"), "animation-name"), "pe-ribbon-drift", "Full motion autoplay stays enabled with reduced motion selected on the device");
    await assertVisibleHeroMotion(route === "/careers" ? ".cr-hero-photo" : ".ct-picture");
    await page.emulateMedia({ reducedMotion: "no-preference" });
  }
  assert.deepEqual(errors, [], "No runtime errors through filters, scrolling or route transitions");
  console.log("PASS: distinct ambient motion, scroll reveals, pointer effects, stable hover targets, filtered results, detail routes, mobile layouts and full autoplay with either device motion preference.");
} finally {
  await browser.close();
}
