import { chromium } from "@playwright/test";
const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
try {
  for (const [name, port] of [
    ["pyrorescue", 8011],
    ["sipkos", 8012],
  ]) {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 900 },
      reducedMotion: "reduce",
    });
    try {
      const response = await page.goto(`http://127.0.0.1:${port}`, {
        waitUntil: "domcontentloaded",
        timeout: 15000,
      });
      console.log(name, response.status(), await page.title());
      if (response.status() === 200) {
        await page.waitForTimeout(2000);
        await page.screenshot({ path: `.qa/${name}-candidate.png` });
      }
    } catch {
      console.log(name, "not available for capture");
    } finally {
      await page.close();
    }
  }
} finally {
  await browser.close();
}
