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
    };
};

const resources: Record<Language, PortfolioResource> = { ko, en };

export function getPortfolioProjectContent(language: Language) {
    const resource = resources[language];

    return {
        page: createProjectDetailPageContent(resource, resource.projectIntro, [
            {
                id: "navigation",
                source: resource.caseStudy.navigation,
                isProblemSolving: true,
                items: [
                    { id: "problem", phase: "problem" },
                    { id: "decision", phase: "process" },
                    { id: "result", phase: "result" },
                ],
            },
            {
                id: "directory",
                source: resource.caseStudy.directory,
                isProblemSolving: true,
                items: [
                    { id: "problem", phase: "problem" },
                    { id: "decision", phase: "process" },
                    { id: "result", phase: "result" },
                ],
            },
            {
                id: "implementation",
                source: resource.caseStudy.implementation,
                items: [{ id: "content" }, { id: "accessibility" }],
            },
            {
                id: "verification",
                source: resource.caseStudy.verification,
                items: [
                    { id: "structure" },
                    { id: "navigation" },
                    { id: "interaction" },
                ],
            },
        ]),
        architecture: resource.architecture,
    };
}
