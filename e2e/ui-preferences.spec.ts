import { expect, test, type BrowserContext, type Page } from "@playwright/test";
import { DEFAULT_UI_PREFERENCES, UI_PREFERENCES_COOKIE, decodeUiPreferences, encodeUiPreferences, type UiPreferences } from "../src/lib/preferences/uiPreferences";
import { enabledProjectSlugs, requireProjects } from "./projectAvailability";

const selected: UiPreferences = { ...DEFAULT_UI_PREFERENCES, colorMode: "dark", wallpaper: "tahoe_dark", dockAutoHide: true };

async function seed(context: BrowserContext, baseURL: string, preferences = selected) {
  await context.addCookies([{ name: UI_PREFERENCES_COOKIE, value: encodeUiPreferences(preferences), url: baseURL }]);
}

async function saved(context: BrowserContext) {
  return decodeUiPreferences((await context.cookies()).find(cookie => cookie.name === UI_PREFERENCES_COOKIE)?.value);
}

async function geometry(page: Page) {
  return page.evaluate(() => {
    const window = document.querySelector<HTMLElement>('[data-window-id="project:kepco"]')!;
    const rect = (element: Element) => {
      const { x, y, width, height } = element.getBoundingClientRect();
      return { x, y, width, height };
    };
    return {
      window: rect(window),
      background: getComputedStyle(window).backgroundColor,
      radius: getComputedStyle(window).borderRadius,
      icons: [...document.querySelectorAll(".directory-surface--desktop .directory-item")].map(rect),
      badges: [...document.querySelectorAll("article img.ui-theme-image-dark, article img.ui-theme-image-light, article img.ui-theme-invert")].map(image => ({
        src: image.getAttribute("src"), display: getComputedStyle(image).display, filter: getComputedStyle(image).filter,
      })),
    };
  });
}

test.describe("cookie preferences without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  for (const colorMode of ["light", "dark"] as const) {
    test(`${colorMode} renders saved appearance and every localized project from the server`, async ({ page, context, baseURL }) => {
      await seed(context, baseURL!, { ...selected, colorMode });
      for (const language of ["ko", "en"]) {
        for (const slug of enabledProjectSlugs) {
          const response = await page.goto(`${language === "ko" ? "" : "/en"}/desktop?app=project&slug=${slug}`);
          expect(response?.status()).toBe(200);
          await expect(page.locator("html")).toHaveClass(colorMode);
          await expect(page.locator(".application-shell")).toHaveAttribute("data-wallpaper", "tahoe_dark");
          await expect(page.locator(".application-wallpaper-media img")).toHaveAttribute("src", /tahoe_dark\.jpg/);
          await expect(page.getByRole("navigation", { name: "Applications" })).toHaveAttribute("data-auto-hide", "true");
          const article = page.locator(`[data-window-id="project:${slug}"] article`);
          await expect(article).toBeVisible();
          await expect(article).toHaveAttribute("lang", language);
          await expect(page.locator(".application-window")).not.toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
          expect(response?.headers()["cache-control"]).toContain("private");
        }
      }
    });
  }
});

