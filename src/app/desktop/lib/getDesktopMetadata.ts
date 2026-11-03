import type { Metadata } from "next";
import {
  getDesktopUrlBasePath,
  parseDesktopUrl,
  serializeDesktopUrl,
} from "@/app/desktop/lib/parseDesktopAppTarget";
import type { DesktopUrlState } from "@/app/desktop/types/appTypes";
import { projectDocuments } from "@/features/portfolio/content/projectDocuments";
import { readProjectDocument } from "@/features/portfolio/content/projectMetadata";
import type { Language } from "@/lib/i18n/language";
import { SEO_COPY, SHARED_SOCIAL_METADATA } from "@/lib/seo/siteMetadata";

type SearchParams = Record<string, string | string[] | undefined>;

export function getDesktopMetadata(
  query: SearchParams,
  defaultLanguage: Language,
) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined) continue;
    for (const item of Array.isArray(value) ? value : [value]) {
      params.append(key, item);
    }
  }
  return getDesktopMetadataForView(parseDesktopUrl(params, defaultLanguage));
}

export function getDesktopMetadataForView(view: DesktopUrlState) {
  const copy = SEO_COPY[view.lang];
  let { title, description } = copy.desktop;

  if (view.app === "project") {
    const { metadata } = readProjectDocument(projectDocuments[view.slug][view.lang]);
    title = `${metadata.title} | ${copy.authorName}`;
    description = metadata.summary;
  }

  // ponytail: URL values stay derived from the existing validated view.
  const pathFor = (language: Language) =>
    view.app === "project"
      ? serializeDesktopUrl({ ...view, lang: language })
      : getDesktopUrlBasePath(language);
  const canonical = pathFor(view.lang);

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical,
      languages: { ko: pathFor("ko"), en: pathFor("en") },
    },
    openGraph: {
      ...SHARED_SOCIAL_METADATA.openGraph,
      locale: copy.locale,
      url: canonical,
      title,
      description,
    },
    twitter: {
      ...SHARED_SOCIAL_METADATA.twitter,
      title,
      description,
    },
  } satisfies Metadata;
}

// Reset inherited fields so DesktopMetadata owns each tag exactly once.
export const desktopMetadataReset = {
  title: null, description: null, alternates: null, openGraph: null, twitter: null,
} satisfies Metadata;
