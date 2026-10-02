import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium } from "@playwright/test";

const base = process.env.SENPINE_URL || "http://localhost:3000";
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
await mkdir(".artifacts", { recursive: true });
const errors = [];

async function openLookup(page) {
  const response = await page.goto(`${base}/trace`, { waitUntil: "domcontentloaded" });
  assert.equal(response?.status(), 200, "Trace page must load");
  await page.waitForFunction(() => document.querySelector(".botanical-intro, .route-arrival"));
  if (await page.locator(".botanical-intro").isVisible()) await page.keyboard.press("Escape");
  await page.locator(".botanical-intro").waitFor({ state: "detached" });
  await page.getByRole("link", { name: "Truy xuất ngay" }).click();
  await page.locator("#trace-code").focus();
}

try {
  for (const width of [1440, 390, 360]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    page.on("pageerror", (error) => errors.push(error.message));
    await openLookup(page);
    const field = page.locator("#trace-code");
    const submit = page.getByRole("button", { name: "Truy xuất hồ sơ", exact: true });

    await submit.click();
    await page.locator("#trace-error").waitFor();
    assert.ok(await page.locator("#trace-error").isVisible(), "Empty codes need feedback");
    await field.fill("UNKNOWN");
    await field.press("Enter");
    await page.locator("#trace-error").waitFor();
    assert.ok(await page.locator("#trace-error").isVisible(), "Unknown codes need feedback");
    assert.ok(new URL(page.url()).pathname === "/trace");
    assert.equal(await field.getAttribute("aria-invalid"), "true");

    await field.fill(" sp-sb-001 ");
    await page.locator(".trace-lookup-footnote").scrollIntoViewIfNeeded();
    await page.waitForFunction(() => [...document.querySelectorAll(".trace-lookup > *")].every((element) => getComputedStyle(element).opacity === "1"));
    await page.locator(".trace-lookup").screenshot({ path: `.artifacts/trace-lookup-${width}.png` });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Overflow at ${width}px`);
    await field.press("Enter");
    await page.locator(".trace-transfer").waitFor();
    assert.equal(new URL(page.url()).pathname, "/trace", "Success should appear before navigation");
    assert.ok((await page.locator(".trace-transfer").innerText()).includes("SenPine Blend"));
    assert.ok(await submit.isDisabled(), "Repeated submission is blocked during the transition");
    await page.waitForFunction(() => Number(getComputedStyle(document.querySelector(".trace-transfer-content")).opacity) > .95);
    await page.screenshot({ path: `.artifacts/trace-success-${width}.png` });
    await page.waitForURL("**/trace/SP-SB-001");
    await page.locator(".trace-transfer").waitFor({ state: "detached" });
    assert.equal(await page.locator("main h1").innerText(), "SenPine Blend");

    await page.goBack({ waitUntil: "domcontentloaded" });
    await page.locator(".trace-transfer").waitFor({ state: "detached" });
    await page.getByRole("button", { name: /PineFiber SP-PF-001/ }).click();
    await page.waitForURL("**/trace/SP-PF-001");
    assert.equal(await page.locator("main h1").innerText(), "PineFiber");
    await page.close();
  }

  const reduced = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
  reduced.on("pageerror", (error) => errors.push(error.message));
  await openLookup(reduced);
  await reduced.locator("#trace-code").fill("SP-SS-001");
  await reduced.locator("#trace-code").press("Enter");
  await reduced.waitForURL("**/trace/SP-SS-001");
  assert.equal(await reduced.locator(".trace-transfer").count(), 0);
  assert.equal(await reduced.locator("main h1").innerText(), "SenSilk");
  assert.deepEqual(errors, [], "Browser runtime errors");
  console.log("PASS: invalid/empty codes, normalized keyboard lookup, success before animated navigation, all 3 passports, back navigation, desktop/360/390px, reduced motion and no browser errors.");
} finally {
  await browser.close();
}
