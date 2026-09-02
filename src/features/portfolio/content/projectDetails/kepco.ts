import type { Language } from "@/lib/i18n/language";
import ko from "@/features/portfolio/i18n/ko/Kepco.json";
import en from "@/features/portfolio/i18n/en/Kepco.json";
import {
    createProjectDetailPageContent,
    type ProjectDetailResource,
    type ProjectDetailSectionSource,
    type ProjectDetailText,
} from "../projectDetailContent";

type KepcoResource = ProjectDetailResource & {
    projectIntro: ProjectDetailText;
    caseStudy: Record<string, ProjectDetailSectionSource>;
    contributions: ProjectDetailSectionSource;
    verification: ProjectDetailSectionSource;
    flow: ProjectDetailText & {
        alt: string;
        caption: string;
        loading: string;
        error: string;
        diagram: Record<string, string>;
    };
};

const resources: Record<Language, KepcoResource> = { ko, en };

export function getKepcoProjectContent(language: Language) {
    const resource = resources[language];

    return {
        page: createProjectDetailPageContent(resource, resource.projectIntro, [
            {
                id: "sttRecovery",
                source: resource.caseStudy.sttRecovery,
                isProblemSolving: true,
                items: [
                    { id: "problem", phase: "problem" },
                    { id: "errorPolicy", phase: "process" },
                    { id: "authRecovery", phase: "process" },
                    { id: "scrollOwnership", phase: "process" },
                    { id: "verification", phase: "result" },
                ],
            },
            {
                id: "contributions",
                source: resource.contributions,
                items: [
                    { id: "consultation" },
                    { id: "history" },
                    { id: "roles" },
                    { id: "resilience" },
                ],
            },
            {
                id: "verification",
                source: resource.verification,
                items: [
                    { id: "stateTransition" },
                    { id: "eventConsistency" },
                    { id: "recovery" },
                ],
            },
        ]),
        flow: resource.flow,
    };
}
