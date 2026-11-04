"use client";

import { readDesktopPreferences, DESKTOP_PREFERENCES_STORAGE_KEY, LEGACY_GUI_PREFERENCES_STORAGE_KEY } from "@/app/desktop/store/desktopPreferences";
import { DEFAULT_UI_PREFERENCES, encodeUiPreferences, type UiPreferences } from "@/lib/preferences/uiPreferences";
import { readUiPreferencesCookie, writeUiPreferencesCookie } from "@/lib/preferences/uiPreferences.client";

export function migrateUiPreferences() {
  if (readUiPreferencesCookie()) return;

  let storage: Storage;
  let theme: string | null;
  let desktopRaw: string | null;
  let guiRaw: string | null;
  try {
    storage = window.localStorage;
    theme = storage.getItem("theme");
    desktopRaw = storage.getItem(DESKTOP_PREFERENCES_STORAGE_KEY);
    guiRaw = storage.getItem(LEGACY_GUI_PREFERENCES_STORAGE_KEY);
  } catch {
    // Keep the original settings when browser storage is unavailable.
    return;
  }
  const desktop = readDesktopPreferences({
    getItem: (key) => key === DESKTOP_PREFERENCES_STORAGE_KEY ? desktopRaw : guiRaw,
  });
  const colorMode = theme === "light" || theme === "dark" || theme === "auto" ? theme : null;
  if (!colorMode && !desktop) return;

  const next: UiPreferences = {
    ...DEFAULT_UI_PREFERENCES,
    ...(colorMode ? { colorMode } : {}),
    ...(desktop ? { wallpaper: desktop.wallpaper, dockAutoHide: desktop.dockAutoHide } : {}),
  };
  if (!writeUiPreferencesCookie(next)) return;
  try {
    if (colorMode) storage.removeItem("theme");
    if (desktop) storage.removeItem(desktopRaw === null ? LEGACY_GUI_PREFERENCES_STORAGE_KEY : DESKTOP_PREFERENCES_STORAGE_KEY);
  } catch {
    // The confirmed cookie prevents a repeated migration even if cleanup is blocked.
  }
  if (encodeUiPreferences(next) !== encodeUiPreferences(DEFAULT_UI_PREFERENCES)) window.location.reload();
}
