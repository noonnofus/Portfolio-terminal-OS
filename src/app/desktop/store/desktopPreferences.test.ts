import { describe, expect, it } from "vitest";

import {
    DESKTOP_PREFERENCES_STORAGE_KEY,
    readDesktopPreferences,
    writeDesktopPreferences,
} from "@/app/desktop/store/desktopPreferences";

describe("Desktop preferences storage", () => {
    it("round-trips validated preferences", () => {
        const values = new Map<string, string>();
        const storage = {
            getItem: (key: string) => values.get(key) ?? null,
            setItem: (key: string, value: string) => values.set(key, value),
        };

        writeDesktopPreferences(storage, {
            language: "en",
            wallpaper: "tahoe_light",
            dockAutoHide: true,
        });

        expect(readDesktopPreferences(storage)).toEqual({
            language: "en",
            wallpaper: "tahoe_light",
            dockAutoHide: true,
        });
        expect(values.has(DESKTOP_PREFERENCES_STORAGE_KEY)).toBe(true);
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

        expect(readDesktopPreferences(storage)).toBeNull();
    });

    it("reads legacy GUI preferences during the Desktop migration", () => {
        const values = new Map([
            [
                "gui:preferences",
                JSON.stringify({
                    version: 1,
                    preferences: {
                        language: "ko",
                        wallpaper: "golden_gate_light",
                        dockAutoHide: false,
                    },
                }),
            ],
        ]);

        expect(
            readDesktopPreferences({
                getItem: (key: string) => values.get(key) ?? null,
            }),
        ).toEqual({
            language: "ko",
            wallpaper: "golden_gate_light",
            dockAutoHide: false,
        });
    });
});
