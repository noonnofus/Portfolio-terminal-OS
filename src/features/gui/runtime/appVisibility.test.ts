import { describe, expect, it } from "vitest";
import { deriveVisibility } from "@/features/gui-v2/runtime/appVisibility";

describe("deriveVisibility", () => {
    it("preserves window state while the page is visible", () => {
        expect(deriveVisibility("active", "visible")).toBe("active");
        expect(deriveVisibility("inactive", "visible")).toBe(
            "inactive",
        );
        expect(deriveVisibility("minimized", "visible")).toBe(
            "minimized",
        );
    });

    it("suspends every window without changing its stored state", () => {
        expect(deriveVisibility("active", "hidden")).toBe(
            "page-suspended",
        );
        expect(deriveVisibility("minimized", "hidden")).toBe(
            "page-suspended",
        );
    });
});
