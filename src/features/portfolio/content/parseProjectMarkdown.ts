import { unified } from "unified";
import remarkParse from "remark-parse";
import { toString } from "mdast-util-to-string";

export type ProjectCaseStudyPhase = "problem" | "process" | "result";

export type ProjectCaseStudySection = {
    id: string;
    title: string;
    phases: Record<ProjectCaseStudyPhase, string>;
};

const phaseByHeading: Record<string, ProjectCaseStudyPhase> = {
    개요: "problem",
    "세부 내용": "process",
    성과: "result",
    Overview: "problem",
    Implementation: "process",
    Outcomes: "result",
};

export function parseProjectMarkdown(markdown: string): ProjectCaseStudySection[] {
    const nodes = unified().use(remarkParse).parse(markdown).children;
    const caseIndexes = nodes.flatMap((node, index) =>
        node.type === "heading" && node.depth === 2 ? [index] : [],
    );
    if (caseIndexes.length === 0) {
        throw new Error("Project Markdown must contain at least one case heading.");
    }
    const ids = new Set<string>();

    return caseIndexes.map((index, caseIndex) => {
        const heading = nodes[index];
        const marker = nodes[index - 1];
        const id = marker?.type === "html"
            ? /^<!-- case: ([\w-]+) -->$/.exec(marker.value)?.[1]
            : undefined;
        if (!id || ids.has(id)) {
            throw new Error("Each project Markdown case needs a unique <!-- case: ID --> marker.");
        }
        ids.add(id);

        const nextIndex = caseIndexes[caseIndex + 1] ?? nodes.length;
        const end = nextIndex < nodes.length
            ? nodes[nextIndex - 1].position!.start.offset!
            : markdown.length;
        const phaseHeadings = nodes.slice(index + 1, nextIndex).filter(
            (node) => node.type === "heading" && node.depth === 3,
        );
        const phases: Partial<Record<ProjectCaseStudyPhase, string>> = {};

        for (const [phaseIndex, phaseHeading] of phaseHeadings.entries()) {
            const phase = phaseByHeading[toString(phaseHeading)];
            if (!phase || phases[phase] !== undefined) {
                throw new Error(`Unknown or duplicate phase heading in project case: ${id}`);
            }
            phases[phase] = markdown.slice(
                phaseHeading.position!.end.offset!,
                phaseHeadings[phaseIndex + 1]?.position!.start.offset ?? end,
            ).trim();
        }

        const { problem, process, result } = phases;
        if (!problem || !process || !result) {
            throw new Error(`Project case ${id} must include an overview, implementation, and outcomes.`);
        }
        return { id, title: toString(heading), phases: { problem, process, result } };
    });
}
