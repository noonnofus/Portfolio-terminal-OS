export type ProjectCaseStudyPhase = "problem" | "process" | "result";

export type ProjectDetailText = {
    title: string;
    description: string;
};

export type ProjectDetailItem = ProjectDetailText;

export type ProjectDetailSectionSource = ProjectDetailText & {
    items: Record<string, ProjectDetailItem>;
};

export type ProjectDetailResource = {
    title: string;
    summary: string;
    stackLabel: string;
    problemSolvingLabel: string;
    keyOutcome: {
        label: string;
        value: string;
        description?: string;
    };
    projectContext: Record<
        string,
        {
            label: string;
            description: string;
        }
    >;
};

export type ProjectCaseStudyContext = {
    id: string;
    label: string;
    description: string;
};

export type ProjectCaseStudySection = {
    id: string;
    title: string;
    description: string;
    isProblemSolving?: boolean;
    items: readonly {
        id: string;
        title: string;
        description: string;
        phase?: ProjectCaseStudyPhase;
    }[];
};

export type ProjectDetailPageContent = {
    title: string;
    summary: string;
    stackLabel: string;
    overviewTitle: string;
    overviewDescription: string;
    contexts: readonly ProjectCaseStudyContext[];
    keyOutcome: ProjectDetailResource["keyOutcome"];
    sections: readonly ProjectCaseStudySection[];
    problemSolvingLabel: string;
};

type SectionItemSpec = {
    id: string;
    phase?: ProjectCaseStudyPhase;
};

type SectionSpec = {
    id: string;
    source: ProjectDetailSectionSource;
    items: readonly SectionItemSpec[];
    isProblemSolving?: boolean;
};

export function createProjectDetailPageContent(
    resource: ProjectDetailResource,
    overview: ProjectDetailText,
    sections: readonly SectionSpec[],
): ProjectDetailPageContent {
    return {
        title: resource.title,
        summary: resource.summary,
        stackLabel: resource.stackLabel,
        overviewTitle: overview.title,
        overviewDescription: overview.description,
        contexts: Object.entries(resource.projectContext).map(
            ([id, context]) => ({ id, ...context }),
        ),
        keyOutcome: resource.keyOutcome,
        sections: sections.map((section) => ({
            id: section.id,
            title: section.source.title,
            description: section.source.description,
            ...(section.isProblemSolving
                ? { isProblemSolving: true }
                : {}),
            items: section.items.map((item) => ({
                ...item,
                ...section.source.items[item.id],
            })),
        })),
        problemSolvingLabel: resource.problemSolvingLabel,
    };
}
