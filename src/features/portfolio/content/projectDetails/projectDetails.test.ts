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
                        (section) => section.isProblemSolving,
                    ),
                ).toBe(true);
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

    it("uses the multi-tab broadcast case and preserves KEPCO operating outcomes", () => {
        for (const language of ["ko", "en"] as const) {
            const { page, flow } = getKepcoProjectContent(language);

            expect(page.sections.map((section) => section.id)).toEqual([
                "multiTabAuth",
            ]);
            expect(page.sections[0].id).toBe("multiTabAuth");
            expect(page.sections[0].items.map((item) => item.id)).toEqual([
                "securityBackground",
                "problem",
                "idleSync",
                "firstAttempt",
                "refreshOwnership",
                "resultSharing",
                "verification",
            ]);
            expect(page.keyOutcome.value).toBe(
                language === "ko"
                    ? "전체 상담사의 60% 사용, 고객 평균 대기 시간 30% 감소"
                    : "Used by 60% of agents, with average customer wait time reduced by 30%",
            );
            expect(flow.diagram.broadcast).toContain("BroadcastChannel");
        }
    });

    it("uses the streaming-layout case and integrates the product foundation into the OptiGen overview", () => {
        for (const language of ["ko", "en"] as const) {
            const { page } = getOptigenProjectContent(language);

            expect(page.keyOutcome.value).toContain("POC");
            expect(page.sections.map((section) => section.id)).toEqual([
                "streamingLayout",
            ]);
            expect(page.overviewDescription).toContain("Storybook");
            expect(page.sections[0].items.map((item) => item.id)).toEqual([
                "growingResponse",
                "spacerLayout",
                "measurement",
                "streamLifecycle",
                "readingPosition",
            ]);
        }
    });

    it("uses the GUI ownership and app-contract cases for the portfolio", () => {
        for (const language of ["ko", "en"] as const) {
            const { page, architecture } = getPortfolioProjectContent(language);

            expect(page.sections.map((section) => section.id)).toEqual([
                "ownership",
                "appContract",
            ]);
            expect(page.overviewDescription).toContain("Playwright");
            expect(page.keyOutcome.value).toContain(
                language === "ko" ? "등록, 로딩, 탐색 계약" : "registering, loading, and navigating",
            );
            expect(architecture.diagram.loader).toContain("appLoaderRegistry");
        }
    });

    it("uses only the documented problem-solving cases for the remaining projects", () => {
        const contracts = [
            [getMcpProjectContent, ["performance", "progressProtocol"]],
            [
                getVoiceGatewayProjectContent,
                ["providerArchitecture", "audioPacing"],
            ],
            [getWchmsProjectContent, ["learningMaterialAlignment"]],
            [getFlareProjectContent, ["informationFlow"]],
        ] as const;

        for (const [getProjectContent, expectedSections] of contracts) {
            for (const language of ["ko", "en"] as const) {
                expect(
                    getProjectContent(language).page.sections.map(
                        (section) => section.id,
                    ),
                ).toEqual(expectedSections);
            }
        }
    });
});
