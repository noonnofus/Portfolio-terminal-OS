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
                id: "workerDecomposition",
                source: resource.caseStudy.workerDecomposition,
                isProblemSolving: true,
                items: [
                    { id: "oversizedContext", phase: "problem" },
                    { id: "responsibilityBoundary", phase: "process" },
                    { id: "callIsolation", phase: "process" },
                    { id: "result", phase: "result" },
                ],
            },
            {
                id: "implementation",
                source: resource.caseStudy.implementation,
                items: [
                    { id: "twilio" },
                    { id: "audioPipeline" },
                    { id: "callControls" },
                    { id: "providerIntegration" },
                ],
            },
        ]),
        architecture: resource.architecture,
    };
}
