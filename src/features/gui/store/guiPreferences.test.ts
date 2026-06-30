import { describe, expect, it } from "vitest";

import {
    GUI_PREFERENCES_STORAGE_KEY,
    readGuiPreferences,
    writeGuiPreferences,
} from "@/features/gui/store/guiPreferences";

describe("GUI preferences storage", () => {
    it("round-trips validated preferences", () => {
        const values = new Map<string, string>();
        const storage = {
            getItem: (key: string) => values.get(key) ?? null,
            setItem: (key: string, value: string) => values.set(key, value),
        };

        writeGuiPreferences(storage, {
            language: "en",
            wallpaper: "forest",
            dockAutoHide: true,
        });

        expect(readGuiPreferences(storage)).toEqual({
            language: "en",
            wallpaper: "forest",
            dockAutoHide: true,
        });
        expect(values.has(GUI_PREFERENCES_STORAGE_KEY)).toBe(true);
    });

    it("rejects malformed or unsupported stored values", () => {
        const storage = {
            getItem: () =>
                JSON.stringify({
                    version: 1,
                    preferences: {
                        language: "fr",
                        wallpaper: "/arbitrary-path",
                        dockAutoHide: "yes",
                    },
                }),
        };

        expect(readGuiPreferences(storage)).toBeNull();
    });
});
