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
    flow: ProjectDetailText & {
      alt: string;
      caption: string;
      loading: string;
      error: string;
      scrollLabel: string;
      diagram: Record<string, string>;
    };
};

const resources: Record<Language, KepcoResource> = { ko, en };

export function getKepcoProjectContent(language: Language) {
    const resource = resources[language];

    return {
        page: createProjectDetailPageContent(resource, resource.projectIntro, [
            {
                id: "multiTabAuth",
                source: resource.caseStudy.multiTabAuth,
                isProblemSolving: true,
                items: [
                    { id: "securityBackground", phase: "problem" },
                    { id: "problem", phase: "problem" },
                    { id: "idleSync", phase: "process" },
                    { id: "firstAttempt", phase: "process" },
                    { id: "refreshOwnership", phase: "process" },
                    { id: "resultSharing", phase: "process" },
                    { id: "verification", phase: "result" },
                ],
            },
        ]),
        flow: resource.flow,
    };
}
