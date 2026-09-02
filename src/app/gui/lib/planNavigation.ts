import {
    getGuiUrlStateForApp,
    getGuiUrlStateForCommand,
    isSameGuiUrlState,
    serializeGuiUrl,
} from "@/app/gui/lib/parseGuiAppTarget";
import type { GuiUrlState } from "@/app/gui/types/appTypes";
import type { Language } from "@/lib/i18n/language";
import type {
    GuiHistoryState,
    GuiWindowSnapshot,
    GuiWorkspaceState,
    HistoryEffect,
    NavigationEvent,
    NavigationPlan,
    StoreCommand,
} from "@/app/gui/types/navigationTypes";

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
    language: Language,
    excludedWindowId: string,
): GuiUrlState {
    const nextWindow = getNextWindow(state.windows, excludedWindowId);
    return nextWindow === null
        ? { app: "desktop", lang: language }
        : getGuiUrlStateForApp(nextWindow.appId, language);
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
    language: Language,
    event: Extract<
        NavigationEvent,
        { type: "close-window" | "minimize-window" }
    >,
    historyState: GuiHistoryState | null,
): NavigationPlan {
    const targetView = getDerivedView(state, language, event.windowId);
    const storeCommand: StoreCommand = event;

    if (
        historyState !== null &&
        isSameGuiUrlState(historyState.gui.view, targetView)
    ) {
        return {
            storeCommands: [storeCommand],
            historyEffect: { type: "none" },
            languageEffect: null,
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
            languageEffect: null,
        };
    }

        return {
            storeCommands: [storeCommand],
            historyEffect: replaceCurrentEntry(state, historyState, targetView),
            languageEffect: null,
    };
}

export function planNavigation(
    state: GuiWorkspaceState,
    language: Language,
    event: NavigationEvent,
    historyState: GuiHistoryState | null,
): NavigationPlan {
    switch (event.type) {
        case "open-app": {
            const targetView = getGuiUrlStateForCommand(event, language);

            if (
                historyState !== null &&
                isSameGuiUrlState(historyState.gui.view, targetView)
            ) {
                return {
                    storeCommands: [event],
                    historyEffect: { type: "none" },
                    languageEffect: null,
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
                languageEffect: null,
            };
        }
        case "show-desktop": {
            const targetView: GuiUrlState = {
                app: "desktop",
                lang: language,
            };

            if (
                historyState !== null &&
                isSameGuiUrlState(historyState.gui.view, targetView)
            ) {
                return {
                    storeCommands: [event],
                    historyEffect: { type: "none" },
                    languageEffect: null,
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
                languageEffect: null,
            };
        }
        case "change-language": {
            const currentView =
                historyState?.gui.view ??
                ({ app: "about", lang: language } satisfies GuiUrlState);
            const targetView: GuiUrlState =
                currentView.app === "project"
                    ? {
                          app: "project",
                          slug: currentView.slug,
                          lang: event.language,
                      }
                    : { app: currentView.app, lang: event.language };

            return {
                storeCommands: [],
                historyEffect: replaceCurrentEntry(
                    state,
                    historyState,
                    targetView,
                ),
                languageEffect: event.language,
            };
        }
        case "close-window":
        case "minimize-window":
            return planDerivedWindowChange(
                state,
                language,
                event,
                historyState,
            );
        case "popstate":
            return {
                storeCommands: [
                    { type: "apply-url-state", view: event.view },
                ],
                historyEffect: { type: "none" },
                languageEffect: event.view.lang,
            };
    }
}
