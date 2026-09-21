import { describe, expect, it } from "vitest";

import { readDesktopHistoryState } from "@/app/desktop/lib/desktopHistoryState";

const entry = {
    entryId: "desktop-3",
    view: { app: "settings", lang: "ko" },
    from: { app: "about", lang: "ko" },
};

describe("readDesktopHistoryState", () => {
    it("reads the current Desktop history field", () => {
        expect(readDesktopHistoryState({ desktop: entry })).toEqual({
            desktop: entry,
        });
    });

    it("normalizes the legacy GUI history field", () => {
        expect(readDesktopHistoryState({ gui: entry })).toEqual({
            desktop: entry,
        });
    });

    it("rejects unrecognized URL state", () => {
        expect(
            readDesktopHistoryState({
                desktop: {
                    ...entry,
                    view: { app: "unknown", lang: "ko" },
                },
            }),
        ).toBeNull();
    });
});
