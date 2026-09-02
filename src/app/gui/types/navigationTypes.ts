import type {
    GuiAppId,
    GuiUrlState,
    OpenAppCommand,
} from "@/app/gui/types/appTypes";
import type { Language } from "@/lib/i18n/language";
import type { WallpaperId } from "@/features/settings/config/wallpaperCatalog";

export type WindowId = GuiAppId;

export type GuiWindowSnapshot = {
    windowId: WindowId;
    appId: GuiAppId;
    minimized: boolean;
    activationOrder: number;
};

export type WorkspaceFocus =
    | { mode: "desktop"; activeWindowId: null }
    | { mode: "windows"; activeWindowId: WindowId };

export type GuiWorkspaceState = {
    windows: readonly GuiWindowSnapshot[];
    focus: WorkspaceFocus;
    nextEntrySequence: number;
    urlBasePath: "/gui";
};

export type GuiHistoryState = {
    gui: {
        entryId: string;
        view: GuiUrlState;
        from: GuiUrlState | null;
    };
};

export type NavigationEvent =
    | OpenAppCommand
    | { type: "close-window"; windowId: WindowId }
    | { type: "minimize-window"; windowId: WindowId }
    | { type: "show-desktop" }
    | { type: "change-language"; language: Language }
    | {
          type: "popstate";
          entry: GuiHistoryState | null;
          view: GuiUrlState;
      };

export type QueuedNavigationEvent = Exclude<
    NavigationEvent,
    { type: "popstate" }
>;

export type StoreCommand =
    | OpenAppCommand
    | { type: "close-window"; windowId: WindowId }
    | { type: "minimize-window"; windowId: WindowId }
    | { type: "show-desktop" }
    | { type: "change-wallpaper"; wallpaper: WallpaperId }
    | { type: "change-dock-auto-hide"; enabled: boolean }
    | { type: "apply-url-state"; view: GuiUrlState }
    | { type: "advance-entry-sequence" };

export type HistoryEffect =
    | { type: "none" }
    | { type: "push"; entry: GuiHistoryState; url: string }
    | { type: "replace"; entry: GuiHistoryState; url: string }
    | {
          type: "back";
          expectedEntryId: string | null;
          fallbackEntry: GuiHistoryState;
          fallbackUrl: string;
      };

export type NavigationPlan = {
    storeCommands: readonly StoreCommand[];
    historyEffect: HistoryEffect;
    languageEffect: Language | null;
};

export type PendingNavigation = {
    sequence: number;
    expectedEntryId: string | null;
    startedAt: number;
    queuedEvents: readonly QueuedNavigationEvent[];
};
