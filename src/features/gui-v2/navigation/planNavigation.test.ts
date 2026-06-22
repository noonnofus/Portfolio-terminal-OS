import { describe, expect, it } from "vitest";
import { planNavigation } from "@/features/gui-v2/navigation/planNavigation";
import type {
    GuiHistoryState,
    GuiWorkspaceState,
} from "@/features/gui-v2/navigation/navigationTypes";

const aboutEntry: GuiHistoryState = {
    gui: {
        entryId: "gui-0",
        view: { app: "about", lang: "ko" },
        from: null,
    },
};

function createState(
    overrides: Partial<GuiWorkspaceState> = {},
): GuiWorkspaceState {
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
        language: "ko",
        nextEntrySequence: 1,
        urlBasePath: "/gui",
        ...overrides,
    };
}

describe("planNavigation", () => {
    it("pushes every different user-selected active view", () => {
        const projectsPlan = planNavigation(
            createState(),
            { type: "open-app", appId: "projects", params: {} },
            aboutEntry,
        );

        expect(projectsPlan.historyEffect).toMatchObject({
            type: "push",
            url: "/gui?app=projects",
            entry: {
                gui: {
                    entryId: "gui-1",
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
            { type: "open-app", appId: "about", params: {} },
            projectsEntry,
        );

        expect(aboutPlan.historyEffect).toMatchObject({
            type: "push",
            url: "/gui",
            entry: {
                gui: {
                    entryId: "gui-2",
                    from: { app: "projects", lang: "ko" },
                },
            },
        });
    });

    it("does not write history when the selected view is already active", () => {
        const plan = planNavigation(
            createState(),
            { type: "open-app", appId: "about", params: {} },
            aboutEntry,
        );

        expect(plan.historyEffect).toEqual({ type: "none" });
        expect(plan.storeCommands).toEqual([
            { type: "open-app", appId: "about", params: {} },
        ]);
    });

    it("plans back when close returns to the history provenance view", () => {
        const projectsEntry: GuiHistoryState = {
            gui: {
                entryId: "gui-1",
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
            { type: "close-window", windowId: "projects" },
            projectsEntry,
        );

        expect(plan.historyEffect).toEqual({
            type: "back",
            expectedEntryId: null,
        });
    });

    it("replaces derived close state when provenance does not match", () => {
        const contactEntry: GuiHistoryState = {
            gui: {
                entryId: "gui-3",
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
            { type: "close-window", windowId: "contact" },
            contactEntry,
        );

        expect(plan.historyEffect).toMatchObject({
            type: "replace",
            url: "/gui",
            entry: {
                gui: {
                    entryId: "gui-3",
                    view: { app: "about", lang: "ko" },
                },
            },
        });
    });

    it("applies popstate without writing history", () => {
        const plan = planNavigation(
            createState(),
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
        });
    });
});
