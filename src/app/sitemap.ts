import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/siteMetadata";
import { languages } from "@/lib/i18n/language";
import { projectSlugs } from "@/features/portfolio/types/projectTypes";
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
    ...projectSlugs.flatMap(slug => languages.map(lang => ({
      url: `${SITE_URL}${serializeDesktopUrl({ app: "project", slug, lang })}`,
      alternates: {
        languages: Object.fromEntries(languages.map(language => [
          language,
          `${SITE_URL}${serializeDesktopUrl({ app: "project", slug, lang: language })}`,
        ])),
      },
    }))),
  ];
}
