import { describe, expect, it } from "vitest";
import { projectSlugs } from "@/features/gui/registry/appTypes";
import { projectManifest } from "@/shared/content/portfolio/projectManifest";
import { getPortfolioContent } from "@/shared/content/portfolio/getPortfolioContent";
import { projectSummaries } from "@/shared/content/portfolio/projectSummaries";
import { languages } from "@/shared/i18n/language";

describe("portfolio project summaries", () => {
    it("covers the exact project slug allowlist once", () => {
        const summarySlugs = projectSummaries
            .map((project) => project.slug)
            .toSorted();

        expect(summarySlugs).toEqual(projectSlugs.toSorted());
        expect(new Set(summarySlugs).size).toBe(summarySlugs.length);
        expect(Object.keys(projectManifest).toSorted()).toEqual(
            projectSlugs.toSorted(),
        );
    });

    it("keeps compact manifest stacks and complete localized resume content", () => {
        for (const project of projectSummaries) {
            expect(project.stack.length).toBeGreaterThan(0);
            expect(project.stack.length).toBeLessThanOrEqual(4);
        }

        for (const language of languages) {
            const projects = getPortfolioContent(language).projects;

            expect(projects.map((project) => project.slug).toSorted()).toEqual(
                projectSlugs.toSorted(),
            );
            for (const project of projects) {
                expect(project.title).not.toBe("");
                expect(project.summary).not.toBe("");
            }
        }
    });

    it("does not expose public project links or media", () => {
        for (const project of projectSummaries) {
            expect(project.status).toBe("private");
            expect(project.links).toEqual({});
            expect(project.media).toEqual([]);
        }
    });
});
