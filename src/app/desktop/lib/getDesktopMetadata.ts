import type { Metadata } from "next";
import {
  getDesktopUrlBasePath,
  parseDesktopSearchParams,
  type DesktopSearchParams,
  serializeDesktopUrl,
} from "@/app/desktop/lib/parseDesktopAppTarget";
import type { DesktopUrlState } from "@/app/desktop/types/appTypes";
import { getPortfolioContent } from "@/features/portfolio/content/getPortfolioContent";
import { projectDocuments } from "@/features/portfolio/content/projectDocuments";
import { readProjectDocument } from "@/features/portfolio/content/projectMetadata";
import type { Language } from "@/lib/i18n/language";
import { SEO_COPY, SHARED_SOCIAL_METADATA, SITE_NICKNAME, SITE_URL } from "@/lib/seo/siteMetadata";

export function getDesktopMetadata(
  query: DesktopSearchParams,
  defaultLanguage: Language,
) {
  return getDesktopMetadataForView(parseDesktopSearchParams(query, defaultLanguage));
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

export function getDesktopStructuredData(view: DesktopUrlState) {
  if (view.app !== "about") return null;

  const content = getPortfolioContent(view.lang);
  const other = getPortfolioContent(view.lang === "ko" ? "en" : "ko");
  const url = `${SITE_URL}${getDesktopUrlBasePath(view.lang)}`;
  const employers = content.experience
    .filter(experience => experience.current === true)
    .map(experience => ({
      "@type": "Organization" as const,
      name: experience.title,
      alternateName: experience.alternateName,
    }));

  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${url}#profile`,
    url,
    inLanguage: view.lang,
    mainEntity: {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: content.profile.name,
      alternateName: [other.profile.name, "Hyunho Kim", SITE_NICKNAME],
      jobTitle: content.profile.role,
      description: content.profile.summary[0],
      url,
      ...(employers.length > 0 ? { worksFor: employers } : {}),
      alumniOf: content.education.map(education => ({
        "@type": "EducationalOrganization" as const,
        name: education.institution,
        alternateName: education.alternateName,
      })),
      sameAs: [content.contact.github, content.contact.linkedin],
    },
  } as const;
}

// Reset inherited fields so DesktopMetadata owns each tag exactly once.
export const desktopMetadataReset = {
  title: null, description: null, alternates: null, openGraph: null, twitter: null,
} satisfies Metadata;
