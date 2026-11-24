import { chromium, expect } from "@playwright/test";
import fs from "node:fs";
const base = "http://localhost/portofolio_indra/public";
const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ||
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  }),
  page = await context.newPage();
const errors = [],
  failures = [],
  checks = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("response", (r) => {
  if (r.status() >= 400 && r.url().includes("/build/"))
    failures.push(`${r.status()} ${r.url()}`);
});
const check = (label) => {
  checks.push(label);
  console.log("PASS", label);
};
async function settle() {
  await page.waitForTimeout(550);
}
async function revealAll(p = page) {
  await p.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 90));
    }
    window.scrollTo(0, 0);
  });
  await p.waitForTimeout(650);
}
try {
  const response = await page.goto("http://localhost/portofolio_indra/", {
    waitUntil: "networkidle",
  });
  expect(response.status()).toBe(200);
  await page.waitForTimeout(1800);
  await expect(page.locator(".hero h1")).toContainText("My Portfolio");
  await page.evaluate(() => document.fonts.ready);
  expect(
    await page.evaluate(() => document.fonts.check('600 16px "Space Grotesk"')),
  ).toBe(true);
  check("Laravel, XAMPP redirect, local fonts");
  const card = page.locator(".physics-card");
  await expect(card.locator("img")).toHaveAttribute("src", /hero-watch.webp/);
  let box = await card.boundingBox(),
    before = await card.getAttribute("data-x");
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(
    box.x + box.width / 2 - 95,
    box.y + box.height / 2 + 50,
    { steps: 16 },
  );
  await page.waitForTimeout(180);
  expect(
    Math.abs(Number(await card.getAttribute("data-x")) - Number(before)),
  ).toBeGreaterThan(50);
  await page.mouse.up();
  await settle();
  check("Correct watch portrait; card follows real pointer drag");
  await page
    .getByRole("button", { name: "Atur ulang kartu", exact: true })
    .click();
  await page.getByRole("button", { name: "Putar", exact: true }).click();
  box = await card.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(
    box.x + box.width / 2 + 135,
    box.y + box.height / 2 + 15,
    { steps: 20 },
  );
  await page.waitForTimeout(200);
  expect(Number(await card.getAttribute("data-yaw"))).toBeGreaterThan(140);
  await page.mouse.up();
  await page
    .getByRole("button", { name: "Atur ulang kartu", exact: true })
    .click();
  check("Free card rotation, inertia and reset");
  const rope = await page.locator("#physics-rope").evaluate((path) => {
    const p = path.getPointAtLength(path.getTotalLength() * 0.5);
    const rect = path.ownerSVGElement.getBoundingClientRect();
    return { x: p.x + rect.x, y: p.y + rect.y };
  });
  before = await card.getAttribute("data-x");
  await page.mouse.move(rope.x, rope.y);
  await page.mouse.down();
  await page.mouse.move(rope.x - 80, rope.y + 35, { steps: 18 });
  await page.waitForTimeout(150);
  expect(
    Math.abs(Number(await card.getAttribute("data-x")) - Number(before)),
  ).toBeGreaterThan(40);
  await page.mouse.up();
  await page
    .getByRole("button", { name: "Atur ulang kartu", exact: true })
    .click();
  check("Dragging the strap moves the card");
  await page.screenshot({ path: ".qa/final-desktop-hero.png" });
  await page.getByRole("tab", { name: "Certificates", exact: true }).click();
  await expect(page.locator(".certificate-card")).toHaveCount(8);
  await page.getByRole("button", { name: "Kompetensi 1", exact: true }).click();
  await expect(page.locator(".certificate-card")).toHaveCount(1);
  await page.locator(".certificate-card").click();
  await expect(page.locator("dialog[open]")).toBeVisible();
  await page.getByRole("button", { name: "Perbesar sertifikat" }).click();
  await expect(page.locator(".certificate-viewer")).toHaveClass(/is-zoomed/);
  await page.keyboard.press("Escape");
  await expect(page.locator("dialog[open]")).toHaveCount(0);
  await page.getByRole("button", { name: "Semua 8", exact: true }).click();
  await page
    .locator(".certificate-card")
    .filter({ hasText: "Peran Pustakawan" })
    .click();
  await page
    .getByRole("button", { name: "Halaman sertifikat berikutnya" })
    .click();
  await expect(page.locator(".certificate-viewer img")).toHaveAttribute(
    "src",
    /materi.webp/,
  );
  await page.keyboard.press("Escape");
  await page.locator("#portfolio").scrollIntoViewIfNeeded();
  await settle();
  await page.screenshot({ path: ".qa/final-certificates.png" });
  check("8 certificates, category filter, zoom, multipage and Escape");
  await page.getByRole("tab", { name: "Achievements", exact: true }).click();
  await expect(page.locator(".achievement-card")).toHaveCount(3);
  await page.getByRole("button", { name: "Lihat dokumentasi" }).first().click();
  await expect(page.locator("dialog[open]")).toBeVisible();
  await page.keyboard.press("Escape");
  await page.getByRole("tab", { name: "Tech Stack", exact: true }).click();
  expect(await page.locator(".tech-card").count()).toBeGreaterThan(5);
  check("3 documented milestones and technology tab");
  await page.getByRole("tab", { name: "Projects", exact: true }).click();
  await expect(page.locator(".project-card")).toHaveCount(3);
  await page.locator(".project-detail-link").first().click();
  await expect(page).toHaveURL(/projects\/pyrorescue/);
  await page.reload();
  await expect(page.locator("h1")).toContainText("PyroRescue");
  check("Three projects and direct/reloaded detail route");
  await page.goto(base, { waitUntil: "networkidle" });
  await page.waitForTimeout(1300);
  await page.locator(".music-studio").scrollIntoViewIfNeeded();
  await settle();
  await expect(page.locator(".track-list button")).toHaveCount(10);
  await expect(page.locator(".youtube-screen iframe")).toHaveCount(0);
  await page.screenshot({ path: ".qa/final-music.png" });
  await page.getByRole("button", { name: "Acak lagu", exact: true }).click();
  await expect(page.locator(".youtube-screen iframe")).toHaveCount(1);
  const src = await page.locator(".youtube-screen iframe").getAttribute("src");
  expect(src).not.toContain("EHP-mktD8uE");
  await page.getByRole("button", { name: "Lagu berikutnya" }).click();
  expect(
    await page.locator(".youtube-screen iframe").getAttribute("src"),
  ).not.toBe(src);
  await page
    .getByRole("button", { name: "Tutup dan hentikan pemutar" })
    .click();
  await expect(page.locator(".youtube-screen iframe")).toHaveCount(0);
  check("10 tracks, explicit play, shuffle, next and stop (iframe controls)");
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await expect(page.locator(".email-contact a")).toHaveAttribute(
    "href",
    "mailto:mhmmadindrra@gmail.com",
  );
  await expect(
    page.getByRole("button", { name: "Lanjutkan ke Email" }),
  ).toBeVisible();
  await expect(page.locator(".guestbook-empty")).toBeVisible();
  const name = "QA " + Date.now();
  await page.locator("#guestName").fill(name);
  await page
    .locator("#comment")
    .fill("Verifikasi otomatis; catatan ini dihapus setelah pengujian.");
  await page.getByRole("button", { name: "Kirim Komentar" }).click();
  await expect(
    page.locator(".comment").filter({ hasText: name }),
  ).toBeVisible();
  const second = await browser.newContext();
  const other = await second.newPage();
  await other.goto(base, { waitUntil: "networkidle" });
  const own = await page.evaluate(
    async () =>
      await (
        await fetch(window.__PORTFOLIO__.baseUrl + "/api/guestbook")
      ).json(),
  );
  const id = own.find((c) => c.name === name).id;
  const otherResults = await other.evaluate(async (id) => {
    const r = window.__PORTFOLIO__,
      items = await (await fetch(r.baseUrl + "/api/guestbook")).json();
    const forbidden = await fetch(r.baseUrl + "/api/guestbook/" + id, {
      method: "DELETE",
      headers: { Accept: "application/json", "X-CSRF-TOKEN": r.csrf },
    });
    return {
      visible: items.find((c) => c.id === id)?.canDelete,
      forbidden: forbidden.status,
    };
  }, id);
  expect(otherResults).toEqual({ visible: false, forbidden: 403 });
  const noToken = await second.request.post(base + "/api/guestbook", {
    data: { name: "csrf", text: "rejected" },
    headers: { Accept: "application/json" },
  });
  expect(noToken.status()).toBe(419);
  await second.close();
  await page.getByRole("button", { name: `Hapus komentar ${name}` }).click();
  await expect(page.locator(".comment").filter({ hasText: name })).toHaveCount(
    0,
  );
  check("Public server guestbook, session ownership, CSRF and delete cleanup");
  await page.screenshot({ path: ".qa/final-contact.png" });
  await revealAll();
  await page.screenshot({ path: ".qa/final-desktop-full.png", fullPage: true });
  for (const width of [360, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(base);
    await page.waitForTimeout(1000);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth - innerWidth,
      ),
      `overflow at ${width}px`,
    ).toBeLessThanOrEqual(0);
    if (width === 390) {
      await revealAll();
      await page.screenshot({
        path: ".qa/final-mobile-full.png",
        fullPage: true,
      });
      await page.locator(".physics-stage").scrollIntoViewIfNeeded();
      await page.screenshot({ path: ".qa/final-mobile-card.png" });
    }
  }
  check("No horizontal overflow at 360 / 390 / 768 / 1024 / 1440 pixels");
  const optimizedAssets = await page.evaluate(async () =>
    Promise.all(
      [
        "assets/indra/about-cutout.webp",
        "assets/projects/pyrorescue/cover.webp",
        "assets/projects/siagagambut/cover.webp",
        "assets/projects/sipkos/cover.webp",
      ].map(async (path) => {
        const response = await fetch(`/portofolio_indra/public/${path}`);
        return {
          path,
          status: response.status,
          type: response.headers.get("content-type"),
        };
      }),
    ),
  );
  expect(
    optimizedAssets.every(
      (asset) => asset.status === 200 && asset.type?.includes("image/webp"),
    ),
  ).toBe(true);
  check("New portrait and all optimized project images load as WebP");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("html")).toHaveAttribute("data-motion", "false");
  await card.focus();
  await page.keyboard.press("Home");
  await page.waitForTimeout(100);
  await page.keyboard.press("ArrowRight");
  await page.waitForFunction(
    () =>
      Number(
        document.querySelector(".physics-card")?.getAttribute("data-yaw"),
      ) > 0,
  );
  expect(Number(await card.getAttribute("data-yaw"))).toBeGreaterThan(0);
  check("Reduced motion and keyboard card controls");
  expect(errors).toEqual([]);
  expect(failures).toEqual([]);
  check("No application JavaScript errors or build-asset HTTP errors");
  fs.writeFileSync(
    ".qa/laravel-browser-results.json",
    JSON.stringify({ checks, errors, failures }, null, 2),
  );
} finally {
  await browser.close();
}
