import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/siteMetadata";
import { languages } from "@/lib/i18n/language";
import { enabledProjectSlugs } from "@/features/portfolio/content/projectSummaries";
import { serializeDesktopUrl } from "@/app/desktop/lib/parseDesktopAppTarget";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
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
    // Next.js 16.3.4 interpolates these values into XML without escaping query separators.
    ...enabledProjectSlugs.flatMap(slug => languages.map(lang => ({
      url: `${SITE_URL}${serializeDesktopUrl({ app: "project", slug, lang })}`.replaceAll("&", "&amp;"),
      alternates: {
        languages: Object.fromEntries(languages.map(language => [
          language,
          `${SITE_URL}${serializeDesktopUrl({ app: "project", slug, lang: language })}`.replaceAll("&", "&amp;"),
        ])),
      },
    }))),
  ];
}
