import type { Language } from "@/lib/i18n/language";
import ko from "@/features/portfolio/i18n/ko/Portfolio.json";
import en from "@/features/portfolio/i18n/en/Portfolio.json";
import {
    createProjectDetailPageContent,
    type ProjectDetailResource,
    type ProjectDetailSectionSource,
    type ProjectDetailText,
} from "../projectDetailContent";

type PortfolioResource = ProjectDetailResource & {
    projectIntro: ProjectDetailText;
    caseStudy: Record<string, ProjectDetailSectionSource>;
    architecture: ProjectDetailText & {
        alt: string;
        caption: string;
        loading: string;
        error: string;
        scrollLabel: string;
        diagram: Record<string, string>;
    };
};

const resources: Record<Language, PortfolioResource> = { ko, en };

export function getPortfolioProjectContent(language: Language) {
    const resource = resources[language];

    return {
        page: createProjectDetailPageContent(resource, resource.projectIntro, [
            {
                id: "ownership",
                source: resource.caseStudy.ownership,
                isProblemSolving: true,
                items: [
                    { id: "problem", phase: "problem" },
                    { id: "decision", phase: "process" },
                    { id: "result", phase: "result" },
                ],
            },
            {
                id: "appContract",
                source: resource.caseStudy.appContract,
                isProblemSolving: true,
                items: [
                    { id: "problem", phase: "problem" },
                    { id: "decision", phase: "process" },
                    { id: "result", phase: "result" },
                ],
            },
        ]),
        architecture: resource.architecture,
    };
}
