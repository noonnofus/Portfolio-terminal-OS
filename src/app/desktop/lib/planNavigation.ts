import {
    getDesktopUrlStateForApp,
    getDesktopUrlStateForCommand,
    isSameDesktopUrlState,
    serializeDesktopUrl,
} from "@/app/desktop/lib/parseDesktopAppTarget";
import type { DesktopUrlState } from "@/app/desktop/types/appTypes";
import type { Language } from "@/lib/i18n/language";
import type {
    DesktopHistoryState,
    DesktopWindowSnapshot,
    DesktopWorkspaceState,
    HistoryEffect,
    NavigationEvent,
    NavigationPlan,
    StoreCommand,
} from "@/app/desktop/types/navigationTypes";

function createHistoryEntry(
    state: DesktopWorkspaceState,
    view: DesktopUrlState,
    from: DesktopUrlState | null,
): DesktopHistoryState {
    return {
        desktop: {
            entryId: `desktop-${state.nextEntrySequence}`,
            view,
            from,
        },
    };
}

function getNextWindow(
    windows: readonly DesktopWindowSnapshot[],
    excludedWindowId: string,
): DesktopWindowSnapshot | null {
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
    state: DesktopWorkspaceState,
    language: Language,
    excludedWindowId: string,
): DesktopUrlState {
    const nextWindow = getNextWindow(state.windows, excludedWindowId);
    return nextWindow === null
        ? { app: "desktop", lang: language }
        : getDesktopUrlStateForApp(nextWindow.appId, language);
}

function replaceCurrentEntry(
    state: DesktopWorkspaceState,
    historyState: DesktopHistoryState | null,
    view: DesktopUrlState,
): HistoryEffect {
    const entry =
        historyState ??
        ({
            desktop: {
                entryId: "desktop-bootstrap",
                view,
                from: null,
            },
        } satisfies DesktopHistoryState);

    const replacement: DesktopHistoryState = {
        desktop: {
            ...entry.desktop,
            view,
        },
    };

    return {
        type: "replace",
        entry: replacement,
        url: serializeDesktopUrl(view),
    };
}

function planDerivedWindowChange(
    state: DesktopWorkspaceState,
    language: Language,
    event: Extract<
        NavigationEvent,
        { type: "close-window" | "minimize-window" }
    >,
    historyState: DesktopHistoryState | null,
): NavigationPlan {
    const targetView = getDerivedView(state, language, event.windowId);
    const storeCommand: StoreCommand = event;

    if (
        historyState !== null &&
        isSameDesktopUrlState(historyState.desktop.view, targetView)
    ) {
        return {
            storeCommands: [storeCommand],
            historyEffect: { type: "none" },
            languageEffect: null,
        };
    }

    if (
        historyState?.desktop.from !== null &&
        historyState?.desktop.from !== undefined &&
        isSameDesktopUrlState(historyState.desktop.from, targetView)
    ) {
        const fallbackEntry: DesktopHistoryState = {
            desktop: {
                ...historyState.desktop,
                view: targetView,
            },
        };
        return {
            storeCommands: [storeCommand],
            historyEffect: {
                type: "back",
                expectedEntryId: null,
                fallbackEntry,
                fallbackUrl: serializeDesktopUrl(targetView),
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
    state: DesktopWorkspaceState,
    language: Language,
    event: NavigationEvent,
    historyState: DesktopHistoryState | null,
): NavigationPlan {
    switch (event.type) {
        case "open-app": {
            const targetView = getDesktopUrlStateForCommand(event, language);

            if (
                historyState !== null &&
                isSameDesktopUrlState(historyState.desktop.view, targetView)
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
                historyState?.desktop.view ?? null,
            );
            return {
                storeCommands: [event, { type: "advance-entry-sequence" }],
                historyEffect: {
                    type: "push",
                    entry,
                    url: serializeDesktopUrl(targetView),
                },
                languageEffect: null,
            };
        }
        case "show-desktop": {
            const targetView: DesktopUrlState = {
                app: "desktop",
                lang: language,
            };

            if (
                historyState !== null &&
                isSameDesktopUrlState(historyState.desktop.view, targetView)
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
                historyState?.desktop.view ?? null,
            );
            return {
                storeCommands: [event, { type: "advance-entry-sequence" }],
                historyEffect: {
                    type: "push",
                    entry,
                    url: serializeDesktopUrl(targetView),
                },
                languageEffect: null,
            };
        }
        case "change-language": {
            const currentView =
                historyState?.desktop.view ??
                ({ app: "about", lang: language } satisfies DesktopUrlState);
            const targetView: DesktopUrlState =
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