for (const width of [390, 639, 640, 1024, 1440]) {
  test(`keeps first window and shortcut geometry at ${width}px through hydration`, async ({ page, context, baseURL }) => {
    requireProjects("kepco");
    await page.setViewportSize({ width, height: 768 });
    await seed(context, baseURL!);
    let release!: () => void;
    const ready = new Promise<void>(resolve => { release = resolve; });
    await page.route("**/*.js*", async route => { await ready; await route.continue(); });
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => { if (/hydration|did not match/i.test(message.text())) errors.push(message.text()); });
    try {
      await page.goto("/desktop?app=project&slug=kepco", { waitUntil: "commit" });
      const article = page.locator("article");
      await expect(article).toBeVisible();
      const before = await geometry(page);
      const node = await article.elementHandle();
      release();
      await expect(page.locator('[data-window-id="project:kepco"] button').first()).toBeEnabled();
      await expect(page.locator(".directory-surface--desktop [role=grid]")).toHaveAttribute("aria-colcount", width < 640 ? "1" : "2");
      const after = await geometry(page);
      expect(after.background).toBe(before.background);
      expect(after.radius).toBe(before.radius);
      expect(after.badges).toEqual(before.badges);
      for (const key of ["x", "y", "width", "height"] as const) {
        expect(Math.abs(after.window[key] - before.window[key])).toBeLessThan(1);
        after.icons.forEach((icon, index) => expect(Math.abs(icon[key] - before.icons[index][key])).toBeLessThan(1));
      }
      expect(await article.evaluate((element, initial) => element.isSameNode(initial), node)).toBe(true);
      const grid = page.locator(".directory-surface--desktop [role=grid]");
      await expect(grid.getByRole("row").first()).toBeAttached();
      const buttons = grid.locator(".directory-item");
      await buttons.first().focus();
      await page.keyboard.press(width < 640 ? "ArrowDown" : "ArrowRight");
      await expect(buttons.nth(1)).toBeFocused();
      expect(errors).toEqual([]);
    } finally { release(); }
  });
}

for (const os of ["light", "dark"] as const) {
  test(`resolves auto before scripts hydrate with OS ${os}`, async ({ page, context, baseURL }) => {
    requireProjects("portfolio");
    await page.emulateMedia({ colorScheme: os });
    await seed(context, baseURL!, { ...selected, colorMode: "auto" });
    let release!: () => void;
    const ready = new Promise<void>(resolve => { release = resolve; });
    await page.route("**/*.js*", async route => { await ready; await route.continue(); });
    try {
      await page.goto("/desktop?app=project&slug=portfolio", { waitUntil: "commit" });
      await expect(page.locator("article")).toBeVisible();
      await expect(page.locator("html")).toHaveClass(os);
      const variants = page.locator("article img.ui-theme-image-dark");
      expect(await variants.count()).toBeGreaterThan(0);
      const state = await variants.evaluateAll(images => images.map(image => getComputedStyle(image).display));
      expect(state.every(display => os === "dark" ? display !== "none" : display === "none")).toBe(true);
      release();
      await expect(page.locator('[data-window-id="project:portfolio"] button').first()).toBeEnabled();
      expect(await variants.evaluateAll(images => images.map(image => getComputedStyle(image).display))).toEqual(state);
      await expect(page.locator("html")).toHaveClass(os);
      await page.emulateMedia({ colorScheme: os === "dark" ? "light" : "dark" });
      await expect(page.locator("html")).toHaveClass(os === "dark" ? "light" : "dark");
      expect((await saved(context))?.colorMode).toBe("auto");
    } finally { release(); }
  });
}

test("catches cookie changes made after the server response but before subscriptions", async ({ page, context, baseURL }) => {
  requireProjects("kepco");
  await seed(context, baseURL!, DEFAULT_UI_PREFERENCES);
  let release!: () => void;
  const ready = new Promise<void>(resolve => { release = resolve; });
  await page.route("**/*.js*", async route => { await ready; await route.continue(); });
  try {
    await page.goto("/desktop?app=project&slug=kepco", { waitUntil: "commit" });
    await expect(page.locator("article")).toBeVisible();
    await seed(context, baseURL!);
    release();
    await expect(page.locator('[data-window-id="project:kepco"] button').first()).toBeEnabled();
    await expect(page.locator("html")).toHaveClass("dark");
    await expect(page.locator(".application-shell")).toHaveAttribute("data-wallpaper", "tahoe_dark");
    await expect(page.getByRole("navigation", { name: "Applications" })).toHaveAttribute("data-auto-hide", "true");
    expect(await saved(context)).toEqual(selected);
  } finally { release(); }
});

