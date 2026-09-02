import type { Language } from "@/lib/i18n/language";
import ko from "@/features/portfolio/i18n/ko/Optigen.json";
import en from "@/features/portfolio/i18n/en/Optigen.json";
import {
    createProjectDetailPageContent,
    type ProjectDetailResource,
    type ProjectDetailSectionSource,
    type ProjectDetailText,
} from "../projectDetailContent";

type OptigenResource = ProjectDetailResource & {
    projectIntro: ProjectDetailText;
    caseStudy: Record<string, ProjectDetailSectionSource>;
    architecture: ProjectDetailText & {
        alt: string;
        caption: string;
        loading: string;
        error: string;
        diagram: Record<string, string>;
    };
};

const resources: Record<Language, OptigenResource> = { ko, en };

export function getOptigenProjectContent(language: Language) {
    const resource = resources[language];

    return {
        page: createProjectDetailPageContent(resource, resource.projectIntro, [
            {
                id: "streamingLayout",
                source: resource.caseStudy.streamingLayout,
                isProblemSolving: true,
                items: [
                    { id: "growingResponse", phase: "problem" },
                    { id: "spacerLayout", phase: "process" },
                    { id: "streamState", phase: "process" },
                    { id: "readingPosition", phase: "result" },
                ],
            },
            {
                id: "implementation",
                source: resource.caseStudy.implementation,
                items: [
                    { id: "chatExperience" },
                    { id: "responseFlow" },
                    { id: "accessibility" },
                    { id: "responsive" },
                ],
            },
            {
                id: "localStt",
                source: resource.caseStudy.localStt,
                items: [
                    { id: "workerBoundary" },
                    { id: "fallback" },
                    { id: "verification" },
                ],
            },
            {
                id: "verification",
                source: resource.caseStudy.verification,
                items: [{ id: "accessibility" }, { id: "streaming" }],
            },
        ]),
        architecture: resource.architecture,
    };
}
