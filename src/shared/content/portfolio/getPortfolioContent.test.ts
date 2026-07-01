import { describe, expect, it } from "vitest";
import { projectSlugs } from "@/features/gui/registry/appTypes";
import { portfolioContent } from "@/shared/content/portfolio/getPortfolioContent";

describe("portfolio content model", () => {
    it("keeps both languages structurally aligned", () => {
        for (const language of ["ko", "en"] as const) {
            const content = portfolioContent[language];

            expect(content.profile.name).not.toBe("");
            expect(content.experience.length).toBeGreaterThan(0);
            expect(content.skills.length).toBeGreaterThan(0);
            expect(content.education.length).toBeGreaterThan(0);
            expect(content.contact.email).toContain("@");
            expect(
                content.projects.map((project) => project.slug),
            ).toEqual(projectSlugs);
        }
    });

    it("does not duplicate project detail content in Resume data", () => {
        for (const language of ["ko", "en"] as const) {
            for (const project of portfolioContent[language].projects) {
                expect(project.summary.length).toBeLessThan(240);
                expect(project.stack.length).toBeLessThanOrEqual(4);
            }
        }
    });
});
