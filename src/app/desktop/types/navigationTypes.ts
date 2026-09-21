import type {
    DesktopAppId,
    DesktopUrlState,
    OpenAppCommand,
} from "@/app/desktop/types/appTypes";
import type { Language } from "@/lib/i18n/language";
import type { WallpaperId } from "@/features/settings/config/wallpaperCatalog";

export type WindowId = DesktopAppId;

export type DesktopWindowSnapshot = {
    windowId: WindowId;
    appId: DesktopAppId;
    minimized: boolean;
    activationOrder: number;
};

export type WorkspaceFocus =
    | { mode: "desktop"; activeWindowId: null }
    | { mode: "windows"; activeWindowId: WindowId };

export type DesktopWorkspaceState = {
    windows: readonly DesktopWindowSnapshot[];
    focus: WorkspaceFocus;
    nextEntrySequence: number;
};

export type DesktopHistoryState = {
    desktop: {
        entryId: string;
        view: DesktopUrlState;
        from: DesktopUrlState | null;
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
          entry: DesktopHistoryState | null;
          view: DesktopUrlState;
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
    | { type: "apply-url-state"; view: DesktopUrlState }
    | { type: "advance-entry-sequence" };

export type HistoryEffect =
    | { type: "none" }
    | { type: "push"; entry: DesktopHistoryState; url: string }
    | { type: "replace"; entry: DesktopHistoryState; url: string }
    | {
          type: "back";
          expectedEntryId: string | null;
          fallbackEntry: DesktopHistoryState;
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
