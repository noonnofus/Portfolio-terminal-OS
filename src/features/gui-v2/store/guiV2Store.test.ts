import { describe, expect, it } from "vitest";
import { createGuiV2Store } from "@/features/gui-v2/store/guiV2Store";

describe("GUI V2 store", () => {
    it("creates an isolated bootstrap-ready store for each shell", () => {
        const first = createGuiV2Store();
        const second = createGuiV2Store();

        first.getState().dispatch({
            type: "open-app",
            appId: "projects",
            params: {},
        });

        expect(first.getState().focus).toEqual({
            mode: "windows",
            activeWindowId: "projects",
        });
        expect(second.getState().focus).toEqual({
            mode: "desktop",
            activeWindowId: null,
        });
        expect(second.getState().windows).toEqual([]);
    });

    it("reopens and restores a URL-targeted app without closing others", () => {
        const store = createGuiV2Store();

        store.getState().dispatch({
            type: "apply-url-state",
            view: { app: "project", slug: "wchms", lang: "en" },
        });

        expect(store.getState().windows.map((window) => window.appId)).toEqual(
            ["project:wchms"],
        );
        expect(store.getState().focus).toEqual({
            mode: "windows",
            activeWindowId: "project:wchms",
        });
        expect(store.getState().language).toBe("en");
    });

    it("preserves windows while showing the desktop", () => {
        const store = createGuiV2Store();

        store.getState().dispatch({
            type: "open-app",
            appId: "about",
            params: {},
        });
        store.getState().dispatch({ type: "show-desktop" });

        expect(store.getState().windows).toHaveLength(1);
        expect(store.getState().focus).toEqual({
            mode: "desktop",
            activeWindowId: null,
        });
    });
});
