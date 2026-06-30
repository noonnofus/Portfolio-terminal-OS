import { describe, expect, it } from "vitest";
import { projectSlugs } from "@/features/gui/registry/appTypes";
import { projectCatalog } from "@/shared/content/portfolio/catalog";
import { projectSummaries } from "@/shared/content/portfolio/projectSummaries";

describe("portfolio project summaries", () => {
    it("covers the exact project slug allowlist once", () => {
        const summarySlugs = projectSummaries
            .map((project) => project.slug)
            .toSorted();

        expect(summarySlugs).toEqual(projectSlugs.toSorted());
        expect(new Set(summarySlugs).size).toBe(summarySlugs.length);
        expect(Object.keys(projectCatalog).toSorted()).toEqual(
            projectSlugs.toSorted(),
        );
    });

    it("has complete localized list content and compact stacks", () => {
        for (const project of projectSummaries) {
            expect(project.content.ko.title).not.toBe("");
            expect(project.content.ko.summary).not.toBe("");
            expect(project.content.en.title).not.toBe("");
            expect(project.content.en.summary).not.toBe("");
            expect(project.stack.length).toBeGreaterThan(0);
            expect(project.stack.length).toBeLessThanOrEqual(4);
        }
    });

    it("keeps full media as paths rather than loading detail modules", () => {
        const media = projectSummaries.flatMap(
            (project) => project.media,
        );

        expect(media.every((path) => path.startsWith("/videos/"))).toBe(
            true,
        );
    });
});
