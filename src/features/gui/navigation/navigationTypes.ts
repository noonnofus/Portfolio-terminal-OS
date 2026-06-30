import type {
    GuiAppId,
    GuiUrlState,
    OpenAppCommand,
} from "@/features/gui-v2/apps/appTypes";
import type { Language } from "@/shared/lib/i18n/useLanguageStore";

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
    language: Language;
    nextEntrySequence: number;
    urlBasePath: "/gui" | "/gui-v2";
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
    | { type: "change-language"; language: Language }
    | { type: "change-wallpaper"; wallpaper: "aurora" | "sunset" | "forest" | "dark" }
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
};

export type PendingNavigation = {
    sequence: number;
    expectedEntryId: string | null;
    startedAt: number;
    queuedEvents: readonly QueuedNavigationEvent[];
};
