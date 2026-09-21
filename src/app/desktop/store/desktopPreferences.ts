import {
    isWallpaperId,
    type WallpaperId,
} from "@/features/settings/config/wallpaperCatalog";

export type DesktopPreferences = {
    language: "ko" | "en";
    wallpaper: WallpaperId;
    dockAutoHide: boolean;
};

type StoredDesktopPreferences = {
    version: 1;
    preferences: DesktopPreferences;
};

export const DESKTOP_PREFERENCES_STORAGE_KEY = "desktop:preferences";
const LEGACY_GUI_PREFERENCES_STORAGE_KEY = "gui:preferences";

const languages = new Set<DesktopPreferences["language"]>(["ko", "en"]);
export function readDesktopPreferences(
    storage: Pick<Storage, "getItem">,
): DesktopPreferences | null {
    try {
        const rawValue =
            storage.getItem(DESKTOP_PREFERENCES_STORAGE_KEY) ??
            storage.getItem(LEGACY_GUI_PREFERENCES_STORAGE_KEY);
        if (rawValue === null) {
            return null;
        }

        const value: unknown = JSON.parse(rawValue);
        if (
            typeof value !== "object" ||
            value === null ||
            !("version" in value) ||
            value.version !== 1 ||
            !("preferences" in value) ||
            typeof value.preferences !== "object" ||
            value.preferences === null
        ) {
            return null;
        }

        const preferences = value.preferences as Record<string, unknown>;
        if (
            !languages.has(preferences.language as DesktopPreferences["language"]) ||
            !isWallpaperId(preferences.wallpaper) ||
            typeof preferences.dockAutoHide !== "boolean"
        ) {
            return null;
        }

        return {
            language: preferences.language as DesktopPreferences["language"],
            wallpaper: preferences.wallpaper as DesktopPreferences["wallpaper"],
            dockAutoHide: preferences.dockAutoHide,
        };
    } catch {
        return null;
    }
}

export function writeDesktopPreferences(
    storage: Pick<Storage, "setItem">,
    preferences: DesktopPreferences,
) {
    const value: StoredDesktopPreferences = {
        version: 1,
        preferences,
    };

    try {
        storage.setItem(
            DESKTOP_PREFERENCES_STORAGE_KEY,
            JSON.stringify(value),
        );
    } catch {
        // Storage can be unavailable in privacy-restricted browser contexts.
    }
}
