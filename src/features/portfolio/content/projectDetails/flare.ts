import type { Language } from "@/lib/i18n/language";
import ko from "@/features/portfolio/i18n/ko/Flare.json";
import en from "@/features/portfolio/i18n/en/Flare.json";
import {
    createProjectDetailPageContent,
    type ProjectDetailResource,
    type ProjectDetailSectionSource,
    type ProjectDetailText,
} from "../projectDetailContent";

type FlareResource = ProjectDetailResource & {
    projectIntro: ProjectDetailText;
    caseStudy: Record<string, ProjectDetailSectionSource>;
    walkthrough: ProjectDetailText & {
        unsupported: string;
    };
};

const resources: Record<Language, FlareResource> = { ko, en };

export function getFlareProjectContent(language: Language) {
    const resource = resources[language];

    return {
        page: createProjectDetailPageContent(resource, resource.projectIntro, [
            {
                id: "informationFlow",
                source: resource.caseStudy.informationFlow,
                isProblemSolving: true,
                items: [
                    { id: "fragmentedInformation", phase: "problem" },
                    { id: "unifiedView", phase: "process" },
                    { id: "installableWeb", phase: "process" },
                    { id: "consolidatedAccess", phase: "result" },
                ],
            },
            {
                id: "implementation",
                source: resource.caseStudy.implementation,
                items: [
                    { id: "mapAndRisk" },
                    { id: "newsPipeline" },
                    { id: "chatbot" },
                    { id: "notifications" },
                ],
            },
        ]),
        walkthrough: resource.walkthrough,
    };
}