test("preserves keyboard focus chosen before hydration", async ({ page }) => {
  requireProjects("mcp");
  let release!: () => void;
  const ready = new Promise<void>(resolve => { release = resolve; });
  await page.route("**/*.js*", async route => { await ready; await route.continue(); });
  try {
    await page.goto("/en/desktop?app=project&slug=mcp", { waitUntil: "commit" });
    const opener = page.getByRole("button", { name: /^View larger image:/ }).first();
    await opener.focus();
    await expect(opener).toBeFocused();
    release();
    await expect(page.locator('[data-window-id="project:mcp"] button').first()).toBeEnabled();
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    await expect(opener).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator('[data-window-id="project:mcp"]').getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(opener).toBeFocused();
  } finally { release(); }
});

test("migrates legacy settings with one reload, preserving URL and unrelated storage", async ({ page, context }) => {
  requireProjects("kepco");
  let documents = 0;
  page.on("request", request => { if (request.isNavigationRequest() && request.frame() === page.mainFrame()) documents++; });
  await page.addInitScript(() => {
    if (!sessionStorage.getItem("legacy-seeded")) {
      localStorage.setItem("theme", "dark");
      localStorage.setItem("desktop:preferences", JSON.stringify({ version: 1, preferences: { language: "en", wallpaper: "tahoe_dark", dockAutoHide: true } }));
      localStorage.setItem("unrelated", "keep");
      sessionStorage.setItem("legacy-seeded", "1");
    }
  });
  await page.goto("/desktop?app=project&slug=kepco");
  await expect(page.locator("html")).toHaveClass("dark");
  await expect(page.locator("article")).toHaveAttribute("lang", "ko");
  await expect(page).toHaveURL(/\/desktop\?app=project&slug=kepco$/);
  await expect.poll(() => documents).toBe(2);
  expect(await saved(context)).toEqual(selected);
  expect(await page.evaluate(() => [localStorage.getItem("theme"), localStorage.getItem("desktop:preferences"), localStorage.getItem("unrelated")])).toEqual([null, null, "keep"]);
  await page.reload();
  await expect(page.locator("article")).toHaveAttribute("lang", "ko");
  expect(documents).toBe(3);
});

test("valid cookies win over conflicting legacy preferences", async ({ page, context, baseURL }) => {
  requireProjects("kepco");
  await seed(context, baseURL!);
  await page.addInitScript(() => localStorage.setItem("theme", "light"));
  await page.goto("/desktop?app=project&slug=kepco");
  await expect(page.locator("html")).toHaveClass("dark");
  await expect(page.locator(".application-shell")).toHaveAttribute("data-wallpaper", "tahoe_dark");
  expect(await page.evaluate(() => localStorage.getItem("theme"))).toBe("light");
  expect(await saved(context)).toEqual(selected);
});

test("blocked cookie writes preserve legacy settings without reload and allow runtime changes", async ({ page }) => {
  let documents = 0;
  page.on("request", request => { if (request.isNavigationRequest() && request.frame() === page.mainFrame()) documents++; });
  await page.addInitScript(() => {
    Object.defineProperty(document, "cookie", { configurable: true, get: () => "", set: () => undefined });
    localStorage.setItem("theme", "dark");
  });
  await page.goto("/desktop?app=settings");
  const settings = page.getByRole("dialog", { name: "설정" });
  await settings.getByRole("button", { name: "화면 모드" }).click();
  await settings.getByRole("button", { name: "다크 모드" }).click();
  await expect(page.locator("html")).toHaveClass("dark");
  await settings.getByRole("button", { name: /Tahoe Light/ }).click();
  await expect(page.locator(".application-shell")).toHaveAttribute("data-wallpaper", "tahoe_light");
  expect(await page.evaluate(() => localStorage.getItem("theme"))).toBe("dark");
  expect(documents).toBe(1);
});

