import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DesktopMetadata } from "@/app/desktop/components/DesktopMetadata";
import { getDesktopMetadata, getDesktopMetadataForView, getDesktopStructuredData } from "@/app/desktop/lib/getDesktopMetadata";
import { parseDesktopSearchParams, serializeDesktopUrl } from "@/app/desktop/lib/parseDesktopAppTarget";
import * as portfolio from "@/features/portfolio/content/getPortfolioContent";
import { projectDocuments } from "@/features/portfolio/content/projectDocuments";
import { readProjectDocument } from "@/features/portfolio/content/projectMetadata";
import { projectSlugs } from "@/features/portfolio/types/projectTypes";
import { SEO_COPY, SITE_URL } from "@/lib/seo/siteMetadata";
import { languages } from "@/lib/i18n/language";

describe("Desktop request metadata", () => {
  for (const language of languages) {
    it.each(projectSlugs)(`describes %s in ${language}`, (slug) => {
      const { metadata: project } = readProjectDocument(
        projectDocuments[slug][language],
      );
      const title = `${project.title} | ${language === "ko" ? "김현호" : "Kevin Hyun Ho Kim"}`;
      const canonical = `${language === "ko" ? "/desktop" : "/en/desktop"}?app=project&slug=${slug}`;

const shared = getDesktopMetadataForView({ app: "project", slug, lang: language });
expect(shared.title.absolute).toBe(title);
expect(shared.description).toBe(project.summary);
expect(shared.alternates.canonical).toBe(canonical);
expect(shared.openGraph.locale).toBe(language === "ko" ? "ko_KR" : "en_US");

      expect(getDesktopMetadata({ app: "project", slug }, language)).toMatchObject({
        title: { absolute: title },
        description: project.summary,
        alternates: {
          canonical,
          languages: {
            ko: `/desktop?app=project&slug=${slug}`,
            en: `/en/desktop?app=project&slug=${slug}`,
          },
        },
        openGraph: { title, description: project.summary, url: canonical },
        twitter: { title, description: project.summary },
      });
    });
  }

  it.each(languages)("keeps the %s Desktop defaults", (language) => {
    const { title, description } = SEO_COPY[language].desktop;
    const canonical = language === "ko" ? "/desktop" : "/en/desktop";

    expect(getDesktopMetadata({}, language)).toMatchObject({
      title: { absolute: title },
      description,
      openGraph: { title, description },
      twitter: { title, description },
      alternates: { canonical },
    });
  });

  it.each([
    { app: "project", slug: "missing" },
    { app: "project", slug: "../auth" },
    { app: "project" },
    { app: "unknown", slug: "kepco" },
    { app: "resume", slug: "kepco" },
    { app: "project", slug: "kepco", tracking: "x".repeat(300) },
  ])("uses the existing fallback for %j", (query) => {
    expect(getDesktopMetadata(query, "ko")).toEqual(getDesktopMetadata({}, "ko"));
  });

  it("preserves the first repeated value and normalizes language and tracking", () => {
    const result = getDesktopMetadata({
      app: ["project", "settings"],
      slug: ["kepco", "mcp"],
      lang: ["en", "ko"],
      utm_source: "shared",
      unused: undefined,
    }, "ko");

    expect(result).toEqual(getDesktopMetadata({ app: "project", slug: "kepco" }, "en"));
  });

  it("ignores unsupported languages using the route default", () => {
    expect(getDesktopMetadata({ app: "project", slug: "kepco", lang: "fr" }, "en"))
      .toEqual(getDesktopMetadata({ app: "project", slug: "kepco" }, "en"));
  });
});

