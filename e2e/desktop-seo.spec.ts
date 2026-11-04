import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test, type Page } from "@playwright/test";
import { readProjectDocument } from "../src/features/portfolio/content/projectMetadata";
import { projectSlugs, type ProjectSlug } from "../src/features/portfolio/types/projectTypes";
import { languages, type Language } from "../src/lib/i18n/language";
import { SITE_URL } from "../src/lib/seo/siteMetadata";
import koPortfolio from "../src/features/portfolio/i18n/ko/PortfolioContent.json";
import enPortfolio from "../src/features/portfolio/i18n/en/PortfolioContent.json";
import { DEFAULT_UI_PREFERENCES, encodeUiPreferences, UI_PREFERENCES_COOKIE } from "../src/lib/preferences/uiPreferences";

function projectMetadata(slug: ProjectSlug, language: Language) {
  return readProjectDocument(readFileSync(join(
    process.cwd(), "src/features/portfolio/content/markdown", language, `${slug}.md`,
  ), "utf8")).metadata;
}

async function readMetadata(page: Page, html: string) {
  return page.evaluate((markup) => {
    const doc = new DOMParser().parseFromString(markup, "text/html");
    const meta = (selector: string) => Array.from(
      doc.querySelectorAll<HTMLMetaElement>(selector), (node) => node.content,
    );
    const links = (selector: string) => Array.from(
      doc.querySelectorAll(selector), (node) => node.getAttribute("href"),
    );

    return {
      titles: Array.from(doc.querySelectorAll("title"), (node) => node.textContent),
      descriptions: meta('meta[name="description"]'),
      canonicals: links('link[rel="canonical"]'),
      ko: links('link[rel="alternate"][hreflang="ko"]'),
      en: links('link[rel="alternate"][hreflang="en"]'),
      ogTitles: meta('meta[property="og:title"]'),
      ogDescriptions: meta('meta[property="og:description"]'),
      ogUrls: meta('meta[property="og:url"]'),
      twitterTitles: meta('meta[name="twitter:title"]'),
      twitterDescriptions: meta('meta[name="twitter:description"]'),
      robots: meta('meta[name="robots"]'),
      headCanonicalCount: doc.head.querySelectorAll('link[rel="canonical"]').length,
      profiles: Array.from(doc.querySelectorAll('script[type="application/ld+json"]'),
        node => JSON.parse(node.textContent ?? "")),
    };
  }, html);
}

function expectProjectMetadata(
  actual: Awaited<ReturnType<typeof readMetadata>>,
  slug: ProjectSlug,
  language: Language,
) {
  const project = projectMetadata(slug, language);
  const title = `${project.title} | ${language === "ko" ? "김현호" : "Hyunho Kim"}`;
  const path = `${language === "ko" ? "/desktop" : "/en/desktop"}?app=project&slug=${slug}`;

  expect(actual).toMatchObject({
    titles: [title],
    descriptions: [project.summary],
    canonicals: [`${SITE_URL}${path}`],
    ko: [`${SITE_URL}/desktop?app=project&slug=${slug}`],
    en: [`${SITE_URL}/en/desktop?app=project&slug=${slug}`],
    ogTitles: [title],
    ogDescriptions: [project.summary],
    ogUrls: [`${SITE_URL}${path}`],
    twitterTitles: [title],
    twitterDescriptions: [project.summary],
  });
}

