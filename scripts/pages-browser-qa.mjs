import { chromium, expect } from "@playwright/test";

const url = "http://127.0.0.1:4174/portofolio_indra/";
const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ||
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
const failures = [];
page.on("pageerror", (error) => errors.push(error.message));
page.on("response", (response) => {
  if (response.status() >= 400)
    failures.push(`${response.status()} ${response.url()}`);
});

try {
  await page.goto(url, { waitUntil: "networkidle" });
  await expect(page.locator(".hero h1")).toContainText("My Portfolio");
  await expect(page.locator(".about-portrait img")).toHaveAttribute(
    "src",
    /about-cutout\.webp/,
  );
  await expect(page.locator(".guestbook-panel")).toContainText(
    "Let's make something meaningful",
  );
  await expect(page.locator(".guestbook-panel form")).toHaveCount(0);
  await expect(page.locator("a[href^='mailto:']").first()).toHaveAttribute(
    "href",
    /mhmmadindrra@gmail\.com/,
  );
  const project = page.locator(".project-card h3 a").first();
  await project.click();
  await expect(page).toHaveURL(/#\/projects\/pyrorescue/);
  await expect(page.locator(".detail-page h1")).toContainText("PyroRescue");
  await page.reload({ waitUntil: "networkidle" });
  await expect(page.locator(".detail-page h1")).toContainText("PyroRescue");
  await page.locator(".detail-breadcrumb a").click();
  await expect(page.locator(".hero h1")).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(300);
  const widths = await page.evaluate(() => ({
    document: document.documentElement.scrollWidth,
    viewport: innerWidth,
  }));
  expect(widths.document).toBeLessThanOrEqual(widths.viewport + 1);
  expect(errors).toEqual([]);
  expect(failures).toEqual([]);
  console.log(
    "PASS GitHub Pages build: home, photos, static contact, project route/reload, mobile, and assets",
  );
} finally {
  await browser.close();
}
