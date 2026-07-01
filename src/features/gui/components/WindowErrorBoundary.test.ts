import { describe, expect, it } from "vitest";
import {
    getChunkRetryKey,
    isChunkLoadFailure,
} from "@/features/gui/components/WindowErrorBoundary";

describe("WindowErrorBoundary helpers", () => {
    it("recognizes dynamic chunk failures without treating render errors as chunks", () => {
        expect(
            isChunkLoadFailure(
                new Error("Loading chunk 123 failed"),
            ),
        ).toBe(true);
        expect(
            isChunkLoadFailure(
                new TypeError(
                    "Failed to fetch dynamically imported module",
                ),
            ),
        ).toBe(true);
        expect(isChunkLoadFailure(new Error("render failed"))).toBe(
            false,
        );
    });

    it("scopes reload markers by app and canonical URL", () => {
        expect(
            getChunkRetryKey(
                "projects",
                "/gui?app=projects&lang=en",
            ),
        ).not.toBe(
            getChunkRetryKey("resume", "/gui?app=projects&lang=en"),
        );
    });
});