test("syncs tabs and persisted pageshow without losing partial fields or changing language", async ({ page, context, baseURL }) => {
  await seed(context, baseURL!, DEFAULT_UI_PREFERENCES);
  await page.goto("/desktop?app=settings");
  const english = await context.newPage();
  await english.goto("/en/desktop?app=settings");
  const enSettings = english.getByRole("dialog", { name: "Settings" });
  await enSettings.getByRole("button", { name: "Display" }).click();
  await enSettings.getByRole("button", { name: /Tahoe Dark/ }).click();
  await expect(page.locator(".application-shell")).toHaveAttribute("data-wallpaper", "tahoe_dark");
  const koSettings = page.getByRole("dialog", { name: "설정" });
  await koSettings.getByRole("button", { name: "화면 모드" }).click();
  await koSettings.getByRole("button", { name: "다크 모드" }).click();
  await expect(english.locator("html")).toHaveClass("dark");
  await enSettings.getByRole("button", { name: "General" }).click();
  await enSettings.getByRole("button", { name: "Auto hide" }).click();
  await expect(page.getByRole("navigation", { name: "Applications" })).toHaveAttribute("data-auto-hide", "true");
  expect(await saved(context)).toEqual(selected);
  await expect(page).toHaveURL(/\/desktop\?app=settings$/);
  await expect(english).toHaveURL(/\/en\/desktop\?app=settings$/);
  await seed(context, baseURL!, { ...DEFAULT_UI_PREFERENCES, wallpaper: "tahoe_light" });
  await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent("pageshow", { persisted: true })));
  await expect(page.locator("html")).toHaveClass("light");
  await expect(page.locator(".application-shell")).toHaveAttribute("data-wallpaper", "tahoe_light");
  await expect(page.getByRole("navigation", { name: "Applications" })).toHaveAttribute("data-auto-hide", "false");
  expect(await saved(context)).toEqual({ ...DEFAULT_UI_PREFERENCES, wallpaper: "tahoe_light" });
});

test("preserves a fresh cookie field when the runtime has not received its notification", async ({ page, context, baseURL }) => {
  // Exercise a browser without native cookie events, before its channel notification arrives.
  await page.addInitScript(() => Object.defineProperty(window, "cookieStore", { value: undefined }));
  await seed(context, baseURL!, DEFAULT_UI_PREFERENCES);
  await page.goto("/desktop?app=settings");
  const settings = page.getByRole("dialog", { name: "설정" });
  await settings.getByRole("button", { name: "화면 모드" }).click();
  await seed(context, baseURL!, { ...DEFAULT_UI_PREFERENCES, dockAutoHide: true });
  await settings.getByRole("button", { name: /Tahoe Light/ }).click();
  expect(await saved(context)).toEqual({ ...DEFAULT_UI_PREFERENCES, wallpaper: "tahoe_light", dockAutoHide: true });
  await expect(page.getByRole("navigation", { name: "Applications" })).toHaveAttribute("data-auto-hide", "true");
});

test("isolates appearance across browser contexts and server requests", async ({ browser, baseURL }) => {
  requireProjects("kepco");
  const a = await browser.newContext({ javaScriptEnabled: false });
  const b = await browser.newContext({ javaScriptEnabled: false });
  try {
    await seed(a, baseURL!);
    await seed(b, baseURL!, { ...DEFAULT_UI_PREFERENCES, wallpaper: "tahoe_light" });
    const pa = await a.newPage();
    const pb = await b.newPage();
    await Promise.all([pa.goto(`${baseURL}/desktop?app=project&slug=kepco`), pb.goto(`${baseURL}/desktop?app=project&slug=kepco`)]);
    await expect(pa.locator("html")).toHaveClass("dark");
    await expect(pb.locator("html")).toHaveClass("light");
    await expect(pa.locator(".application-shell")).toHaveAttribute("data-wallpaper", "tahoe_dark");
    await expect(pb.locator(".application-shell")).toHaveAttribute("data-wallpaper", "tahoe_light");
  } finally { await a.close(); await b.close(); }
});
