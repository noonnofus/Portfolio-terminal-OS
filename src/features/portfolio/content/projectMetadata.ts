import { parse } from "yaml";

export type ProjectMediaBlock = {
    title: string;
    description: string;
    markdown: string;
    alt?: string;
    caption?: string;
    sectionId?: string;
    wide?: boolean;
    scrollLabel?: string;
    loading?: string;
    error?: string;
    processDescription?: string;
    width?: number;
    height?: number;
    unsupported?: string;
};

export type ProjectMetadata = {
    title: string;
    summary: string;
    stack: readonly string[];
    stackLabel: string;
    problemSolvingLabel: string;
    projectIntro: { title: string; description: string };
    projectContext: Record<string, { label: string; description: string }>;
    keyOutcome?: { label: string; value: string; description?: string };
    architecture?: Omit<ProjectMediaBlock, "markdown">;
    walkthrough?: Omit<ProjectMediaBlock, "markdown">;
};

export function readProjectDocument(source: string) {
    const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(source);
    if (!frontmatter) throw new Error("Project Markdown needs YAML frontmatter.");

    // Repository-owned metadata is checked with every localized project in content tests.
    const metadata = parse(frontmatter[1]) as ProjectMetadata;
    return { metadata, body: source.slice(frontmatter[0].length) };
}