test.describe("Desktop server metadata", () => {
  for (const language of languages) {
    test(`publishes every ${language} project in the initial HTML for sharing`, async ({ page, request }) => {
      for (const slug of projectSlugs) {
        const path = language === "ko" ? "/desktop" : "/en/desktop";
        const response = await request.get(`${path}?app=project&slug=${slug}`, {
          headers: { "User-Agent": "facebookexternalhit/1.1" },
        });
        expect(response.status()).toBe(200);
        const actual = await readMetadata(page, await response.text());
        expectProjectMetadata(actual, slug, language);
        expect(actual.headCanonicalCount).toBe(1);
      }
    });

    test(`renders the ${language} project with its request metadata`, async ({ page }) => {
      const path = language === "ko" ? "/desktop" : "/en/desktop";
      await page.goto(`${path}?app=project&slug=kepco`);
      const project = projectMetadata("kepco", language);
      await expect(page).toHaveTitle(`${project.title} | ${language === "ko" ? "김현호" : "Hyunho Kim"}`);
      await expect(page.getByRole("dialog", { name: project.title, exact: true })).toBeVisible();
      expectProjectMetadata(await readMetadata(page, await page.content()), "kepco", language);
    });
  }

  for (const userAgent of ["Mozilla/5.0", "Googlebot"]) {
    test(`includes metadata in the full response for ${userAgent}`, async ({ page, request }) => {
      const response = await request.get("/desktop?app=project&slug=kepco&utm_source=shared", {
        headers: { "User-Agent": userAgent },
      });
      expect(response.status()).toBe(200);
      expectProjectMetadata(await readMetadata(page, await response.text()), "kepco", "ko");
    });
  }

  test("preserves entry metadata, Desktop defaults and the auth noindex", async ({ page, request }) => {
    for (const [path, canonical] of [
      ["/", SITE_URL],
      ["/en", `${SITE_URL}/en`],
      ["/desktop", `${SITE_URL}/desktop`],
      ["/en/desktop", `${SITE_URL}/en/desktop`],
      ["/desktop?app=project&slug=missing", `${SITE_URL}/desktop`],
    ]) {
      const response = await request.get(path, { headers: { "User-Agent": "facebookexternalhit/1.1" } });
      expect(response.status()).toBe(200);
      const actual = await readMetadata(page, await response.text());
      expect(actual.titles).toHaveLength(1);
      expect(actual.canonicals).toEqual([canonical]);
    }

    const response = await request.get("/auth/auth-error");
    expect(response.status()).toBe(200);
    const actual = await readMetadata(page, await response.text());
    expect(actual.robots).toEqual(["noindex, nofollow"]);
  });
});

async function expectCurrentProjectMetadata(
  page: Page,
  slug: ProjectSlug,
  language: Language,
) {
  await expect(async () => {
    expectProjectMetadata(await readMetadata(page, await page.content()), slug, language);
    await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
    await expect(page.locator('meta[name="twitter:image"]')).toHaveCount(1);
    const locale = page.locator('meta[property="og:locale"]');
    await expect(locale).toHaveCount(1);
    await expect(locale).toHaveAttribute("content", language === "ko" ? "ko_KR" : "en_US");
  }).toPass({ timeout: 5000 });
}

test("keeps project metadata and Desktop entries through back and forward", async ({ page }) => {
  await page.goto("/desktop?app=project&slug=kepco");
  await expect(page.locator('[data-window-id="project:kepco"] button').first()).toBeEnabled();
  const kepco = page.getByRole("dialog", {
    name: projectMetadata("kepco", "ko").title,
    exact: true,
  });
  await expect(kepco).toBeVisible();
  await expectCurrentProjectMetadata(page, "kepco", "ko");
  await kepco.evaluate((node) => node.setAttribute("data-seo-runtime", "preserved"));
  const kepcoEntry = await page.evaluate(() => JSON.stringify(window.history.state.desktop));

  await page.getByRole("navigation", { name: "Applications" })
    .getByRole("button", { name: "프로젝트", exact: true }).click();
  await page.getByRole("link", { name: "WCHMS 프로젝트 열기", exact: true }).dblclick();
  await expect(page).toHaveURL(/app=project&slug=wchms$/);
  await expectCurrentProjectMetadata(page, "wchms", "ko");
  const wchmsEntry = await page.evaluate(() => JSON.stringify(window.history.state.desktop));

  await page.goBack();
  await expect(page).toHaveURL(/app=projects$/);
  await page.goBack();
  await expect(page).toHaveURL(/app=project&slug=kepco$/);
  await expectCurrentProjectMetadata(page, "kepco", "ko");
  expect(await page.evaluate(() => JSON.stringify(window.history.state.desktop))).toBe(kepcoEntry);
  await expect(kepco).toHaveAttribute("data-seo-runtime", "preserved");

  await page.goForward();
  await expect(page).toHaveURL(/app=projects$/);
  await page.goForward();
  await expect(page).toHaveURL(/app=project&slug=wchms$/);
  await expectCurrentProjectMetadata(page, "wchms", "ko");
  expect(await page.evaluate(() => JSON.stringify(window.history.state.desktop))).toBe(wchmsEntry);
});

