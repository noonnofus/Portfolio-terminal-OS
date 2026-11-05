import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { readProjectDocument } from "../src/features/portfolio/content/projectMetadata";
import koPortfolio from "../src/features/portfolio/i18n/ko/PortfolioContent.json";
import enPortfolio from "../src/features/portfolio/i18n/en/PortfolioContent.json";
import { DEFAULT_UI_PREFERENCES, encodeUiPreferences, UI_PREFERENCES_COOKIE } from "../src/lib/preferences/uiPreferences";
import { projectSlugs } from "../src/features/portfolio/types/projectTypes";
import { SITE_URL } from "../src/lib/seo/siteMetadata";

test("serves a static llms guide independently of visitor cookies and supports HEAD", async ({ request }) => {
  const response = await request.get("/llms.txt");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toBe("text/plain; charset=utf-8");
  expect(response.headers()["set-cookie"]).toBeUndefined();
  expect(response.headers()["cache-control"]).not.toContain("private");
  const text = await response.text();
  expect(text).toContain("## Korean");
  expect(text).toContain("## English");
  expect(text).not.toContain("<!DOCTYPE html>");

  const withCookie = await request.get("/llms.txt", { headers: {
    Cookie: `${UI_PREFERENCES_COOKIE}=${encodeUiPreferences({ ...DEFAULT_UI_PREFERENCES, colorMode: "dark", wallpaper: "tahoe_dark", dockAutoHide: true })}`,
    "Accept-Language": "ko",
  } });
  expect(withCookie.status()).toBe(200);
  expect(await withCookie.text()).toBe(text);
  expect(withCookie.headers()["set-cookie"]).toBeUndefined();

  const head = await request.head("/llms.txt");
  expect(head.status()).toBe(200);
  expect(head.headers()["content-type"]).toBe("text/plain; charset=utf-8");
  expect(head.headers()["set-cookie"]).toBeUndefined();
  expect(await head.body()).toHaveLength(0);
});

test.describe("llms guide discovery without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("links to all 16 canonical profile and project pages with readable content", async ({ request, page }) => {
    const response = await request.get("/llms.txt");
    expect(response.status()).toBe(200);
    const text = await response.text();
    const links = [...text.matchAll(/^- \[[^\]]+\]\(([^)]+)\): /gm)].map(match => new URL(match[1]));
    expect(links).toHaveLength(18);
    const internal = links.filter(url => url.origin === SITE_URL);
    const expected = ["", "/en"].flatMap(prefix => [
      `${SITE_URL}${prefix}/desktop`,
      ...projectSlugs.map(slug => `${SITE_URL}${prefix}/desktop?app=project&slug=${slug}`),
    ]);
    expect(internal.map(url => url.href).sort()).toEqual(expected.sort());
    for (const url of internal) {
      const result = await page.goto(`${url.pathname}${url.search}`);
      expect(result?.status()).toBe(200);
      const lang = url.pathname.startsWith("/en/") ? "en" : "ko";
      const slug = url.searchParams.get("slug");
      const article = page.locator(`[data-window-id="${slug ? `project:${slug}` : "about"}"] article`);
      await expect(article).toBeVisible();
      await expect(article).toHaveAttribute("lang", lang);
      if (slug) {
        const { metadata } = readProjectDocument(readFileSync(join(
          process.cwd(), "src/features/portfolio/content/markdown", lang, `${slug}.md`,
        ), "utf8"));
        await expect(article.locator("h2")).toHaveText(metadata.title);
        await expect(article).toContainText(metadata.summary);
      } else {
        const content = lang === "ko" ? koPortfolio : enPortfolio;
        await expect(article).toContainText(content.profile.summary[0]);
      }
    }
  });
});

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

test("serves 18 sitemap URLs with both canonical versions of each project", async ({ request, page }) => {
  const response = await request.get("/sitemap.xml");
  expect(response.ok()).toBe(true);
  const xml = await response.text();
  const parsed = await page.evaluate(markup => {
    const document = new DOMParser().parseFromString(markup, "application/xml");
    return {
      error: document.querySelector("parsererror")?.textContent ?? null,
      entries: Array.from(document.getElementsByTagNameNS("http://www.sitemaps.org/schemas/sitemap/0.9", "url"), entry => ({
        url: entry.getElementsByTagNameNS("http://www.sitemaps.org/schemas/sitemap/0.9", "loc")[0]?.textContent,
        alternates: Array.from(entry.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "link"), link => ({
          rel: link.getAttribute("rel"),
          lang: link.getAttribute("hreflang"),
          url: link.getAttribute("href"),
        })),
      })),
    };
  }, xml);
  expect(parsed.error).toBeNull();
  const locations = parsed.entries.map(entry => entry.url);
  expect(locations).toHaveLength(18);
  expect(new Set(locations).size).toBe(18);
  for (const slug of projectSlugs) {
    const alternates = [
      { rel: "alternate", lang: "ko", url: `${SITE_URL}/desktop?app=project&slug=${slug}` },
      { rel: "alternate", lang: "en", url: `${SITE_URL}/en/desktop?app=project&slug=${slug}` },
    ];
    for (const alternate of alternates) {
      expect(parsed.entries.find(entry => entry.url === alternate.url)?.alternates).toEqual(alternates);
    }
  }
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
