import { serializeDesktopUrl } from "@/app/desktop/lib/parseDesktopAppTarget";
import { getPortfolioContent } from "@/features/portfolio/content/getPortfolioContent";
import { projectDocuments } from "@/features/portfolio/content/projectDocuments";
import { readProjectDocument } from "@/features/portfolio/content/projectMetadata";
import { projectSlugs } from "@/features/portfolio/types/projectTypes";
import { languages } from "@/lib/i18n/language";
import { SEO_COPY, SITE_NICKNAME, SITE_URL } from "@/lib/seo/siteMetadata";

export const dynamic = "force-static";

export function GET() {
  const english = getPortfolioContent("en");
  const sections = languages.map(lang => {
    const content = getPortfolioContent(lang);
    const aboutUrl = `${SITE_URL}${serializeDesktopUrl({ app: "about", lang })}`;
    return [
      `## ${lang === "ko" ? "Korean" : "English"}`,
      "",
      `- [${SEO_COPY[lang].authorName}, ${lang === "ko" ? "소개와 커리어" : "About and career"}](${aboutUrl}): ${content.profile.role}`,
      ...projectSlugs.map(slug => {
        const { metadata } = readProjectDocument(projectDocuments[slug][lang]);
        const url = `${SITE_URL}${serializeDesktopUrl({ app: "project", slug, lang })}`;
        return `- [${metadata.title}](${url}): ${metadata.summary}`;
      }),
    ].join("\n");
  });
  const text = [
    `# ${SEO_COPY.en.authorName} Portfolio`,
    `> ${english.profile.summary[0]}`,
    `This is the portfolio of ${english.profile.name}, also known as ${SITE_NICKNAME}. It is available in Korean and English. The links below lead to profile and project pages with readable content in the server HTML.`,
    ...sections,
    [
      "## Optional",
      "",
      `- [GitHub](${english.contact.github}): Public developer profile.`,
      `- [LinkedIn](${english.contact.linkedin}): Public professional profile.`,
    ].join("\n"),
  ].join("\n\n");

  return new Response(`${text}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
