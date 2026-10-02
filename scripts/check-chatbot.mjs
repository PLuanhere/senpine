import assert from "node:assert/strict";
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const base = process.env.SENPINE_URL || "http://localhost:3000";
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
const errors = []; page.on("pageerror", (error) => errors.push(error.message));
await mkdir(".artifacts", { recursive: true });
const apiRequests = [];
let mode = "success";
let waiting = null;
await page.route("**/api/chat", async (route) => {
  apiRequests.push(route.request().postDataJSON());
  if (mode === "wait") await new Promise((resolve) => { waiting = resolve; });
  try {
    if (mode === "error") await route.fulfill({ status: 429, contentType: "application/json", body: JSON.stringify({ code: "rate_limit" }) });
    else await route.fulfill({ status: 200, contentType: "application/x-ndjson", body: [
      { type: "text", text: "**PineFiber** từ sợi lá dứa. " },
      { type: "text", text: "Đây là định hướng trong đề án.\n\n[Xem vật liệu](/materials)\n\n<script>window.chatUnsafe = true</script>\n\n[Unsafe](javascript:alert(1))" },
      { type: "done" },
    ].map((event) => JSON.stringify(event)).join("\n") + "\n" });
  } catch { /* An aborted fetch can dispose the intercepted request. */ }
});

async function open(path = "/careers") {
  await page.goto(base + path, { waitUntil: "networkidle" });
  await page.locator('.sp-chat[data-ready="true"]').waitFor();
  await page.locator(".botanical-intro").waitFor({ state: "detached" });
  await page.getByRole("button", { name: "Hỏi SenPine", exact: true }).click();
  await page.getByRole("dialog", { name: "Trợ lý SenPine" }).waitFor();
  assert(await page.locator("#senpine-chat-input").evaluate((node) => node === document.activeElement));
  await page.waitForTimeout(400);
  assert.equal(await page.locator(".sp-chat-thread").evaluate((node) => node.scrollTop), 0, "The welcome screen opens at the top");
}
try {
  await open();
  await page.screenshot({ path: ".artifacts/chatbot-desktop.png" });
  assert.equal(apiRequests.length, 0, "Opening chat does not consume API quota");
  assert(await page.getByRole("button", { name: "Gửi tin nhắn", exact: true }).isDisabled());
  await page.getByRole("button", { name: "SenPine có những vật liệu nào?", exact: true }).click();
  await page.locator('.sp-chat-assistant[data-state="complete"]').waitFor();
  assert.equal(apiRequests[0].lang, "vi"); assert.equal(apiRequests[0].messages.length, 1);
  assert.equal(await page.locator(".sp-chat-bubble strong").textContent(), "PineFiber");
  assert.equal(await page.evaluate(() => window.chatUnsafe), undefined);
  assert.equal(await page.locator('.sp-chat-bubble a[href^="javascript:"]').count(), 0);
  const textarea = page.locator("#senpine-chat-input");
  await textarea.fill("Tôi quan tâm đến tơ sen"); await textarea.press("Shift+Enter"); await textarea.press("x");
  assert.match(await textarea.inputValue(), /\nx$/);
  await textarea.press("Enter"); await page.locator('.sp-chat-assistant[data-state="complete"]').nth(1).waitFor();
  assert.equal(apiRequests[1].messages.length, 3, "A follow-up carries successful conversation history");
  await page.getByRole("link", { name: "Xem vật liệu", exact: true }).last().click();
  await page.waitForURL(base + "/materials");
  assert.equal(await page.locator(".sp-chat-message").count(), 4, "Client navigation preserves chat");
  await textarea.press("Escape");
  assert.equal(await page.locator(".sp-chat-panel").count(), 0);
  assert(await page.getByRole("button", { name: "Hỏi SenPine", exact: true }).evaluate((node) => node === document.activeElement));
  await page.getByRole("button", { name: "Hỏi SenPine", exact: true }).click();
  assert.equal(await page.locator(".sp-chat-message").count(), 4);
  mode = "error";
  await textarea.fill("Tư vấn cho tôi"); await textarea.press("Enter");
  await page.locator('.sp-chat-assistant[data-state="error"]').waitFor();
  assert.match(await page.locator(".sp-chat-error").textContent(), /một phút/);
  mode = "success";
  const before = await page.locator(".sp-chat-message").count();
  await page.getByRole("button", { name: "Thử lại", exact: true }).click();
  await page.locator('.sp-chat-assistant[data-state="complete"]').nth(2).waitFor();
  assert.equal(await page.locator(".sp-chat-message").count(), before, "Retry replaces failed pair");
  mode = "wait";
  await textarea.fill("Câu hỏi chờ"); await textarea.press("Enter");
  await page.getByRole("button", { name: "Dừng trả lời", exact: true }).waitFor();
  await page.getByRole("button", { name: "Dừng trả lời", exact: true }).click();
  await page.locator('.sp-chat-assistant[data-state="stopped"]').waitFor();
  mode = "success"; waiting?.();
  await page.getByRole("button", { name: "Cuộc trò chuyện mới", exact: true }).click();
  assert.equal(await page.locator(".sp-chat-message").count(), 0);
  await page.screenshot({ path: ".artifacts/chatbot-desktop-welcome.png" });
  await page.getByRole("button", { name: "Chuyển sang tiếng Anh", exact: true }).click();
  await page.getByRole("button", { name: "What materials does SenPine explore?", exact: true }).click();
  await page.locator('.sp-chat-assistant[data-state="complete"]').waitFor();
  assert.equal(apiRequests.at(-1).lang, "en");
  await page.getByRole("button", { name: "Switch to Vietnamese", exact: true }).click();

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 360, height: 780 });
  await open("/contact");
  const box = await page.locator(".sp-chat-panel").boundingBox();
  assert(box.x >= 0 && box.x + box.width <= 360 && box.y >= 0 && box.y + box.height <= 780);
  assert.equal(await page.locator(".sp-chat-panel").evaluate((node) => getComputedStyle(node).animationName), "none");
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await page.screenshot({ path: ".artifacts/chatbot-mobile.png" });
  await page.locator(".sp-chat-thread").evaluate((node) => node.scrollTop = node.scrollHeight);
  await page.getByRole("button", { name: "Tôi muốn tìm hiểu bộ mẫu vải", exact: true }).click();
  await page.locator('.sp-chat-assistant[data-state="complete"]').waitFor();
  await page.screenshot({ path: ".artifacts/chatbot-mobile-reply.png" });
  await page.evaluate(() => document.documentElement.setAttribute("data-theme", "dark"));
  await page.screenshot({ path: ".artifacts/chatbot-dark.png" });
  await page.setViewportSize({ width: 1440, height: 960 });
  await open("/");
  assert.equal(await page.locator(".sp-chat").count(), 1, "Home has exactly one chatbot");
  assert.deepEqual(errors, []);
  console.log("Chat UI checks passed: Home, desktop/mobile, keyboard, Markdown safety, follow-up history, navigation, retry, stop, reset, dark theme, reduced motion.");
} finally { waiting?.(); await browser.close(); }
