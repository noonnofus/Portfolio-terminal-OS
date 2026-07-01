import { describe, expect, it } from "vitest";
import {
    appCatalog,
    appCatalogKeys,
} from "@/features/gui/registry/appCatalog";
import { appLoaderRegistryKeys } from "@/features/gui/registry/appLoaderRegistry";
import {
    externalUrl,
    folderAppIds,
    publicAssetPath,
} from "@/features/gui/registry/appTypes";
import { collectFolderAppIds } from "@/features/gui/directory/directoryTree";
import { wallpaperIds } from "@/features/gui/appearance/wallpaperCatalog";
import {
    parseGuiUrl,
    serializeGuiUrl,
} from "@/features/gui/registry/parseGuiAppTarget";

describe("GUI app boundaries", () => {
    it("keeps leaf loaders and folder IDs aligned", () => {
        expect(appLoaderRegistryKeys).toEqual(
            appCatalogKeys.filter((key) => key !== "projects"),
        );
        expect(collectFolderAppIds().toSorted()).toEqual(
            [...folderAppIds].toSorted(),
        );
        expect(Object.keys(appCatalog)).toHaveLength(13);
        expect(appCatalog.contact.window).toEqual({
            width: 600,
            height: 370,
        });
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
            parseGuiUrl(
                new URLSearchParams("app=project&slug=wchms&lang=en"),
            ),
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
        ).toBe("/gui?app=project&slug=wchms&lang=en");
        expect(serializeGuiUrl({ app: "about", lang: "ko" })).toBe("/gui");
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
        expect(externalUrl("https://example.com")).toBe(
            "https://example.com",
        );
        expect(publicAssetPath("/icons/about.png")).toBe("/icons/about.png");
        expect(() => externalUrl("http://example.com")).toThrow();
        expect(() => publicAssetPath("../secret")).toThrow();
    });
});
