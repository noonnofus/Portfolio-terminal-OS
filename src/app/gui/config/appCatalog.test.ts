import { describe, expect, it } from "vitest";
import {
    appCatalog,
    appCatalogKeys,
} from "@/app/gui/config/appCatalog";
import { appLoaderRegistryKeys } from "@/app/gui/lib/appLoaderRegistry";
import { dockAppIds } from "@/app/gui/config/dockApps";
import {
    externalUrl,
    folderAppIds,
    publicAssetPath,
} from "@/app/gui/types/appTypes";
import { collectFolderAppIds } from "@/app/gui/components/directory/directoryTree";
import { wallpaperIds } from "@/features/settings/config/wallpaperCatalog";
import enAppShell from "@/app/i18n/resources/en/appShell.json";
import koAppShell from "@/app/i18n/resources/ko/appShell.json";
import {
    getGuiLanguageFromPathname,
    parseGuiUrl,
    serializeGuiUrl,
} from "@/app/gui/lib/parseGuiAppTarget";

describe("GUI app boundaries", () => {
    it("keeps leaf loaders and folder IDs aligned", () => {
        expect(appLoaderRegistryKeys).toEqual(
            appCatalogKeys.filter((key) => key !== "projects"),
        );
        expect(collectFolderAppIds().toSorted()).toEqual(
            [...folderAppIds].toSorted(),
        );
        expect(Object.keys(appCatalog)).toHaveLength(14);
        expect(appCatalog.contact.window).toEqual({
            width: 600,
            height: 370,
        });
    });

    it("derives Dock apps from app metadata", () => {
        expect(dockAppIds).toEqual([
            "about",
            "projects",
            "resume",
            "terminal",
            "contact",
            "notes",
            "settings",
        ]);

        for (const appId of dockAppIds) {
            expect(appCatalog[appId].dock?.visible).toBe(true);
        }
    });

    it("keeps localized app-title lookups aligned with the catalog", () => {
        for (const appId of Object.keys(appCatalog) as Array<
            keyof typeof appCatalog
        >) {
            const titleKey = appCatalog[appId].titleKey;
            const appName = titleKey.replace(
                "appNames.",
                "",
            ) as keyof typeof enAppShell.appNames;

            expect(koAppShell.appNames[appName]).not.toBe("");
            expect(enAppShell.appNames[appName]).not.toBe("");
        }
    });

    it("keeps wallpaper IDs catalog-driven", () => {
        expect(wallpaperIds).toHaveLength(8);
        expect(new Set(wallpaperIds).size).toBe(wallpaperIds.length);
    });

    it("canonicalizes supported GUI URLs", () => {
        expect(parseGuiUrl(new URLSearchParams())).toEqual({
            app: "about",
            lang: "ko",
        });
        expect(
            parseGuiUrl(new URLSearchParams("app=project&slug=wchms&lang=en")),
        ).toEqual({
            app: "project",
            slug: "wchms",
            lang: "en",
        });
        expect(
            serializeGuiUrl({
                app: "project",
                slug: "wchms",
                lang: "en",
            }),
        ).toBe("/en/gui?app=project&slug=wchms");
        expect(serializeGuiUrl({ app: "about", lang: "ko" })).toBe("/gui");
        expect(parseGuiUrl(new URLSearchParams("app=notes"))).toEqual({
            app: "notes",
            lang: "ko",
        });
        expect(parseGuiUrl(new URLSearchParams(), "en")).toEqual({
            app: "about",
            lang: "en",
        });
        expect(getGuiLanguageFromPathname("/en/gui", "ko")).toBe("en");
        expect(getGuiLanguageFromPathname("/gui", "en")).toBe("ko");
    });

    it("falls back through the allowlist for invalid values", () => {
        expect(
            parseGuiUrl(new URLSearchParams("app=project&slug=unknown")),
        ).toEqual({
            app: "projects",
            lang: "ko",
        });
        expect(
            parseGuiUrl(new URLSearchParams("app=../../payload&lang=fr")),
        ).toEqual({
            app: "about",
            lang: "ko",
        });
    });

    it("validates external and public asset paths", () => {
        expect(externalUrl("https://example.com")).toBe("https://example.com");
        expect(publicAssetPath("/icons/about.png")).toBe("/icons/about.png");
        expect(() => externalUrl("http://example.com")).toThrow();
        expect(() => publicAssetPath("../secret")).toThrow();
    });
});
