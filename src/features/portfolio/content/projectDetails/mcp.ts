import type { Language } from "@/lib/i18n/language";
import ko from "@/features/portfolio/i18n/ko/Mcp.json";
import en from "@/features/portfolio/i18n/en/Mcp.json";
import {
    createProjectDetailPageContent,
    type ProjectDetailResource,
    type ProjectDetailSectionSource,
    type ProjectDetailText,
} from "../projectDetailContent";

type McpResource = ProjectDetailResource & {
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

const resources: Record<Language, McpResource> = { ko, en };

export function getMcpProjectContent(language: Language) {
    const resource = resources[language];

    return {
        page: createProjectDetailPageContent(resource, resource.projectIntro, [
            {
                id: "performance",
                source: resource.caseStudy.performance,
                isProblemSolving: true,
                items: [
                    { id: "longAudio", phase: "problem" },
                    { id: "chunkBoundary", phase: "process" },
                    { id: "parallelPipeline", phase: "process" },
                    { id: "measuredResult", phase: "result" },
                ],
            },
            {
                id: "progressProtocol",
                source: resource.caseStudy.progressProtocol,
                isProblemSolving: true,
                items: [
                    { id: "rootCause", phase: "problem" },
                    { id: "sessionBoundary", phase: "process" },
                    { id: "eventContract", phase: "process" },
                    { id: "uiState", phase: "process" },
                    { id: "verification", phase: "result" },
                ],
            },
            {
                id: "implementation",
                source: resource.caseStudy.implementation,
                items: [
                    { id: "apiTools" },
                    { id: "meetingMinutes" },
                    { id: "streaming" },
                    { id: "errorBoundary" },
                ],
            },
        ]),
        architecture: resource.architecture,
    };
}
