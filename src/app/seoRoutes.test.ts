import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { SITE_URL } from "@/lib/seo/siteMetadata";

describe("SEO metadata routes", () => {
  it("publishes the public entry points in the sitemap", () => {
    expect(sitemap()).toEqual([
      {
        url: SITE_URL,
        changeFrequency: "monthly",
        priority: 1,
      },
      {
        url: `${SITE_URL}/gui`,
        changeFrequency: "monthly",
        priority: 0.8,
      },
      {
        url: `${SITE_URL}/en`,
        changeFrequency: "monthly",
        priority: 1,
      },
      {
        url: `${SITE_URL}/en/gui`,
        changeFrequency: "monthly",
        priority: 0.8,
      },
    ]);
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
