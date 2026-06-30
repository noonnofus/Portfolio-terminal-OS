import {
    getGuiUrlStateForApp,
    getGuiUrlStateForCommand,
    isSameGuiUrlState,
    serializeGuiUrl,
} from "@/features/gui/registry/parseGuiAppTarget";
import type { GuiUrlState } from "@/features/gui/registry/appTypes";
import type {
    GuiHistoryState,
    GuiWindowSnapshot,
    GuiWorkspaceState,
    HistoryEffect,
    NavigationEvent,
    NavigationPlan,
    StoreCommand,
} from "@/features/gui/navigation/navigationTypes";

function createHistoryEntry(
    state: GuiWorkspaceState,
    view: GuiUrlState,
    from: GuiUrlState | null,
): GuiHistoryState {
    return {
        gui: {
            entryId: `gui-${state.nextEntrySequence}`,
            view,
            from,
        },
    };
}

function getNextWindow(
    windows: readonly GuiWindowSnapshot[],
    excludedWindowId: string,
): GuiWindowSnapshot | null {
    const candidates = windows
        .filter(
            (window) =>
                window.windowId !== excludedWindowId && !window.minimized,
        )
        .toSorted(
            (left, right) => right.activationOrder - left.activationOrder,
        );

    return candidates[0] ?? null;
}

function getDerivedView(
    state: GuiWorkspaceState,
    excludedWindowId: string,
): GuiUrlState {
    const nextWindow = getNextWindow(state.windows, excludedWindowId);
    return nextWindow === null
        ? { app: "desktop", lang: state.language }
        : getGuiUrlStateForApp(nextWindow.appId, state.language);
}

function replaceCurrentEntry(
    state: GuiWorkspaceState,
    historyState: GuiHistoryState | null,
    view: GuiUrlState,
): HistoryEffect {
    const entry =
        historyState ??
        ({
            gui: {
                entryId: "gui-bootstrap",
                view,
                from: null,
            },
        } satisfies GuiHistoryState);

    const replacement: GuiHistoryState = {
        gui: {
            ...entry.gui,
            view,
        },
    };

    return {
        type: "replace",
        entry: replacement,
        url: serializeGuiUrl(view, state.urlBasePath),
    };
}

function planDerivedWindowChange(
    state: GuiWorkspaceState,
    event: Extract<
        NavigationEvent,
        { type: "close-window" | "minimize-window" }
    >,
    historyState: GuiHistoryState | null,
): NavigationPlan {
    const targetView = getDerivedView(state, event.windowId);
    const storeCommand: StoreCommand = event;

    if (
        historyState !== null &&
        isSameGuiUrlState(historyState.gui.view, targetView)
    ) {
        return {
            storeCommands: [storeCommand],
            historyEffect: { type: "none" },
        };
    }

    if (
        historyState?.gui.from !== null &&
        historyState?.gui.from !== undefined &&
        isSameGuiUrlState(historyState.gui.from, targetView)
    ) {
        const fallbackEntry: GuiHistoryState = {
            gui: {
                ...historyState.gui,
                view: targetView,
            },
        };
        return {
            storeCommands: [storeCommand],
            historyEffect: {
                type: "back",
                expectedEntryId: null,
                fallbackEntry,
                fallbackUrl: serializeGuiUrl(
                    targetView,
                    state.urlBasePath,
                ),
            },
        };
    }

        return {
            storeCommands: [storeCommand],
            historyEffect: replaceCurrentEntry(state, historyState, targetView),
    };
}

export function planNavigation(
    state: GuiWorkspaceState,
    event: NavigationEvent,
    historyState: GuiHistoryState | null,
): NavigationPlan {
    switch (event.type) {
        case "open-app": {
            const targetView = getGuiUrlStateForCommand(event, state.language);

            if (
                historyState !== null &&
                isSameGuiUrlState(historyState.gui.view, targetView)
            ) {
                return {
                    storeCommands: [event],
                    historyEffect: { type: "none" },
                };
            }

            const entry = createHistoryEntry(
                state,
                targetView,
                historyState?.gui.view ?? null,
            );
            return {
                storeCommands: [event, { type: "advance-entry-sequence" }],
                historyEffect: {
                    type: "push",
                    entry,
                    url: serializeGuiUrl(targetView, state.urlBasePath),
                },
            };
        }
        case "show-desktop": {
            const targetView: GuiUrlState = {
                app: "desktop",
                lang: state.language,
            };

            if (
                historyState !== null &&
                isSameGuiUrlState(historyState.gui.view, targetView)
            ) {
                return {
                    storeCommands: [event],
                    historyEffect: { type: "none" },
                };
            }

            const entry = createHistoryEntry(
                state,
                targetView,
                historyState?.gui.view ?? null,
            );
            return {
                storeCommands: [event, { type: "advance-entry-sequence" }],
                historyEffect: {
                    type: "push",
                    entry,
                    url: serializeGuiUrl(targetView, state.urlBasePath),
                },
            };
        }
        case "change-language": {
            const currentView =
                historyState?.gui.view ??
                ({ app: "about", lang: state.language } satisfies GuiUrlState);
            const targetView: GuiUrlState =
                currentView.app === "project"
                    ? {
                          app: "project",
                          slug: currentView.slug,
                          lang: event.language,
                      }
                    : { app: currentView.app, lang: event.language };

            return {
                storeCommands: [event],
                historyEffect: replaceCurrentEntry(
                    state,
                    historyState,
                    targetView,
                ),
            };
        }
        case "close-window":
        case "minimize-window":
            return planDerivedWindowChange(state, event, historyState);
        case "popstate":
            return {
                storeCommands: [
                    { type: "apply-url-state", view: event.view },
                ],
                historyEffect: { type: "none" },
            };
    }
}
