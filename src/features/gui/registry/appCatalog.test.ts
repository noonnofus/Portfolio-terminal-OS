import { describe, expect, it } from "vitest";
import {
    appCatalog,
    appCatalogKeys,
} from "@/features/gui/registry/appCatalog";
import { appLoaderRegistryKeys } from "@/features/gui/registry/appLoaderRegistry";
import {
    externalUrl,
    publicAssetPath,
} from "@/features/gui/registry/appTypes";
import {
    parseGuiUrl,
    serializeGuiUrl,
} from "@/features/gui/registry/parseGuiAppTarget";

describe("GUI app boundaries", () => {
    it("keeps catalog and client loader keys identical", () => {
        expect(appLoaderRegistryKeys).toEqual(appCatalogKeys);
        expect(Object.keys(appCatalog)).toHaveLength(13);
        expect(appCatalog.contact.window).toEqual({
            width: 600,
            height: 370,
        });
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