for (const delayed of [false, true]) {
  test(`keeps URL language over persisted language with delayed scripts=${delayed}`, async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("desktop:preferences", JSON.stringify({
      version: 1, preferences: { language: "en", wallpaper: "golden_gate_light", dockAutoHide: false },
    })));
    if (delayed) {
      await page.route("**/*.js*", async route => {
        await new Promise(resolve => setTimeout(resolve, 150));
        await route.continue();
      });
    }
    await page.goto("/desktop?app=project&slug=kepco", { waitUntil: "commit" });
    await expect(page).toHaveURL(/\/desktop\?app=project&slug=kepco$/);
    await expectCurrentProjectMetadata(page, "kepco", "ko");
    await page.waitForLoadState("load");
    await expectCurrentProjectMetadata(page, "kepco", "ko");
  });
}

test("restores project metadata on persisted pageshow", async ({ page }) => {
  await page.goto("/desktop?app=project&slug=kepco");
  await expect(page.locator('[data-window-id="project:kepco"] button').first()).toBeEnabled();
  await expectCurrentProjectMetadata(page, "kepco", "ko");
  await page.evaluate(() => {
    window.history.replaceState(window.history.state, "", "/en/desktop?app=project&slug=wchms");
    window.dispatchEvent(new PageTransitionEvent("pageshow", { persisted: true }));
  });
  await expectCurrentProjectMetadata(page, "wchms", "en");
});

for (const action of ["close", "minimize"]) {
  test(`updates default metadata after project ${action}`, async ({ page }) => {
    await page.goto("/desktop?app=project&slug=kepco");
    const dialog = page.getByRole("dialog", { name: projectMetadata("kepco", "ko").title, exact: true });
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: `${projectMetadata("kepco", "ko").title} ${action}`, exact: true }).click();
    await expect(page).not.toHaveURL(/app=project&slug=kepco/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `${SITE_URL}/desktop`);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", `${SITE_URL}/desktop`);
  });
}

for (const queued of [false, true]) {
  test(`handles back timeout and late popstate with queued navigation=${queued}`, async ({ page }) => {
    await page.goto("/desktop?app=projects");
    await page.getByRole("link", { name: "한국전력 상담 어드바이저 프로젝트 열기", exact: true }).dblclick();
    await expectCurrentProjectMetadata(page, "kepco", "ko");
    const stale = await page.evaluate(() => {
      window.history.back = () => undefined;
      return window.history.state;
    });
    const dialog = page.getByRole("dialog", { name: projectMetadata("kepco", "ko").title, exact: true });
    await dialog.getByRole("button", { name: `${projectMetadata("kepco", "ko").title} close`, exact: true }).click();
    if (queued) {
      await page.getByRole("navigation", { name: "Applications" }).getByRole("button", { name: "설정", exact: true }).click();
    }
    await expect(page).toHaveURL(queued ? /app=settings$/ : /app=projects$/);
    const restoredEntry = await page.evaluate(() => JSON.stringify(window.history.state.desktop));
    await page.evaluate(state => window.dispatchEvent(new PopStateEvent("popstate", { state })), stale);
    await expect(page).toHaveURL(queued ? /app=settings$/ : /app=projects$/);
    expect(await page.evaluate(() => JSON.stringify(window.history.state.desktop))).toBe(restoredEntry);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `${SITE_URL}/desktop`);
  });
}

