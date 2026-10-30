import { parseProjectMarkdown, type ProjectCaseStudySection } from "./parseProjectMarkdown";
import { readProjectDocument } from "./projectMetadata";
import { projectDocuments } from "./projectDocuments";
import type { Language } from "@/lib/i18n/language";
import type { ProjectSlug } from "@/features/portfolio/types/projectTypes";
import type { ProjectMediaBlock, ProjectMetadata } from "./projectMetadata";

export type { ProjectMediaBlock } from "./projectMetadata";

export type { ProjectCaseStudyPhase, ProjectCaseStudySection } from "./parseProjectMarkdown";

export type ProjectDetailPageContent = {
    title: string;
    summary: string;
    stack: readonly string[];
    stackLabel: string;
    overviewTitle: string;
    overviewDescription: string;
    contexts: readonly { id: string; label: string; description: string }[];
    keyOutcome?: ProjectMetadata["keyOutcome"];
    sections: readonly ProjectCaseStudySection[];
    problemSolvingLabel: string;
    architecture?: ProjectMediaBlock;
    walkthrough?: ProjectMediaBlock;
};

export function getProjectDetailPageContent(
    slug: ProjectSlug,
    language: Language,
): ProjectDetailPageContent {
    return createProjectDetailPageContent(projectDocuments[slug][language]);
}

export function createProjectDetailPageContent(source: string): ProjectDetailPageContent {
    const { metadata, body } = readProjectDocument(source);
    const nodes = parseProjectBody(body);

    return {
        title: metadata.title,
        summary: metadata.summary,
        stack: metadata.stack,
        stackLabel: metadata.stackLabel,
        overviewTitle: metadata.projectIntro.title,
        overviewDescription: metadata.projectIntro.description,
        contexts: Object.entries(metadata.projectContext).map(
            ([id, context]) => ({ id, ...context }),
        ),
        keyOutcome: metadata.keyOutcome,
        sections: parseProjectMarkdown(nodes.cases),
        problemSolvingLabel: metadata.problemSolvingLabel,
        architecture: metadata.architecture && {
            ...metadata.architecture,
            markdown: nodes.architecture,
        },
        walkthrough: metadata.walkthrough && {
            ...metadata.walkthrough,
            markdown: nodes.walkthrough,
        },
    };
}

function parseProjectBody(body: string) {
    const blocks = { architecture: "", walkthrough: "" };
    const cases = body.replace(
        /<!-- (architecture|walkthrough) -->\s*([\s\S]*?)\s*<!-- \/\1 -->/g,
        (_, kind: keyof typeof blocks, markdown: string) => {
            blocks[kind] = markdown;
            return "";
        },
    );
    return { ...blocks, cases };
}
