import {
    externalUrl,
    isProjectSlug,
    publicAssetPath,
    type ProjectSlug,
} from "@/features/gui/registry/appTypes";
import { projectManifest } from "@/shared/content/portfolio/projectManifest";
import type {
    ContactContent,
    EducationContent,
    ExperienceContent,
    ExperienceHighlight,
    PortfolioContent,
    PortfolioContentByLanguage,
} from "@/shared/content/portfolio/types";
import type { Language } from "@/shared/i18n/language";
import enPortfolioContent from "@/shared/i18n/resources/en/PortfolioContent.json";
import enAppShell from "@/shared/i18n/resources/en/appShell.json";
import koPortfolioContent from "@/shared/i18n/resources/ko/PortfolioContent.json";
import koAppShell from "@/shared/i18n/resources/ko/appShell.json";

type PortfolioLocaleExperience = Omit<
    ExperienceContent,
    "logo"
> & {
    highlights: readonly ExperienceHighlight[];
};

type PortfolioLocaleResource = Omit<
    PortfolioContent,
    "contact" | "education" | "experience" | "projects"
> & {
    contact: {
        email: string;
        github: string;
        linkedin: string;
    };
    education: readonly Omit<EducationContent, "logo">[];
    experience: readonly PortfolioLocaleExperience[];
    projects: readonly {
        slug: string;
        summary: string;
    }[];
};

const portfolioResources = {
    ko: koPortfolioContent,
    en: enPortfolioContent,
} satisfies Record<Language, PortfolioLocaleResource>;

const appShellResources = {
    ko: koAppShell,
    en: enAppShell,
} as const;

const projectAppNameKeys = {
    portfolio: "portfolio",
    optigen: "optigen",
    mcp: "mcp",
    "voice-gateway": "voice-gateway",
    kepco: "kepco",
    wchms: "wchms",
    flare: "flare",
} as const satisfies Record<ProjectSlug, keyof typeof enAppShell.appNames>;

function parseProjectSlug(value: string): ProjectSlug {
    if (!isProjectSlug(value)) {
        throw new Error(`Unsupported portfolio project slug: ${value}`);
    }

    return value;
}

function toContactContent(
    contact: PortfolioLocaleResource["contact"],
): ContactContent {
    return {
        email: contact.email,
        github: externalUrl(contact.github),
        linkedin: externalUrl(contact.linkedin),
    };
}

function toPortfolioContent(
    language: Language,
    resource: PortfolioLocaleResource,
): PortfolioContent {
    const appNames = appShellResources[language].appNames;

    return {
        profile: resource.profile,
        experience: resource.experience.map((experience, index) => ({
            ...experience,
            ...(index === 0
                ? { logo: publicAssetPath("/organizations/logosai.svg") }
                : {}),
        })),
        skills: resource.skills,
        projects: resource.projects.map((project) => {
            const slug = parseProjectSlug(project.slug);

            return {
                slug,
                title: appNames[projectAppNameKeys[slug]],
                summary: project.summary,
                stack: projectManifest[slug].stack,
            };
        }),
        education: resource.education.map((education, index) => ({
            ...education,
            ...(index === 0
                ? { logo: publicAssetPath("/organizations/bcit.png") }
                : {}),
        })),
        contact: toContactContent(resource.contact),
    };
}

export const portfolioContent = {
    ko: toPortfolioContent("ko", portfolioResources.ko),
    en: toPortfolioContent("en", portfolioResources.en),
} satisfies PortfolioContentByLanguage;

export function getPortfolioContent(
    language: Language,
): PortfolioContent {
    return portfolioContent[language];
}