test("changes language and preserves the running terminal", async ({ page }) => {
  await page.goto("/desktop?app=terminal");
  const terminal = page.locator('[data-window-id="terminal"] .xterm').first();
  await expect(terminal).toBeVisible();
  await terminal.evaluate(node => node.setAttribute("data-seo-runtime", "preserved"));
  const input = page.locator('[data-window-id="terminal"] .xterm-helper-textarea');
  await input.focus();
  await page.keyboard.press("Space");
  await page.keyboard.type("seo-preserved-input");
  const rows = page.locator('[data-window-id="terminal"] .xterm-rows');
  await expect(rows).toContainText("seo-preserved-input");
  const dock = page.getByRole("navigation", { name: "Applications" });
  await dock.getByRole("button", { name: "프로젝트", exact: true }).click();
  await page.getByRole("link", { name: "WCHMS 프로젝트 열기", exact: true }).dblclick();
  await expectCurrentProjectMetadata(page, "wchms", "ko");
  await dock.getByRole("button", { name: "터미널", exact: true }).click();
  await expect(rows).toContainText("seo-preserved-input");
  await dock.getByRole("button", { name: "설정", exact: true }).click();
  const settings = page.getByRole("dialog", { name: "설정", exact: true });
  await settings.getByRole("button", { name: "일반", exact: true }).click();
  await settings.getByRole("button", { name: "English", exact: true }).click();
  await dock.getByRole("button", { name: "Projects", exact: true }).click();
  await page.getByRole("link", { name: "WCHMS open project", exact: true }).dblclick();
  await expectCurrentProjectMetadata(page, "wchms", "en");
  await dock.getByRole("button", { name: "Terminal", exact: true }).click();
  await expect(terminal).toHaveAttribute("data-seo-runtime", "preserved");
  // Language changes intentionally replay the existing terminal boot sequence.
});

test("restores metadata after a real document traversal", async ({ page }) => {
  await page.addInitScript(() => window.addEventListener("pageshow", event => {
    document.documentElement.dataset.seoPersisted = String(event.persisted);
  }));
  await page.goto("/desktop?app=project&slug=kepco");
  await expectCurrentProjectMetadata(page, "kepco", "ko");
  await page.goto("about:blank");
  await page.goBack();
  await expectCurrentProjectMetadata(page, "kepco", "ko");
  test.info().annotations.push({ type: "BFCache persisted", description: String(await page.locator("html").getAttribute("data-seo-persisted")) });
});


test.describe("Desktop project body without JavaScript", () => {
  test.use({ javaScriptEnabled: false, viewport: { width: 320, height: 844 } });
  for (const language of languages) {
    for (const slug of projectSlugs) {
      test(`${language}/${slug} provides a visible article in server HTML`, async ({ page }) => {
        const path = language === "ko" ? "/desktop" : "/en/desktop";
        const project = projectMetadata(slug, language);
        const response = await page.goto(`${path}?app=project&slug=${slug}`);
        expect(response?.status()).toBe(200);
        const article = page.locator(`[data-window-id="project:${slug}"] article`);
        await expect(article).toHaveAttribute("lang", language);
        await expect(article).toBeVisible();
        await expect(article.locator("h2")).toHaveText(project.title);
        await expect(article).toContainText(project.summary);
        expect(await article.locator("h3").count()).toBeGreaterThan(0);
        await expect(page.locator('[data-app-type="project"]')).toHaveCount(1);
        const box = await page.locator('[data-app-type="project"]').boundingBox();
        expect(box!.x).toBeGreaterThanOrEqual(0);
        expect(box!.x + box!.width).toBeLessThanOrEqual(320);
      });
    }
  }
});


