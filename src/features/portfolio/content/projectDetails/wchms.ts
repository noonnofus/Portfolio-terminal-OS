import type { Language } from "@/lib/i18n/language";
import ko from "@/features/portfolio/i18n/ko/WCHMS.json";
import en from "@/features/portfolio/i18n/en/WCHMS.json";
import {
    createProjectDetailPageContent,
    type ProjectDetailResource,
    type ProjectDetailSectionSource,
    type ProjectDetailText,
} from "../projectDetailContent";

type WchmsResource = ProjectDetailResource & {
    projectIntro: ProjectDetailText;
    caseStudy: Record<string, ProjectDetailSectionSource>;
    walkthrough: ProjectDetailText & {
        unsupported: string;
    };
};

const resources: Record<Language, WchmsResource> = { ko, en };

export function getWchmsProjectContent(language: Language) {
    const resource = resources[language];

    return {
        page: createProjectDetailPageContent(resource, resource.projectIntro, [
            {
                id: "learningMaterialAlignment",
                source: resource.caseStudy.learningMaterialAlignment,
                isProblemSolving: true,
                items: [
                    { id: "separateStandards", phase: "problem" },
                    { id: "sharedDifficulty", phase: "process" },
                    { id: "contentModel", phase: "process" },
                    { id: "connectedFlow", phase: "result" },
                ],
            },
            {
                id: "implementation",
                source: resource.caseStudy.implementation,
                items: [
                    { id: "selfStudy" },
                    { id: "pdfMaterials" },
                    { id: "adminWorkspace" },
                    { id: "localization" },
                ],
            },
        ]),
        walkthrough: resource.walkthrough,
    };
}
