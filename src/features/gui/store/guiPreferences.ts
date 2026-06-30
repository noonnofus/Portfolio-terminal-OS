export type GuiPreferences = {
    language: "ko" | "en";
    wallpaper: "aurora" | "sunset" | "forest" | "dark";
    dockAutoHide: boolean;
};

type StoredGuiPreferences = {
    version: 1;
    preferences: GuiPreferences;
};

export const GUI_PREFERENCES_STORAGE_KEY = "gui:preferences";

const languages = new Set<GuiPreferences["language"]>(["ko", "en"]);
const wallpapers = new Set<GuiPreferences["wallpaper"]>([
    "aurora",
    "sunset",
    "forest",
    "dark",
]);

export function readGuiPreferences(
    storage: Pick<Storage, "getItem">,
): GuiPreferences | null {
    try {
        const rawValue = storage.getItem(GUI_PREFERENCES_STORAGE_KEY);
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
            !languages.has(preferences.language as GuiPreferences["language"]) ||
            !wallpapers.has(
                preferences.wallpaper as GuiPreferences["wallpaper"],
            ) ||
            typeof preferences.dockAutoHide !== "boolean"
        ) {
            return null;
        }

        return {
            language: preferences.language as GuiPreferences["language"],
            wallpaper: preferences.wallpaper as GuiPreferences["wallpaper"],
            dockAutoHide: preferences.dockAutoHide,
        };
    } catch {
        return null;
    }
}

export function writeGuiPreferences(
    storage: Pick<Storage, "setItem">,
    preferences: GuiPreferences,
) {
    const value: StoredGuiPreferences = {
        version: 1,
        preferences,
    };

    try {
        storage.setItem(
            GUI_PREFERENCES_STORAGE_KEY,
            JSON.stringify(value),
        );
    } catch {
        // Storage can be unavailable in privacy-restricted browser contexts.
    }
}
