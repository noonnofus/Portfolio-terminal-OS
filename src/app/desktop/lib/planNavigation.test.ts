import { describe, expect, it } from "vitest";
import { planNavigation } from "@/app/desktop/lib/planNavigation";
import type {
    DesktopHistoryState,
    DesktopWorkspaceState,
} from "@/app/desktop/types/navigationTypes";

const aboutEntry: DesktopHistoryState = {
    desktop: {
        entryId: "desktop-0",
        view: { app: "about", lang: "ko" },
        from: null,
    },
};

function createState(
    overrides: Partial<DesktopWorkspaceState> = {},
): DesktopWorkspaceState {
    return {
        windows: [
            {
                windowId: "about",
                appId: "about",
                minimized: false,
                activationOrder: 1,
            },
        ],
        focus: { mode: "windows", activeWindowId: "about" },
        nextEntrySequence: 1,
        ...overrides,
    };
}

describe("planNavigation", () => {
    it("pushes every different user-selected active view", () => {
        const projectsPlan = planNavigation(
            createState(),
            "ko",
            { type: "open-app", appId: "projects", params: {} },
            aboutEntry,
        );

        expect(projectsPlan.historyEffect).toMatchObject({
            type: "push",
            url: "/desktop?app=projects",
            entry: {
                desktop: {
                    entryId: "desktop-1",
                    view: { app: "projects", lang: "ko" },
                    from: { app: "about", lang: "ko" },
                },
            },
        });

        const projectsEntry =
            projectsPlan.historyEffect.type === "push"
                ? projectsPlan.historyEffect.entry
                : null;

        expect(projectsEntry).not.toBeNull();

        const aboutPlan = planNavigation(
            createState({ nextEntrySequence: 2 }),
            "ko",
            { type: "open-app", appId: "about", params: {} },
            projectsEntry,
        );

        expect(aboutPlan.historyEffect).toMatchObject({
            type: "push",
            url: "/desktop",
            entry: {
                desktop: {
                    entryId: "desktop-2",
                    from: { app: "projects", lang: "ko" },
                },
            },
        });
    });

    it("does not write history when the selected view is already active", () => {
        const plan = planNavigation(
            createState(),
            "ko",
            { type: "open-app", appId: "about", params: {} },
            aboutEntry,
        );

        expect(plan.historyEffect).toEqual({ type: "none" });
        expect(plan.storeCommands).toEqual([
            { type: "open-app", appId: "about", params: {} },
        ]);
    });

    it("plans back when close returns to the history provenance view", () => {
        const projectsEntry: DesktopHistoryState = {
            desktop: {
                entryId: "desktop-1",
                view: { app: "projects", lang: "ko" },
                from: { app: "about", lang: "ko" },
            },
        };
        const state = createState({
            windows: [
                {
                    windowId: "about",
                    appId: "about",
                    minimized: false,
                    activationOrder: 1,
                },
                {
                    windowId: "projects",
                    appId: "projects",
                    minimized: false,
                    activationOrder: 2,
                },
            ],
            focus: { mode: "windows", activeWindowId: "projects" },
        });

        const plan = planNavigation(
            state,
            "ko",
            { type: "close-window", windowId: "projects" },
            projectsEntry,
        );

        expect(plan.historyEffect).toMatchObject({
            type: "back",
            expectedEntryId: null,
            fallbackEntry: {
                desktop: {
                    entryId: "desktop-1",
                    view: { app: "about", lang: "ko" },
                },
            },
            fallbackUrl: "/desktop",
        });
    });

    it("replaces derived close state when provenance does not match", () => {
        const contactEntry: DesktopHistoryState = {
            desktop: {
                entryId: "desktop-3",
                view: { app: "contact", lang: "ko" },
                from: { app: "terminal", lang: "ko" },
            },
        };
        const state = createState({
            windows: [
                {
                    windowId: "about",
                    appId: "about",
                    minimized: false,
                    activationOrder: 2,
                },
                {
                    windowId: "contact",
                    appId: "contact",
                    minimized: false,
                    activationOrder: 3,
                },
            ],
            focus: { mode: "windows", activeWindowId: "contact" },
        });

        const plan = planNavigation(
            state,
            "ko",
            { type: "close-window", windowId: "contact" },
            contactEntry,
        );

        expect(plan.historyEffect).toMatchObject({
            type: "replace",
            url: "/desktop",
            entry: {
                desktop: {
                    entryId: "desktop-3",
                    view: { app: "about", lang: "ko" },
                },
            },
        });
    });

    it("applies popstate without writing history", () => {
        const plan = planNavigation(
            createState(),
            "ko",
            {
                type: "popstate",
                entry: aboutEntry,
                view: { app: "about", lang: "ko" },
            },
            aboutEntry,
        );

        expect(plan).toEqual({
            storeCommands: [
                {
                    type: "apply-url-state",
                    view: { app: "about", lang: "ko" },
                },
            ],
            historyEffect: { type: "none" },
            languageEffect: "ko",
        });
    });

    it("changes language through a dedicated effect while preserving the view", () => {
        const plan = planNavigation(
            createState(),
            "ko",
            { type: "change-language", language: "en" },
            aboutEntry,
        );

        expect(plan).toEqual({
            storeCommands: [],
            historyEffect: {
                type: "replace",
                entry: {
                    desktop: {
                        entryId: "desktop-0",
                        view: { app: "about", lang: "en" },
                        from: null,
                    },
                },
                url: "/en/desktop",
            },
            languageEffect: "en",
        });
    });
});
