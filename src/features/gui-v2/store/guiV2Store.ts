import { createStore } from "zustand/vanilla";
import type { GuiAppId, GuiUrlState } from "@/features/gui-v2/apps/appTypes";
import type {
    GuiWindowSnapshot,
    GuiWorkspaceState,
    StoreCommand,
    WorkspaceFocus,
} from "@/features/gui-v2/navigation/navigationTypes";
import type { Language } from "@/shared/lib/i18n/useLanguageStore";
import type { PageVisibility } from "@/features/gui-v2/runtime/appVisibility";

export type GuiV2State = GuiWorkspaceState & {
    activationSequence: number;
    pageVisibility: PageVisibility;
    resumeEpoch: number;
    urlReady: boolean;
    wallpaper: "aurora" | "sunset" | "forest" | "dark";
    dockAutoHide: boolean;
};

export type GuiV2Actions = {
    dispatch: (command: StoreCommand) => void;
    setPageVisibility: (visibility: PageVisibility) => void;
    signalPageRestore: () => void;
    setUrlReady: (ready: boolean) => void;
};

export type GuiV2Store = GuiV2State & GuiV2Actions;
export type GuiV2StoreApi = ReturnType<typeof createGuiV2Store>;

function appIdFromView(view: GuiUrlState): GuiAppId | null {
    switch (view.app) {
        case "desktop":
            return null;
        case "project":
            return `project:${view.slug}`;
        default:
            return view.app as GuiAppId;
    }
}

function getNextFocus(
    windows: readonly GuiWindowSnapshot[],
): WorkspaceFocus {
    const nextWindow = windows
        .filter((window) => !window.minimized)
        .toSorted(
            (left, right) => right.activationOrder - left.activationOrder,
        )[0];

    return nextWindow === undefined
        ? { mode: "desktop", activeWindowId: null }
        : { mode: "windows", activeWindowId: nextWindow.windowId };
}

function activateApp(
    state: GuiV2State,
    appId: GuiAppId,
): Pick<GuiV2State, "windows" | "focus" | "activationSequence"> {
    const activationSequence = state.activationSequence + 1;
    const existingWindow = state.windows.find(
        (window) => window.windowId === appId,
    );
    const windows =
        existingWindow === undefined
            ? [
                  ...state.windows,
                  {
                      windowId: appId,
                      appId,
                      minimized: false,
                      activationOrder: activationSequence,
                  },
              ]
            : state.windows.map((window) =>
                  window.windowId === appId
                      ? {
                            ...window,
                            minimized: false,
                            activationOrder: activationSequence,
                        }
                      : window,
              );

    return {
        windows,
        focus: { mode: "windows", activeWindowId: appId },
        activationSequence,
    };
}

export function createGuiV2Store(
    urlBasePath: "/gui" | "/gui-v2" = "/gui-v2",
) {
    return createStore<GuiV2Store>()((set) => ({
        windows: [],
        focus: { mode: "desktop", activeWindowId: null },
        language: "ko",
        nextEntrySequence: 1,
        urlBasePath,
        activationSequence: 0,
        pageVisibility: "visible",
        resumeEpoch: 0,
        urlReady: false,
        wallpaper: "aurora",
        dockAutoHide: false,
        dispatch: (command) =>
            set((state) => {
                switch (command.type) {
                    case "open-app":
                        return activateApp(state, command.appId);
                    case "close-window": {
                        const windows = state.windows.filter(
                            (window) =>
                                window.windowId !== command.windowId,
                        );
                        return {
                            windows,
                            focus:
                                state.focus.mode === "windows" &&
                                state.focus.activeWindowId === command.windowId
                                    ? getNextFocus(windows)
                                    : state.focus,
                        };
                    }
                    case "minimize-window": {
                        const windows = state.windows.map((window) =>
                            window.windowId === command.windowId
                                ? { ...window, minimized: true }
                                : window,
                        );
                        return {
                            windows,
                            focus:
                                state.focus.mode === "windows" &&
                                state.focus.activeWindowId === command.windowId
                                    ? getNextFocus(windows)
                                    : state.focus,
                        };
                    }
                    case "show-desktop":
                        return {
                            focus: {
                                mode: "desktop",
                                activeWindowId: null,
                            },
                        };
                    case "change-language":
                        return { language: command.language };
                    case "change-wallpaper":
                        return { wallpaper: command.wallpaper };
                    case "change-dock-auto-hide":
                        return { dockAutoHide: command.enabled };
                    case "apply-url-state": {
                        const appId = appIdFromView(command.view);
                        if (appId === null) {
                            return {
                                language: command.view.lang,
                                focus: {
                                    mode: "desktop",
                                    activeWindowId: null,
                                },
                            };
                        }

                        return {
                            language: command.view.lang,
                            ...activateApp(state, appId),
                        };
                    }
                    case "advance-entry-sequence":
                        return {
                            nextEntrySequence:
                                state.nextEntrySequence + 1,
                        };
                }
            }),
        setPageVisibility: (visibility) =>
            set({ pageVisibility: visibility }),
        signalPageRestore: () =>
            set((state) => ({
                resumeEpoch: state.resumeEpoch + 1,
            })),
        setUrlReady: (ready) => set({ urlReady: ready }),
    }));
}

export function selectWorkspaceState(store: GuiV2Store): GuiWorkspaceState {
    return {
        windows: store.windows,
        focus: store.focus,
        language: store.language,
        nextEntrySequence: store.nextEntrySequence,
        urlBasePath: store.urlBasePath,
    };
}

export function getLanguageFromState(state: GuiV2State): Language {
    return state.language;
}
