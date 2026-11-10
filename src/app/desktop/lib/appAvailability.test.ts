import { describe, expect, it, vi } from "vitest";
import { appCatalog } from "@/app/desktop/config/appCatalog";
import { dockAppIds } from "@/app/desktop/config/dockApps";
import { desktopDirectory } from "@/app/desktop/components/directory/directoryTree";
import { readDesktopHistoryState } from "@/app/desktop/lib/desktopHistoryState";
import { parseDesktopUrl, getDesktopUrlStateForApp } from "@/app/desktop/lib/parseDesktopAppTarget";
import { planNavigation } from "@/app/desktop/lib/planNavigation";
import { createDesktopStore, selectWorkspaceState } from "@/app/desktop/store/desktopStore";
import { createOpenAppCommand } from "@/app/desktop/types/appTypes";

// Exercise a build with every ordinary app disabled, including fallback folders.
vi.mock("@/app/desktop/config/appCatalog", async (importOriginal) => {
    const original = await importOriginal<typeof import("@/app/desktop/config/appCatalog")>();
    for (const app of Object.values(original.appCatalog)) {
        if (app.url.app !== "project") app.enabled = false;
    }
    original.appCatalog["project:mcp"].enabled = false;
    return original;
});

const ordinaryApps = ["about", "projects", "resume", "terminal", "contact", "notes", "settings"] as const;

describe("disabled Desktop apps", () => {
    it("keeps the registry intact while removing Dock and desktop entries", () => {
        expect(Object.keys(appCatalog)).toHaveLength(14);
        expect(dockAppIds).toEqual([]);
        expect(desktopDirectory.children).toEqual([]);
    });

    it.each(ordinaryApps)("blocks %s URLs and saved history in both languages", (appId) => {
        for (const lang of ["ko", "en"] as const) {
            const disabledView = { app: appId, lang };
            const desktopView = { app: "desktop", lang } as const;
            expect(parseDesktopUrl(new URLSearchParams(`app=${appId}`), lang)).toEqual(desktopView);
            expect(getDesktopUrlStateForApp(appId, lang)).toEqual(desktopView);
            expect(readDesktopHistoryState({
                desktop: { entryId: "disabled", view: disabledView, from: null },
            })).toBeNull();
            expect(readDesktopHistoryState({
                desktop: { entryId: "disabled-from", view: desktopView, from: disabledView },
            })).toBeNull();
        }
    });

    it.each(ordinaryApps)("does not open %s through navigation or store commands", (appId) => {
        const view = { app: appId, lang: "ko" } as const;
        const store = createDesktopStore(undefined, view);
        const command = createOpenAppCommand(appId);
        const plan = planNavigation(selectWorkspaceState(store.getState()), "ko", command, null);
        expect(plan.storeCommands[0]).toEqual({ type: "show-desktop" });
        expect(plan.historyEffect).toMatchObject({ type: "push", url: "/desktop?app=desktop" });
        for (const planned of plan.storeCommands) store.getState().dispatch(planned);
        store.getState().dispatch(command);
        store.getState().dispatch({ type: "apply-url-state", view });
        expect(store.getState().windows).toEqual([]);
        expect(store.getState().focus).toEqual({ mode: "desktop", activeWindowId: null });

        const repeated = planNavigation(selectWorkspaceState(store.getState()), "ko", command, {
            desktop: { entryId: "desktop", view: { app: "desktop", lang: "ko" }, from: null },
        });
        expect(repeated.historyEffect).toEqual({ type: "none" });
    });

    it("uses the desktop when a disabled project's directory is also disabled", () => {
        expect(parseDesktopUrl(new URLSearchParams())).toEqual({ app: "desktop", lang: "ko" });
        expect(parseDesktopUrl(new URLSearchParams("app=project&slug=mcp")))
            .toEqual({ app: "desktop", lang: "ko" });
        const store = createDesktopStore(undefined, { app: "project", slug: "mcp", lang: "ko" });
        expect(store.getState().windows).toEqual([]);
    });
});