describe("Desktop profile structured data", () => {
  afterEach(() => vi.restoreAllMocks());

  it.each(languages)("uses the existing %s profile and public relationships", (lang) => {
    const content = portfolio.getPortfolioContent(lang);
    const other = portfolio.getPortfolioContent(lang === "ko" ? "en" : "ko");
    const url = `${SITE_URL}${lang === "ko" ? "/desktop" : "/en/desktop"}`;
    expect(getDesktopStructuredData({ app: "about", lang })).toEqual({
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      "@id": `${url}#profile`,
      url,
      inLanguage: lang,
      mainEntity: {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: content.profile.name,
        alternateName: [other.profile.name, "Hyunho Kim", "noonnofus"],
        jobTitle: content.profile.role,
        description: content.profile.summary[0],
        url,
        worksFor: [{
          "@type": "Organization",
          name: lang === "ko" ? "(주)로고스에이아이" : "LOGOS AI",
          alternateName: lang === "ko" ? "LogosAI" : "로고스에이아이",
        }],
        alumniOf: [{
          "@type": "EducationalOrganization",
          name: "British Columbia Institute of Technology (BCIT)",
          alternateName: "BCIT",
        }],
        sameAs: ["https://github.com/noonnofus", "https://www.linkedin.com/in/kevin-hyun-ho-kim/"],
      },
    });
  });

  it.each(languages)("omits profile data from every non-profile %s view", (lang) => {
    for (const app of ["projects", "resume", "terminal", "contact", "notes", "settings", "desktop"] as const) {
      expect(getDesktopStructuredData({ app, lang })).toBeNull();
    }
    for (const slug of projectSlugs) {
      expect(getDesktopStructuredData({ app: "project", slug, lang })).toBeNull();
    }
  });

  it("selects current employers independently of array order and translated periods", () => {
    const content = portfolio.getPortfolioContent("ko");
    const employer = content.experience[0];
    vi.spyOn(portfolio, "getPortfolioContent").mockReturnValue({
      ...content,
      experience: [
        { ...employer, title: "Former employer", current: false, period: "Present" },
        { ...employer, title: "Unspecified employer", current: undefined, period: "현재" },
        { ...employer, period: "No translated date convention" },
      ],
    });
    expect(getDesktopStructuredData({ app: "about", lang: "ko" })?.mainEntity.worksFor)
      .toEqual([{ "@type": "Organization", name: employer.title, alternateName: employer.alternateName }]);
  });

  it.each([false, undefined])("omits worksFor when current is %s", (current) => {
    const content = portfolio.getPortfolioContent("ko");
    vi.spyOn(portfolio, "getPortfolioContent").mockReturnValue({
      ...content,
      experience: content.experience.map(experience => ({ ...experience, current })),
    });
    expect(getDesktopStructuredData({ app: "about", lang: "ko" })?.mainEntity)
      .not.toHaveProperty("worksFor");
  });

  it("escapes script termination strings in the actual server-rendered component", () => {
    const content = portfolio.getPortfolioContent("ko");
    const name = '</script><script id="injected">alert(1)</script>';
    vi.spyOn(portfolio, "getPortfolioContent").mockReturnValue({
      ...content, profile: { ...content.profile, name },
    });
    const html = renderToStaticMarkup(createElement(DesktopMetadata, { initialPath: "/desktop" }));
    const scripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)];
    expect(scripts).toHaveLength(1);
    expect(scripts[0][1]).not.toContain("<");
    expect(JSON.parse(scripts[0][1]).mainEntity.name).toBe(name);
    expect(html).not.toContain('<script id="injected">');
  });

  it.each([
    { app: "projects" }, { app: "settings" }, { app: "resume" },
    { app: "project", slug: "missing" },
  ])("keeps non-profile request snapshots through server rendering: %j", (query) => {
    const view = parseDesktopSearchParams(query, "en");
    const html = renderToStaticMarkup(createElement(DesktopMetadata, {
      initialPath: serializeDesktopUrl(view),
    }));
    expect(html).not.toContain('type="application/ld+json"');
    expect(html).toContain(`rel="canonical" href="${SITE_URL}/en/desktop"`);
  });
});
