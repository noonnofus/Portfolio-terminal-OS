import { isWallpaperId, type WallpaperId } from "./wallpaperCatalog";

export type ColorModePreference = "light" | "dark" | "auto";

export type UiPreferences = {
  version: 1;
  colorMode: ColorModePreference;
  wallpaper: WallpaperId;
  dockAutoHide: boolean;
};

export const UI_PREFERENCES_COOKIE = "portfolio-ui";
export const DEFAULT_UI_PREFERENCES: UiPreferences = {
  version: 1,
  colorMode: "light",
  wallpaper: "golden_gate_light",
  dockAutoHide: false,
};

export function decodeUiPreferences(raw: string | undefined): UiPreferences | null {
  if (!raw) return null;
  let value: unknown;
  try {
    value = JSON.parse(decodeURIComponent(raw));
  } catch {
    return null;
  }
  if (typeof value !== "object" || value === null) return null;
  const item = value as Record<string, unknown>;
  if (
    item.version !== 1 ||
    (item.colorMode !== "light" && item.colorMode !== "dark" && item.colorMode !== "auto") ||
    !isWallpaperId(item.wallpaper) ||
    typeof item.dockAutoHide !== "boolean"
  ) return null;
  return {
    version: 1,
    colorMode: item.colorMode,
    wallpaper: item.wallpaper,
    dockAutoHide: item.dockAutoHide,
  };
}

export function encodeUiPreferences({ version, colorMode, wallpaper, dockAutoHide }: UiPreferences): string {
  return encodeURIComponent(JSON.stringify({ version, colorMode, wallpaper, dockAutoHide }));
}
