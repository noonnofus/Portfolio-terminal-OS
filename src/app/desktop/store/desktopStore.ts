import { createStore } from "zustand/vanilla";
import type { Viewer } from "@/features/auth/types/viewer";
import type { DesktopAppId, DesktopUrlState } from "@/app/desktop/types/appTypes";
import type {
    DesktopWindowSnapshot,
    DesktopWorkspaceState,
    StoreCommand,
    WorkspaceFocus,
} from "@/app/desktop/types/navigationTypes";
import type { PageVisibility } from "@/app/desktop/types/appVisibility";
import type { WallpaperId } from "@/features/settings/config/wallpaperCatalog";

export type DesktopState = DesktopWorkspaceState & {
    activationSequence: number;
    pageVisibility: PageVisibility;
    resumeEpoch: number;
    urlReady: boolean;
    wallpaper: WallpaperId;
    dockAutoHide: boolean;
    viewer: Viewer;
};

export type DesktopActions = {
    dispatch: (command: StoreCommand) => void;
    setViewer: (viewer: Viewer) => void;
    setPageVisibility: (visibility: PageVisibility) => void;
    signalPageRestore: () => void;
    setUrlReady: (ready: boolean) => void;
};

export type DesktopStore = DesktopState & DesktopActions;
export type DesktopStoreApi = ReturnType<typeof createDesktopStore>;

function appIdFromView(view: DesktopUrlState): DesktopAppId | null {
    switch (view.app) {
        case "desktop":
            return null;
        case "project":
            return `project:${view.slug}`;
        default:
            return view.app as DesktopAppId;
    }
}

function getNextFocus(
    windows: readonly DesktopWindowSnapshot[],
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
    state: DesktopState,
    appId: DesktopAppId,
): Pick<DesktopState, "windows" | "focus" | "activationSequence"> {
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

export function createDesktopStore(
    initialViewer: Viewer = { status: "guest" },
) {
    return createStore<DesktopStore>()((set) => ({
        windows: [],
        focus: { mode: "desktop", activeWindowId: null },
        nextEntrySequence: 1,
        activationSequence: 0,
        pageVisibility: "visible",
        resumeEpoch: 0,
        urlReady: false,
        wallpaper: "golden_gate_light",
        dockAutoHide: false,
        viewer: initialViewer,
        setViewer: (viewer) => set({ viewer }),
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
                    case "change-wallpaper":
                        return { wallpaper: command.wallpaper };
                    case "change-dock-auto-hide":
                        return { dockAutoHide: command.enabled };
                    case "apply-url-state": {
                        const appId = appIdFromView(command.view);
                        if (appId === null) {
                            return {
                                focus: {
                                    mode: "desktop",
                                    activeWindowId: null,
                                },
                            };
                        }

                        return {
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

export function selectWorkspaceState(store: DesktopStore): DesktopWorkspaceState {
    return {
        windows: store.windows,
        focus: store.focus,
        nextEntrySequence: store.nextEntrySequence,
    };
}