test("hydrates the existing article despite a different saved language with delayed scripts", async ({ page }) => {
  await page.route("**/api/auth/viewer", route => route.fulfill({
    status: 200, json: { status: "guest" },
  }));
  await page.addInitScript(() => localStorage.setItem("desktop:preferences", JSON.stringify({
    version: 1, preferences: { language: "en", wallpaper: "golden_gate_light", dockAutoHide: false },
  })));
  let releaseScripts!: () => void;
  const scriptsReady = new Promise<void>(resolve => { releaseScripts = resolve; });
  await page.route("**/*.js*", async route => {
    await scriptsReady;
    await route.continue();
  });
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  try {
    await page.goto("/desktop?app=project&slug=kepco", { waitUntil: "commit" });
    const article = page.locator('[data-window-id="project:kepco"] article');
    await expect(article).toBeVisible();
    await expect(article).toHaveAttribute("lang", "ko");
    const initialArticle = await article.elementHandle();
    await expect(page.locator('[data-window-id="project:kepco"] button').first()).toBeDisabled();
    releaseScripts();
    await expect(page).toHaveURL(/\/desktop\?app=project&slug=kepco$/);
    await expect(article).toHaveAttribute("lang", "ko");
    expect(await article.evaluate((node, initial) => node.isSameNode(initial), initialArticle)).toBe(true);
    await expect(article.locator("h2")).toHaveText(projectMetadata("kepco", "ko").title);
    await expect(page.locator('[data-app-type="project"]')).toHaveCount(1);
    await expect(page.locator('[data-window-id="project:kepco"] button').first()).toBeEnabled();
    expect(errors).toEqual([]);
  } finally {
    releaseScripts();
  }
});

function expectProfile(profile: unknown, language: Language) {
  const content = language === "ko" ? koPortfolio : enPortfolio;
  const other = language === "ko" ? enPortfolio : koPortfolio;
  const url = `${SITE_URL}${language === "ko" ? "/desktop" : "/en/desktop"}`;
  expect(profile).toMatchObject({
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${url}#profile`,
    url,
    inLanguage: language,
    mainEntity: {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: content.profile.name,
      alternateName: other.profile.name,
      jobTitle: content.profile.role,
      description: content.profile.summary[0],
      worksFor: [{
        "@type": "Organization",
        name: content.experience[0].title,
        alternateName: content.experience[0].alternateName,
      }],
      alumniOf: [{
        "@type": "EducationalOrganization",
        name: content.education[0].institution,
        alternateName: "BCIT",
      }],
      sameAs: [content.contact.github, content.contact.linkedin],
    },
  });
}

async function expectCurrentProfile(page: Page, language: Language) {
  const script = page.locator('script[type="application/ld+json"]');
  await expect(script).toHaveCount(1);
  await expect(async () => {
    expectProfile(JSON.parse(await script.textContent() ?? ""), language);
  }).toPass();
  const content = language === "ko" ? koPortfolio : enPortfolio;
  const about = page.locator('[data-window-id="about"]');
  await expect(about).toBeVisible();
  await expect(about.locator("article h2")).toBeVisible();
  await expect(about).toContainText(content.profile.summary[0]);
  await expect(about).toContainText(content.experience[0].title);
  await expect(about).toContainText(content.education[0].institution);
}

