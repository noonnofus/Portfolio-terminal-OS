import { describe, expect, it } from "vitest";
import { getProjectDetailPageContent } from "../projectDetailContent";
import type { Language } from "@/lib/i18n/language";
import type { ProjectSlug } from "@/features/portfolio/types/projectTypes";

function loader(slug: ProjectSlug) {
    return (language: Language) => ({ page: getProjectDetailPageContent(slug, language) });
}
const getPortfolioProjectContent = loader("portfolio");
const getOptigenProjectContent = loader("optigen");
const getMcpProjectContent = loader("mcp");
const getVoiceGatewayProjectContent = loader("voice-gateway");
const getKepcoProjectContent = loader("kepco");
const getWchmsProjectContent = loader("wchms");
const getFlareProjectContent = loader("flare");

const projectContentLoaders = [
    getPortfolioProjectContent,
    getOptigenProjectContent,
    getMcpProjectContent,
    getVoiceGatewayProjectContent,
    getKepcoProjectContent,
    getWchmsProjectContent,
    getFlareProjectContent,
] as const;

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
            expect(ko.sections.map((section) => Object.keys(section.phases))).toEqual(
                en.sections.map((section) => Object.keys(section.phases)),
            );
        }
    });

    it("provides complete content for every project language", () => {
        for (const getProjectContent of projectContentLoaders) {
            for (const language of ["ko", "en"] as const) {
                const page = getProjectContent(language).page;

                expect(page.title).not.toBe("");
                expect(page.summary).not.toBe("");
                expect(page.stack.length).toBeGreaterThan(0);
                expect(page.overviewTitle).not.toBe("");
                expect(page.overviewDescription).not.toBe("");
                for (const media of [page.architecture, page.walkthrough]) {
                    if (media) {
                        expect(media.title).not.toBe("");
                        expect(media.description).not.toBe("");
                        expect(media.markdown.trim()).not.toBe("");
                    }
                }
                expect(page.contexts).toHaveLength(3);
                expect(page.keyOutcome !== undefined).toBe(
                    getProjectContent === getKepcoProjectContent,
                );
                expect(page.sections.length).toBeGreaterThan(0);
                expect(
                    page.sections.every(
                        (section) =>
                            section.title !== "" &&
                            Object.values(section.phases).every(
                                (markdown) => markdown.trim() !== "",
                            ),
                    ),
                ).toBe(true);
            }
        }
    });

    it("uses the multi-tab broadcast case and preserves KEPCO operating outcomes", () => {
        for (const language of ["ko", "en"] as const) {
            const { page } = getKepcoProjectContent(language);

            expect(page.sections.map((section) => section.id)).toEqual([
                "liveTranscript",
                "consultationReview",
                "multiTabAuth",
            ]);
            const authSection = page.sections.find(
                (section) => section.id === "multiTabAuth",
            );
            expect(authSection?.phases.process).toContain("BroadcastChannel");
            expect(authSection?.phases.process).toContain("Web Lock");
            expect(page.keyOutcome?.value).toBe(
                language === "ko"
                    ? "전체 상담사의 60% 사용, 고객 평균 대기 시간 30% 감소"
                    : "Used by 60% of agents, with average customer wait time reduced by 30%",
            );
            expect(page.architecture?.markdown).toContain("BroadcastChannel");
        }
    });

    it("covers OptiGen frontend features, streaming, performance, and shared UI", () => {
        for (const language of ["ko", "en"] as const) {
            const { page } = getOptigenProjectContent(language);

            expect(page.sections.map((section) => section.id)).toEqual([
                "productWorkspace",
                "streamingConversation",
                "performance",
                "deliveryFoundation",
            ]);
            const streamingSection = page.sections.find(
                (section) => section.id === "streamingConversation",
            );
            expect(streamingSection?.phases.process).toContain("SSE");
            expect(streamingSection?.phases.process).toContain("ResizeObserver");
            expect(streamingSection?.phases.process).toContain("AbortController");
        }
    });

    it("uses the Desktop ownership and app-contract cases for the portfolio", () => {
        for (const language of ["ko", "en"] as const) {
            const { page } = getPortfolioProjectContent(language);

            expect(page.sections.map((section) => section.id)).toEqual([
                "ownership",
                "appContract",
            ]);
            expect(page.overviewDescription).toContain("Playwright");
            expect(page.architecture?.markdown).toContain("appLoaderRegistry");
        }
    });

    it("uses only the documented problem-solving cases for the remaining projects", () => {
        const contracts = [
            [getMcpProjectContent, ["performance", "addressCorrection"]],
            [
                getVoiceGatewayProjectContent,
                ["callFlow", "sttAccuracy", "providerArchitecture", "audioPacing"],
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
