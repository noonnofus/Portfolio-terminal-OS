import { expect, test } from "@playwright/test";
import { projectSlugs } from "../src/features/portfolio/types/projectTypes";
import { SITE_URL } from "../src/lib/seo/siteMetadata";

test.describe("project discovery without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  for (const language of ["ko", "en"] as const) {
    test(`${language} exposes a path from Desktop to the folder and all projects`, async ({ page }) => {
      const base = language === "en" ? "/en/desktop" : "/desktop";
      await page.goto(base);
      const folderLink = page.locator('.directory-surface--desktop a[href$="app=projects"]');
      await expect(folderLink).toBeVisible();
      await folderLink.click();
      await expect(page).toHaveURL(`${base}?app=projects`);
      const folder = page.locator('[data-window-id="projects"]');
      await expect(folder).toBeVisible();
      await expect(folder.getByRole("link")).toHaveCount(projectSlugs.length);
      for (const slug of projectSlugs) {
        await expect(folder.locator(`a[href="${base}?app=project&slug=${slug}"]`)).toHaveCount(1);
      }
      await folder.locator(`a[href="${base}?app=project&slug=kepco"]`).click();
      await expect(page.locator("article")).toBeVisible();
      await expect(page.locator("article")).toHaveAttribute("lang", language);
    });
  }
});

test("serves 18 sitemap URLs with both canonical versions of each project", async ({ request }) => {
  const response = await request.get("/sitemap.xml");
  expect(response.ok()).toBe(true);
  const xml = await response.text();
  const locations = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1].replaceAll("&amp;", "&"));
  expect(locations).toHaveLength(18);
  expect(new Set(locations).size).toBe(18);
  for (const slug of projectSlugs) {
    for (const prefix of ["", "/en"]) expect(locations).toContain(`${SITE_URL}${prefix}/desktop?app=project&slug=${slug}`);
  }
  expect(xml).toContain('hreflang="ko"');
  expect(xml).toContain('hreflang="en"');
});

for (const button of ["left", "middle"] as const) {
  test(`preserves native link navigation with ${button === "left" ? "a modifier" : "middle click"}`, async ({ page, context, browserName }) => {
    await page.goto("/en/desktop?app=projects");
    const link = page.locator('[data-window-id="projects"] a[href$="slug=kepco"]');
    await expect(page.locator('[data-window-id="projects"] button').first()).toBeEnabled();
    // This WebKit runner follows middle-click anchors in the current tab, including plain native anchors.
    if (browserName === "webkit" && button === "middle") {
      await link.click({ button: "middle" });
      await expect(page).toHaveURL(/\/en\/desktop\?app=project&slug=kepco$/);
      return;
    }
    const popupPromise = context.waitForEvent("page");
    await link.click(button === "left" ? { modifiers: ["ControlOrMeta"] } : { button: "middle" });
    const popup = await popupPromise;
    await expect(popup).toHaveURL(/\/en\/desktop\?app=project&slug=kepco$/);
    await expect(popup.locator("article")).toHaveAttribute("lang", "en");
    await expect(page).toHaveURL(/\/en\/desktop\?app=projects$/);
    await popup.close();
  });
}

test("hydrates the same folder and uses existing History for keyboard link activation", async ({ page }) => {
  let release!: () => void;
  const ready = new Promise<void>(resolve => { release = resolve; });
  await page.route("**/*.js*", async route => { await ready; await route.continue(); });
  try {
    await page.goto("/desktop?app=projects", { waitUntil: "commit" });
    const folder = page.locator('[data-window-id="projects"]');
    await expect(folder).toBeVisible();
    const initial = await folder.elementHandle();
    const before = await folder.locator(".directory-item").evaluateAll(nodes => nodes.map(node => {
      const { x, y } = node.getBoundingClientRect();
      return { x, y };
    }));
    release();
    await expect(folder.getByRole("button", { name: "프로젝트 close" })).toBeEnabled();
    expect(await folder.evaluate((node, original) => node.isSameNode(original), initial)).toBe(true);
    const after = await folder.locator(".directory-item").evaluateAll(nodes => nodes.map(node => {
      const { x, y } = node.getBoundingClientRect();
      return { x, y };
    }));
    after.forEach((point, index) => {
      expect(Math.abs(point.x - before[index].x)).toBeLessThan(1);
      expect(Math.abs(point.y - before[index].y)).toBeLessThan(1);
    });
    await folder.evaluate(node => node.setAttribute("data-instance", "preserved"));
    const link = folder.locator('a[href$="slug=kepco"]');
    await link.focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/app=project&slug=kepco$/);
    await expect(page.locator("article")).toBeVisible();
    await page.goBack();
    await expect(page).toHaveURL(/app=projects$/);
    await expect(folder).toHaveAttribute("data-instance", "preserved");
  } finally { release(); }
});
