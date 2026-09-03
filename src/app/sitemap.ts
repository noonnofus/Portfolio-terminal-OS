import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/siteMetadata";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
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
  ];
}
