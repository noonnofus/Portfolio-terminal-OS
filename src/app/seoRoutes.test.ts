import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { SITE_URL } from "@/lib/seo/siteMetadata";
import { projectSlugs } from "@/features/portfolio/types/projectTypes";

describe("SEO metadata routes", () => {
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

  it("lists all 14 canonical project URLs and matching language alternates", () => {
    const entries = sitemap();
    expect(entries).toHaveLength(18);
    expect(new Set(entries.map(entry => entry.url)).size).toBe(18);
    for (const slug of projectSlugs) {
      const ko = `${SITE_URL}/desktop?app=project&slug=${slug}`;
      const en = `${SITE_URL}/en/desktop?app=project&slug=${slug}`;
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
