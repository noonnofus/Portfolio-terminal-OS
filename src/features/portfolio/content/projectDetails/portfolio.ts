import type { Language } from "@/lib/i18n/language";
import ko from "@/features/portfolio/i18n/ko/Portfolio.json";
import en from "@/features/portfolio/i18n/en/Portfolio.json";
import {
    type ProjectCaseStudySection,
    type ProjectDetailResource,
    type ProjectDetailText,
} from "../projectDetailContent";

type PortfolioCase = {
    title: string;
    context: string;
    problem: string;
    decision: string;
    result: string;
};

type PortfolioResource = ProjectDetailResource & {
    intent: ProjectDetailText;
    cases: Record<string, PortfolioCase>;
    otherContributions: ProjectDetailText;
    architecture: ProjectDetailText & {
        alt: string;
        caption: string;
    };
};

const resources: Record<Language, PortfolioResource> = { ko, en };

function toProblemSolvingSection(
    id: string,
    source: PortfolioCase,
): ProjectCaseStudySection {
    return {
        id,
        title: source.title,
        description: source.context,
        isProblemSolving: true,
        items: [
            {
                id: "problem",
                phase: "problem",
                title: "",
                description: source.problem,
            },
            {
                id: "process",
                phase: "process",
                title: "",
                description: source.decision,
            },
            {
                id: "result",
                phase: "result",
                title: "",
                description: source.result,
            },
        ],
    };
}

export function getPortfolioProjectContent(language: Language) {
    const resource = resources[language];

    return {
        page: {
            title: resource.title,
            summary: resource.summary,
            stackLabel: resource.stackLabel,
            overviewTitle: resource.intent.title,
            overviewDescription: resource.intent.description,
            contexts: Object.entries(resource.projectContext).map(
                ([id, context]) => ({ id, ...context }),
            ),
            keyOutcome: resource.keyOutcome,
            sections: [
                toProblemSolvingSection("navigation", resource.cases.navigation),
                toProblemSolvingSection("directory", resource.cases.directory),
                {
                    id: "otherContributions",
                    title: resource.otherContributions.title,
                    description: resource.otherContributions.description,
                    items: ["content", "accessibility"].map((id) => ({
                        id,
                        title: resource.cases[id].title,
                        description: resource.cases[id].result,
                    })),
                },
            ],
            problemSolvingLabel: resource.problemSolvingLabel,
        },
        architecture: resource.architecture,
    };
}
