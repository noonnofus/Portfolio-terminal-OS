import type { ComponentType } from "react";
import type { Language } from "@/lib/i18n/language";
import {
    isProjectSlug as isPortfolioProjectSlug,
    projectSlugs,
    type ProjectSlug,
} from "@/features/portfolio/types/projectTypes";

declare const externalUrlBrand: unique symbol;
declare const publicAssetPathBrand: unique symbol;

export type ExternalUrl = string & {
    readonly [externalUrlBrand]: true;
};

export type PublicAssetPath = string & {
    readonly [publicAssetPathBrand]: true;
};

export function externalUrl(value: string): ExternalUrl {
    const url = new URL(value);

    if (url.protocol !== "https:") {
        throw new Error("External URLs must use HTTPS.");
    }

    return value as ExternalUrl;
}

export function publicAssetPath(value: string): PublicAssetPath {
    if (!value.startsWith("/") || value.includes("..")) {
        throw new Error("Public asset paths must be absolute and cannot traverse.");
    }

    return value as PublicAssetPath;
}

export { projectSlugs, type ProjectSlug };
export type ProjectAppId = `project:${ProjectSlug}`;

export type DesktopAppId =
    | "about"
    | "projects"
    | "resume"
    | "terminal"
    | "contact"
    | "notes"
    | "settings"
    | ProjectAppId;

type AppNameId<K extends DesktopAppId> = K extends `project:${
    infer Slug extends ProjectSlug
}`
    ? Slug
    : K;

export type AppTitleKey<K extends DesktopAppId> = `appNames.${AppNameId<K>}`;

export type EmptyParams = {
    readonly __emptyParams?: never;
};

type ProjectSlugFromId<K extends ProjectAppId> =
    K extends `project:${infer Slug extends ProjectSlug}` ? Slug : never;

export type DesktopAppParamsMap = {
    about: EmptyParams;
    projects: EmptyParams;
    resume: EmptyParams;
    terminal: EmptyParams;
    contact: EmptyParams;
    notes: EmptyParams;
    settings: EmptyParams;
} & {
    [K in ProjectAppId]: {
        slug: ProjectSlugFromId<K>;
    };
};

export type DesktopAppComponentProps<K extends DesktopAppId> = DesktopAppParamsMap[K] & {
    language: Language;
};

export type DesktopAppLoaderMap = {
    [K in DesktopAppId]: ComponentType<DesktopAppComponentProps<K>>;
};

export type DesktopAppUrlTargetMap = {
    about: { app: "about" };
    projects: { app: "projects" };
    resume: { app: "resume" };
    terminal: { app: "terminal" };
    contact: { app: "contact" };
    notes: { app: "notes" };
    settings: { app: "settings" };
} & {
    [K in ProjectAppId]: {
        app: "project";
        slug: ProjectSlugFromId<K>;
    };
};

export type DesktopAppCatalogEntry<K extends DesktopAppId> = {
    appId: K;
    url: DesktopAppUrlTargetMap[K];
    titleKey: AppTitleKey<K>;
    icon: PublicAssetPath;
    order: number;
    dock?: {
        visible: true;
        order: number;
    };
    window: {
        width: number;
        height: number;
    };
};

export type DesktopAppCatalog = {
    [K in DesktopAppId]: DesktopAppCatalogEntry<K>;
};

export const folderAppIds = ["projects"] as const satisfies readonly DesktopAppId[];

export type FolderAppId = (typeof folderAppIds)[number];
export type LeafAppId = Exclude<DesktopAppId, FolderAppId>;

export type AppConfig<K extends DesktopAppId> = DesktopAppCatalogEntry<K>;

export type AppConfigMap = {
    [K in DesktopAppId]: AppConfig<K>;
};

export type LeafAppLoaderMap = {
    [K in LeafAppId]: DesktopAppLoaderMap[K];
};

export function isFolderAppId(appId: DesktopAppId): appId is FolderAppId {
    return folderAppIds.some((folderAppId) => folderAppId === appId);
}

export type OpenAppCommand = {
    [K in DesktopAppId]: {
        type: "open-app";
        appId: K;
        params: DesktopAppParamsMap[K];
    };
}[DesktopAppId];

export type DesktopUrlState =
    | { app: "about"; lang: Language }
    | { app: "projects"; lang: Language }
    | { app: "resume"; lang: Language }
    | { app: "terminal"; lang: Language }
    | { app: "contact"; lang: Language }
    | { app: "notes"; lang: Language }
    | { app: "settings"; lang: Language }
    | { app: "desktop"; lang: Language }
    | { app: "project"; slug: ProjectSlug; lang: Language };

export function isProjectSlug(value: string): value is ProjectSlug {
    return isPortfolioProjectSlug(value);
}

export function isProjectAppId(appId: DesktopAppId): appId is ProjectAppId {
    return appId.startsWith("project:");
}

export function createOpenAppCommand(appId: DesktopAppId): OpenAppCommand {
    switch (appId) {
        case "about":
        case "projects":
        case "resume":
        case "terminal":
        case "contact":
        case "notes":
        case "settings":
            return { type: "open-app", appId, params: {} };
        case "project:portfolio":
            return {
                type: "open-app",
                appId,
                params: { slug: "portfolio" },
            };
        case "project:optigen":
            return {
                type: "open-app",
                appId,
                params: { slug: "optigen" },
            };
        case "project:mcp":
            return {
                type: "open-app",
                appId,
                params: { slug: "mcp" },
            };
        case "project:voice-gateway":
            return {
                type: "open-app",
                appId,
                params: { slug: "voice-gateway" },
            };
        case "project:kepco":
            return {
                type: "open-app",
                appId,
                params: { slug: "kepco" },
            };
        case "project:wchms":
            return {
                type: "open-app",
                appId,
                params: { slug: "wchms" },
            };
        case "project:flare":
            return {
                type: "open-app",
                appId,
                params: { slug: "flare" },
            };
    }
}
