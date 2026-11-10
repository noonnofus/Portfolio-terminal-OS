import { describe, expect, it } from "vitest";
import { createDesktopStore, selectFullscreenWindowId } from "@/app/desktop/store/desktopStore";
import { isProjectEnabled } from "@/features/portfolio/content/projectManifest";
import { projectSlugs } from "@/features/portfolio/types/projectTypes";

describe("Desktop store", () => {
    it("seeds the project directory for server-rendered links", () => {
        const store = createDesktopStore(undefined, { app: "projects", lang: "en" });
        expect(store.getInitialState().windows.map(window => window.appId)).toEqual(["projects"]);
        expect(store.getInitialState().focus).toEqual({ mode: "windows", activeWindowId: "projects" });
        expect(store.getInitialState().urlReady).toBe(false);
    });
    for (const lang of ["ko", "en"] as const) {
        it(`seeds the ${lang} About window in SSR and live snapshots`, () => {
            const store = createDesktopStore(undefined, { app: "about", lang });
            for (const state of [store.getInitialState(), store.getState()]) {
                expect(state.windows).toEqual([{
                    windowId: "about", appId: "about", minimized: false, activationOrder: 1,
                }]);
                expect(state.focus).toEqual({ mode: "windows", activeWindowId: "about" });
                expect(state.activationSequence).toBe(1);
                expect(state.urlReady).toBe(false);
            }
        });
        for (const slug of projectSlugs) {
            it(`seeds both SSR and live snapshots for ${lang}/${slug}`, () => {
                const store = createDesktopStore(undefined, { app: "project", slug, lang });
                const appId = isProjectEnabled(slug) ? `project:${slug}` : "projects";
                for (const state of [store.getInitialState(), store.getState()]) {
                    expect(state.windows).toHaveLength(1);
                    expect(state.windows[0].appId).toBe(appId);
                    expect(state.focus).toEqual({ mode: "windows", activeWindowId: appId });
                    expect(state.activationSequence).toBe(1);
                    expect(state.urlReady).toBe(false);
                }
            });
        }
    }

    it("isolates seeded workspaces and preserves non-project defaults", () => {
        const first = createDesktopStore(undefined, { app: "project", slug: "kepco", lang: "ko" });
        const second = createDesktopStore(undefined, { app: "project", slug: "mcp", lang: "en" });
        first.getState().dispatch({ type: "close-window", windowId: isProjectEnabled("kepco") ? "project:kepco" : "projects" });
        expect(first.getState().windows).toHaveLength(0);
        expect(second.getState().windows[0].appId).toBe(isProjectEnabled("mcp") ? "project:mcp" : "projects");
        expect(createDesktopStore().getInitialState().windows).toEqual([]);
        expect(createDesktopStore(undefined, { app: "terminal", lang: "ko" }).getInitialState().windows).toEqual([]);
    });

    it("uses fullscreen chrome only for the active window and clears it on close", () => {
        const store = createDesktopStore();
        const dispatch = store.getState().dispatch;
        const fullscreen = () => selectFullscreenWindowId(store.getState());

        dispatch({ type: "open-app", appId: "about", params: {} });
        store.getState().setFullscreenWindow("about");
        expect(fullscreen()).toBe("about");
        expect(selectFullscreenWindowId(createDesktopStore().getState())).toBeNull();

        dispatch({ type: "open-app", appId: "projects", params: {} });
        expect(fullscreen()).toBeNull();
        dispatch({ type: "close-window", windowId: "projects" });
        expect(fullscreen()).toBe("about");

        dispatch({ type: "minimize-window", windowId: "about" });
        expect(fullscreen()).toBeNull();
        dispatch({ type: "open-app", appId: "about", params: {} });
        expect(fullscreen()).toBe("about");

        dispatch({ type: "show-desktop" });
        expect(fullscreen()).toBeNull();
        dispatch({ type: "open-app", appId: "about", params: {} });
        dispatch({ type: "close-window", windowId: "about" });
        expect(store.getState().fullscreenWindowId).toBeNull();
        dispatch({ type: "open-app", appId: "about", params: {} });
        expect(fullscreen()).toBeNull();
    });

    it("creates an isolated bootstrap-ready store for each shell", () => {
        const first = createDesktopStore();
        const second = createDesktopStore();

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
        const store = createDesktopStore();

        store.getState().dispatch({
            type: "apply-url-state",
            view: { app: "project", slug: "wchms", lang: "en" },
        });

        expect(store.getState().windows.map((window) => window.appId)).toEqual(
            [isProjectEnabled("wchms") ? "project:wchms" : "projects"],
        );
        expect(store.getState().focus).toEqual({
            mode: "windows",
            activeWindowId: isProjectEnabled("wchms") ? "project:wchms" : "projects",
        });
    });

    it("preserves windows while showing the desktop", () => {
        const store = createDesktopStore();

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
        const store = createDesktopStore();
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

    it("starts as a guest and applies a viewer after client bootstrap", () => {
        const store = createDesktopStore();

        expect(store.getState().viewer).toEqual({ status: "guest" });

        store.getState().setViewer({
            status: "authenticated",
            accountId: "account-1",
            displayName: "Hyunho",
            email: null,
            avatarUrl: null,
            role: "admin",
        });

        expect(store.getState().viewer).toMatchObject({
            status: "authenticated",
            accountId: "account-1",
        });
    });
});