test.describe("Desktop profile JSON-LD server HTML", () => {
  test.use({ javaScriptEnabled: false, viewport: { width: 320, height: 844 } });
  for (const language of languages) {
    test(`includes exactly one ${language} profile before JavaScript`, async ({ page }) => {
      const path = language === "ko" ? "/desktop" : "/en/desktop";
      for (const query of ["", "?app=about"]) {
        const response = await page.goto(`${path}${query}`);
        expect(response?.status()).toBe(200);
        const script = page.locator('script[type="application/ld+json"]');
        await expect(script).toHaveCount(1);
        expectProfile(JSON.parse(await script.textContent() ?? ""), language);
        const content = language === "ko" ? koPortfolio : enPortfolio;
        const article = page.locator('[data-window-id="about"] article');
        await expect(article).toBeVisible();
        await expect(article).toHaveAttribute("lang", language);
        for (const paragraph of content.profile.summary) {
          await expect(article).toContainText(paragraph);
        }
        await expect(article).toContainText(content.experience[0].title);
        await expect(article).toContainText(content.education[0].institution);
        await expect(page.locator('[data-window-id="about"]')).toHaveCount(1);
        const box = await page.locator('[data-window-id="about"]').boundingBox();
        expect(box!.x).toBeGreaterThanOrEqual(0);
        expect(box!.x + box!.width).toBeLessThanOrEqual(320);
      }
    });

    test(`excludes the ${language} profile from other app requests`, async ({ page, request }) => {
      const path = language === "ko" ? "/desktop" : "/en/desktop";
      const queries = [
        ...["projects", "settings", "resume", "notes", "contact", "terminal", "desktop"].map(app => `?app=${app}`),
        ...projectSlugs.map(slug => `?app=project&slug=${slug}`),
        "?app=project&slug=missing",
      ];
      for (const query of queries) {
        const response = await request.get(`${path}${query}`);
        expect(response.status()).toBe(200);
        const actual = await readMetadata(page, await response.text());
        expect(actual.profiles, `${path}${query}`).toEqual([]);
        expect(actual.headCanonicalCount).toBe(1);
      }
      for (const terminal of ["/", "/en"]) {
        const response = await request.get(terminal);
        expect((await readMetadata(page, await response.text())).profiles).toEqual([]);
      }
    });
  }

  test("uses the validated request language for a legacy query", async ({ page }) => {
    await page.goto("/desktop?app=about&lang=en");
    const script = page.locator('script[type="application/ld+json"]');
    await expect(script).toHaveCount(1);
    expectProfile(JSON.parse(await script.textContent() ?? ""), "en");
    const article = page.locator('[data-window-id="about"] article');
    await expect(article).toBeVisible();
    await expect(article).toHaveAttribute("lang", "en");
    await expect(article).toContainText(enPortfolio.profile.summary[0]);
  });
});

test("Desktop profile JSON-LD follows URL history while its window stays mounted", async ({ page }) => {
  await page.goto("/desktop");
  await expectCurrentProfile(page, "ko");
  const about = page.locator('[data-window-id="about"]');
  await about.evaluate(node => node.setAttribute("data-jsonld-runtime", "preserved"));
  await page.getByRole("navigation", { name: "Applications" })
    .getByRole("button", { name: "프로젝트", exact: true }).click();
  await expect(page).toHaveURL(/app=projects$/);
  await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(0);
  await expect(about).toHaveAttribute("data-jsonld-runtime", "preserved");
  await page.getByRole("link", { name: "WCHMS 프로젝트 열기", exact: true }).dblclick();
  await expect(page).toHaveURL(/app=project&slug=wchms$/);
  await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(0);
  await page.goBack();
  await expect(page).toHaveURL(/app=projects$/);
  await page.goBack();
  await expectCurrentProfile(page, "ko");
  await expect(about).toHaveAttribute("data-jsonld-runtime", "preserved");
  await page.goForward();
  await expect(page).toHaveURL(/app=projects$/);
  await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(0);
});

test("Desktop profile JSON-LD changes language and restores on persisted pageshow", async ({ page }) => {
  await page.goto("/desktop");
  await expectCurrentProfile(page, "ko");
  const dock = page.getByRole("navigation", { name: "Applications" });
  await dock.getByRole("button", { name: "설정", exact: true }).click();
  await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(0);
  const settings = page.getByRole("dialog", { name: "설정", exact: true });
  await settings.getByRole("button", { name: "일반", exact: true }).click();
  await settings.getByRole("button", { name: "English", exact: true }).click();
  await expect(page).toHaveURL(/\/en\/desktop\?app=settings$/);
  await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(0);
  await dock.getByRole("button", { name: "Career", exact: true }).click();
  await expectCurrentProfile(page, "en");
  await page.evaluate(() => {
    window.history.replaceState(window.history.state, "", "/desktop");
    window.dispatchEvent(new PageTransitionEvent("pageshow", { persisted: true }));
  });
  await expectCurrentProfile(page, "ko");
});

