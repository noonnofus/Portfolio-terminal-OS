import { describe, expect, it, vi } from "vitest";
import { projectsDirectory } from "@/app/desktop/components/directory/directoryTree";
import { appCatalog } from "@/app/desktop/config/appCatalog";
import { readDesktopHistoryState } from "@/app/desktop/lib/desktopHistoryState";
import { getDesktopMetadata } from "@/app/desktop/lib/getDesktopMetadata";
import { parseDesktopSearchParams } from "@/app/desktop/lib/parseDesktopAppTarget";
import { planNavigation } from "@/app/desktop/lib/planNavigation";
import { createDesktopStore, selectWorkspaceState } from "@/app/desktop/store/desktopStore";
import { GET } from "@/app/llms.txt/route";
import sitemap from "@/app/sitemap";
import { getPortfolioContent } from "@/features/portfolio/content/getPortfolioContent";
import { isProjectEnabled } from "@/features/portfolio/content/projectManifest";
import { enabledProjectSlugs } from "@/features/portfolio/content/projectSummaries";
import { projectSlugs } from "@/features/portfolio/types/projectTypes";
import { languages } from "@/lib/i18n/language";

// Load every consumer with the same configuration as a build with MCP disabled.
vi.mock("@/features/portfolio/content/projectManifest", async (importOriginal) => {
    const original = await importOriginal<typeof import("@/features/portfolio/content/projectManifest")>();
    Object.assign(original.projectManifest.mcp, { enabled: false });
    return original;
});

describe("disabled portfolio projects", () => {
    it("keeps the project registered while hiding its directory entry", () => {
        expect(isProjectEnabled("mcp")).toBe(false);
        expect(projectSlugs).toContain("mcp");
        expect(appCatalog["project:mcp"].url).toEqual({ app: "project", slug: "mcp" });
        expect(enabledProjectSlugs).not.toContain("mcp");
        expect(projectsDirectory.children.map((node) => node.appId)).not.toContain("project:mcp");
        expect(projectsDirectory.children.map((node) => node.appId).toSorted()).toEqual(
            enabledProjectSlugs.map((slug) => `project:${slug}`).toSorted(),
        );
    });

    it.each(languages)("omits the project from the %s resume", (language) => {
        expect(getPortfolioContent(language).projects.map((project) => project.slug))
            .toEqual(enabledProjectSlugs);
    });

    it("omits disabled project links from both discovery endpoints", async () => {
        const entries = sitemap();
        expect(entries).toHaveLength(4 + enabledProjectSlugs.length * languages.length);
        for (const entry of entries) {
            expect(entry.url).not.toContain("slug=mcp");
            for (const alternate of Object.values(entry.alternates?.languages ?? {})) {
                expect(alternate).not.toContain("slug=mcp");
            }
        }
        const text = await GET().text();
        expect(text).not.toContain("slug=mcp");
        for (const slug of enabledProjectSlugs) {
            expect(text).toContain(`slug=${slug}`);
        }
    });

    it.each(languages)("falls back to the project directory and generic metadata in %s", (lang) => {
        const query = { app: "project", slug: "mcp" };
        expect(parseDesktopSearchParams(query, lang)).toEqual({ app: "projects", lang });
        expect(getDesktopMetadata(query, lang)).toEqual(
            getDesktopMetadata({ app: "projects" }, lang),
        );
        expect(getDesktopMetadata(query, lang).alternates.canonical).not.toContain("slug=mcp");
    });

    it("rejects history entries that could restore a disabled project", () => {
        const disabledView = { app: "project", slug: "mcp", lang: "ko" };
        expect(readDesktopHistoryState({
            desktop: { entryId: "before-disable", view: disabledView, from: null },
        })).toBeNull();
        expect(readDesktopHistoryState({
            desktop: { entryId: "after-disable", view: { app: "projects", lang: "ko" }, from: disabledView },
        })).toBeNull();
    });

    it("opens the directory instead of a disabled project through navigation", () => {
        const store = createDesktopStore();
        const plan = planNavigation(
            selectWorkspaceState(store.getState()),
            "en",
            { type: "open-app", appId: "project:mcp", params: { slug: "mcp" } },
            null,
        );
        expect(plan.historyEffect).toMatchObject({
            type: "push",
            url: "/en/desktop?app=projects",
            entry: { desktop: { view: { app: "projects", lang: "en" } } },
        });
        for (const command of plan.storeCommands) store.getState().dispatch(command);
        expect(store.getState().windows.map((window) => window.appId)).toEqual(["projects"]);

        const alreadyOpen = planNavigation(
            selectWorkspaceState(store.getState()),
            "en",
            { type: "open-app", appId: "project:mcp", params: { slug: "mcp" } },
            { desktop: { entryId: "directory", view: { app: "projects", lang: "en" }, from: null } },
        );
        expect(alreadyOpen.storeCommands).toEqual([{ type: "open-app", appId: "projects", params: {} }]);
        expect(alreadyOpen.historyEffect).toEqual({ type: "none" });
    });

    it("does not seed or reopen the disabled window through the store", () => {
        const view = { app: "project", slug: "mcp", lang: "ko" } as const;
        const store = createDesktopStore(undefined, view);
        expect(store.getInitialState().windows.map((window) => window.appId)).toEqual(["projects"]);
        store.getState().dispatch({ type: "apply-url-state", view });
        store.getState().dispatch({ type: "open-app", appId: "project:mcp", params: { slug: "mcp" } });
        expect(store.getState().windows.map((window) => window.appId)).toEqual(["projects"]);
        expect(store.getState().focus).toEqual({ mode: "windows", activeWindowId: "projects" });
    });
});
