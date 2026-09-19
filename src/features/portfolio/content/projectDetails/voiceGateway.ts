import type { Language } from "@/lib/i18n/language";
import ko from "@/features/portfolio/i18n/ko/VoiceGateway.json";
import en from "@/features/portfolio/i18n/en/VoiceGateway.json";
import {
    createProjectDetailPageContent,
    type ProjectDetailResource,
    type ProjectDetailSectionSource,
    type ProjectDetailText,
} from "../projectDetailContent";

type VoiceGatewayResource = ProjectDetailResource & {
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

const resources: Record<Language, VoiceGatewayResource> = { ko, en };

export function getVoiceGatewayProjectContent(language: Language) {
    const resource = resources[language];

    return {
        page: createProjectDetailPageContent(resource, resource.projectIntro, [
            {
                id: "providerArchitecture",
                source: resource.caseStudy.providerArchitecture,
                isProblemSolving: true,
                items: [
                    { id: "coupling", phase: "problem" },
                    { id: "contract", phase: "process" },
                    { id: "factory", phase: "process" },
                    { id: "strategyCodec", phase: "process" },
                    { id: "verification", phase: "result" },
                ],
            },
            {
                id: "audioPacing",
                source: resource.caseStudy.audioPacing,
                isProblemSolving: true,
                items: [
                    { id: "timing", phase: "problem" },
                    { id: "lazyStart", phase: "process" },
                    { id: "recovery", phase: "process" },
                    { id: "result", phase: "result" },
                ],
            },
        ]),
        architecture: resource.architecture,
    };
}
