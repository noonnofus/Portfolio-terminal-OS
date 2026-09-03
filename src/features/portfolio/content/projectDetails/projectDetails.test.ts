import { describe, expect, it } from "vitest";
import { getFlareProjectContent } from "./flare";
import { getKepcoProjectContent } from "./kepco";
import { getMcpProjectContent } from "./mcp";
import { getOptigenProjectContent } from "./optigen";
import { getPortfolioProjectContent } from "./portfolio";
import { getVoiceGatewayProjectContent } from "./voiceGateway";
import { getWchmsProjectContent } from "./wchms";

const projectContentLoaders = [
    getPortfolioProjectContent,
    getOptigenProjectContent,
    getMcpProjectContent,
    getVoiceGatewayProjectContent,
    getKepcoProjectContent,
    getWchmsProjectContent,
    getFlareProjectContent,
] as const;

function getSectionItemSignatures(
    sections: readonly {
        items: readonly { id: string; phase?: string }[];
    }[],
) {
    return sections.map((section) =>
        section.items.map((item) => [item.id, item.phase]),
    );
}

describe("project detail content", () => {
    it("keeps Korean and English project page structures aligned", () => {
        for (const getProjectContent of projectContentLoaders) {
            const ko = getProjectContent("ko").page;
            const en = getProjectContent("en").page;

            expect(ko.contexts.map((context) => context.id)).toEqual(
                en.contexts.map((context) => context.id),
            );
            expect(ko.sections.map((section) => section.id)).toEqual(
                en.sections.map((section) => section.id),
            );
            expect(getSectionItemSignatures(ko.sections)).toEqual(
                getSectionItemSignatures(en.sections),
            );
        }
    });

    it("provides complete content for every project language", () => {
        for (const getProjectContent of projectContentLoaders) {
            for (const language of ["ko", "en"] as const) {
                const page = getProjectContent(language).page;

                expect(page.title).not.toBe("");
                expect(page.summary).not.toBe("");
                expect(page.contexts).toHaveLength(3);
                expect(page.sections.length).toBeGreaterThan(0);
                expect(
                    page.sections.every(
                        (section) =>
                            section.title !== "" &&
                            section.description !== "" &&
                            section.items.every(
                                (item) => item.description !== "",
                            ),
                    ),
                ).toBe(true);
            }
        }
    });
});
