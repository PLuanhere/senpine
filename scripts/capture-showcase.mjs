import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const output = ".artifacts";
await mkdir(output, { recursive: true });

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  // 1. Desktop Light Mode Home
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.locator(".hero h1").waitFor();
  await page.screenshot({ path: `${output}/showcase-01-desktop-light-home.png` });

  // 2. Desktop Dark Mode Home
  await page.locator(".theme-toggle-btn").click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${output}/showcase-02-desktop-dark-home.png` });

  // 3. Desktop English Mode (Dark)
  await page.locator(".lang-toggle-pill").click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${output}/showcase-03-desktop-dark-english.png` });

  // 4. Desktop English Mode (Light)
  await page.locator(".theme-toggle-btn").click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${output}/showcase-04-desktop-light-english.png` });

  // Return to Vietnamese
  await page.locator(".lang-toggle-pill").click();
  await page.waitForTimeout(300);

  // 5. Scroll to Value Pyramid & Material Lab
  await page.locator(".pyramid-section").scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${output}/showcase-05-value-pyramid.png` });

  await page.locator("#materials").scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${output}/showcase-06-material-lab.png` });

  // 6. Open Material Modal
  await page.getByRole("button", { name: "Khám phá PineFiber", exact: true }).click();
  await page.getByRole("dialog").waitFor();
  await page.screenshot({ path: `${output}/showcase-07-material-modal.png` });
  await page.keyboard.press("Escape");

  // 7. Scroll to Collection Showroom
  await page.locator("#collection").scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${output}/showcase-08-showroom.png` });

  // 8. Mobile 390px Light Mode
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.screenshot({ path: `${output}/showcase-09-mobile-light.png` });

  // 9. Mobile Menu with Theme and Lang controls
  await page.getByRole("button", { name: "Mở menu", exact: true }).click();
  await page.waitForSelector(".mobile-nav");
  await page.screenshot({ path: `${output}/showcase-10-mobile-menu.png` });

  console.log("SHOWCASE CAPTURED SUCCESSFULLY!");
} finally {
  await browser.close();
}