for (const language of languages) {
  for (const width of [320, 390, 1440]) {
    test(`Desktop profile JSON-LD and About HTML survive delayed hydration (${language}, ${width}px)`, async ({ page, context, baseURL }) => {
      await page.setViewportSize({ width, height: 844 });
      await context.addCookies([{
        name: UI_PREFERENCES_COOKIE,
        value: encodeUiPreferences({ ...DEFAULT_UI_PREFERENCES, colorMode: width === 390 ? "dark" : "light", wallpaper: "tahoe_dark" }),
        url: baseURL!,
      }]);
      await page.addInitScript(() => localStorage.setItem("desktop:preferences", JSON.stringify({
        version: 1, preferences: { language: "en", wallpaper: "golden_gate_light", dockAutoHide: false },
      })));
      await page.route("**/api/auth/viewer", route => route.fulfill({ status: 200, json: { status: "guest" } }));
      let releaseScripts!: () => void;
      const ready = new Promise<void>(resolve => { releaseScripts = resolve; });
      await page.route("**/*.js*", async route => {
        await ready;
        await route.continue();
      });
      const errors: string[] = [];
      page.on("pageerror", error => errors.push(error.message));
      page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
      try {
        await page.goto(language === "ko" ? "/desktop" : "/en/desktop", { waitUntil: "commit" });
        const script = page.locator('script[type="application/ld+json"]');
        await expect(script).toHaveCount(1);
        expectProfile(JSON.parse(await script.textContent() ?? ""), language);
        const about = page.locator('[data-window-id="about"]');
        const article = about.locator("article");
        await expect(article).toBeVisible();
        await expect(article).toHaveAttribute("lang", language);
        const content = language === "ko" ? koPortfolio : enPortfolio;
        await expect(article).toContainText(content.profile.summary[0]);
        await expect(about.getByRole("button").first()).toBeDisabled();
        const initialArticle = await article.elementHandle();
        const tab = article.getByRole("tab").first();
        await tab.focus();
        const before = await about.boundingBox();
        expect(before!.x).toBeGreaterThanOrEqual(0);
        expect(before!.x + before!.width).toBeLessThanOrEqual(width);
        const background = await about.evaluate(node => getComputedStyle(node).backgroundColor);
        expect(background).not.toBe("rgba(0, 0, 0, 0)");
        await expect(page.locator(".application-shell")).toHaveAttribute("data-wallpaper", "tahoe_dark");
        const historyLength = await page.evaluate(() => history.length);
        releaseScripts();
        await expect(about.getByRole("button").first()).toBeEnabled();
        await expectCurrentProfile(page, language);
        await expect(script).toHaveCount(1);
        await expect(page.locator('[data-window-id="about"]')).toHaveCount(1);
        expect(await article.evaluate((node, initial) => node.isSameNode(initial), initialArticle)).toBe(true);
        expect(await page.evaluate(() => history.length)).toBe(historyLength);
        const after = await about.boundingBox();
        expect(after!.x).toBeGreaterThanOrEqual(0);
        expect(after!.x + after!.width).toBeLessThanOrEqual(width);
        for (const key of ["x", "y", "width", "height"] as const) {
          expect(Math.abs(after![key] - before![key])).toBeLessThan(1);
        }
        expect(await about.evaluate(node => getComputedStyle(node).backgroundColor)).toBe(background);
        await expect(tab).toBeFocused();
        await page.keyboard.press("ArrowRight");
        await expect(article.getByRole("tab").nth(1)).toBeFocused();
        await expect(article.getByRole("tab").nth(1)).toHaveAttribute("aria-selected", "true");
        await expect(article.getByRole("tabpanel")).toContainText("TanStack Query");
        expect(errors).toEqual([]);
      } finally {
        releaseScripts();
      }
    });
  }
}
