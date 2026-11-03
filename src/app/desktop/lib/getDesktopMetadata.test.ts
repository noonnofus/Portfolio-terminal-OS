import { describe, expect, it } from "vitest";
import { getDesktopMetadata, getDesktopMetadataForView } from "@/app/desktop/lib/getDesktopMetadata";
import { projectDocuments } from "@/features/portfolio/content/projectDocuments";
import { readProjectDocument } from "@/features/portfolio/content/projectMetadata";
import { projectSlugs } from "@/features/portfolio/types/projectTypes";
import { SEO_COPY } from "@/lib/seo/siteMetadata";
import { languages } from "@/lib/i18n/language";

describe("Desktop request metadata", () => {
  for (const language of languages) {
    it.each(projectSlugs)(`describes %s in ${language}`, (slug) => {
      const { metadata: project } = readProjectDocument(
        projectDocuments[slug][language],
      );
      const title = `${project.title} | ${language === "ko" ? "김현호" : "Hyunho Kim"}`;
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
