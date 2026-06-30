import { describe, expect, it } from "vitest";
import { createGuiStore } from "@/features/gui/store/guiStore";

describe("GUI store", () => {
    it("creates an isolated bootstrap-ready store for each shell", () => {
        const first = createGuiStore();
        const second = createGuiStore();

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
        const store = createGuiStore();

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
        const store = createGuiStore();

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

    it("stores page visibility independently from window focus", () => {
        const store = createGuiStore();
        store.getState().dispatch({
            type: "open-app",
            appId: "terminal",
            params: {},
        });

        store.getState().setPageVisibility("hidden");

        expect(store.getState().pageVisibility).toBe("hidden");
        expect(store.getState().focus).toEqual({
            mode: "windows",
            activeWindowId: "terminal",
        });

        store.getState().setPageVisibility("visible");

        expect(store.getState().pageVisibility).toBe("visible");
        expect(store.getState().focus).toEqual({
            mode: "windows",
            activeWindowId: "terminal",
        });

        store.getState().signalPageRestore();
        expect(store.getState().resumeEpoch).toBe(1);
    });
});
