import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { GET as getLlms } from "@/app/llms.txt/route";
import { getPortfolioContent } from "@/features/portfolio/content/getPortfolioContent";
import { projectDocuments } from "@/features/portfolio/content/projectDocuments";
import { readProjectDocument } from "@/features/portfolio/content/projectMetadata";
import { languages } from "@/lib/i18n/language";
import { SEO_COPY, SITE_URL } from "@/lib/seo/siteMetadata";
import { projectSlugs } from "@/features/portfolio/types/projectTypes";
import { isProjectEnabled } from "@/features/portfolio/content/projectManifest";
import { enabledProjectSlugs } from "@/features/portfolio/content/projectSummaries";

describe("SEO metadata routes", () => {
  it("publishes a UTF-8 llms guide with unique public links", async () => {
    const response = getLlms();
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("text/plain; charset=utf-8");
    const text = await response.text();
    const english = getPortfolioContent("en");
    expect(text.startsWith(`# Kevin Hyun Ho Kim Portfolio\n\n> ${english.profile.summary[0]}\n`)).toBe(true);
    expect(text).toContain(`${english.profile.name}, also known as noonnofus`);
    expect(text.match(/^# .+/gm)).toHaveLength(1);
    expect(text.match(/^## .+/gm)).toEqual(["## Korean", "## English", "## Optional"]);
    const urls = [...text.matchAll(/^- \[[^\]]+\]\(([^)]+)\): /gm)].map(match => match[1]);
    expect(urls).toHaveLength(4 + enabledProjectSlugs.length * languages.length);
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls.filter(url => new URL(url).origin === SITE_URL))
      .toHaveLength((1 + enabledProjectSlugs.length) * languages.length);
    expect(urls.filter(url => new URL(url).origin !== SITE_URL))
      .toEqual([english.contact.github, english.contact.linkedin]);
    expect(text.endsWith("\n")).toBe(true);
  });

  it.each(languages)("keeps the %s llms section aligned with the existing content and canonical URLs", async (lang) => {
    const text = await getLlms().text();
    const heading = lang === "ko" ? "Korean" : "English";
    const section = text.split(`## ${heading}\n\n`)[1].split("\n\n## ")[0];
    const content = getPortfolioContent(lang);
    const base = `${SITE_URL}${lang === "ko" ? "/desktop" : "/en/desktop"}`;
    expect(section).toContain(SEO_COPY[lang].authorName);
    expect(section).toContain(`](${base}): ${content.profile.role}`);
    for (const slug of projectSlugs) {
      if (!isProjectEnabled(slug)) {
        expect(section).not.toContain(`${base}?app=project&slug=${slug}`);
        continue;
      }
      const { metadata } = readProjectDocument(projectDocuments[slug][lang]);
      expect(section).toContain(`- [${metadata.title}](${base}?app=project&slug=${slug}): ${metadata.summary}`);
    }
    expect(section.match(/^- \[/gm)).toHaveLength(1 + enabledProjectSlugs.length);
  });

  it("publishes the public entry points in the sitemap", () => {
    expect(sitemap().slice(0, 4)).toEqual([
      {
        url: SITE_URL,
        changeFrequency: "monthly",
        priority: 1,
      },
      {
        url: `${SITE_URL}/desktop`,
        changeFrequency: "monthly",
        priority: 0.8,
      },
      {
        url: `${SITE_URL}/en`,
        changeFrequency: "monthly",
        priority: 1,
      },
      {
        url: `${SITE_URL}/en/desktop`,
        changeFrequency: "monthly",
        priority: 0.8,
      },
    ]);
  });

  it("escapes enabled project URLs and matching language alternates for sitemap XML", () => {
    const entries = sitemap();
    expect(entries).toHaveLength(4 + enabledProjectSlugs.length * languages.length);
    expect(new Set(entries.map(entry => entry.url)).size).toBe(entries.length);
    for (const slug of projectSlugs) {
      if (!isProjectEnabled(slug)) {
        expect(entries.some(entry => entry.url.includes(`slug=${slug}`))).toBe(false);
        continue;
      }
      const ko = `${SITE_URL}/desktop?app=project&amp;slug=${slug}`;
      const en = `${SITE_URL}/en/desktop?app=project&amp;slug=${slug}`;
      for (const url of [ko, en]) expect(entries.find(entry => entry.url === url)).toEqual({
        url, alternates: { languages: { ko, en } },
      });
    }
  });

  it("allows public pages while excluding API and auth routes", () => {
    expect(robots()).toEqual({
      rules: {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/auth/"],
      },
      sitemap: `${SITE_URL}/sitemap.xml`,
      host: SITE_URL,
    });
  });
});
