import type { ComponentType } from "react";
import type { Language } from "@/shared/lib/i18n/useLanguageStore";

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

export const projectSlugs = [
    "wchms",
    "flare",
    "weconnect",
    "pagessence",
    "diceroller",
    "mejubot",
    "webpiano",
] as const;

export type ProjectSlug = (typeof projectSlugs)[number];
export type ProjectAppId = `project:${ProjectSlug}`;

export type GuiAppId =
    | "about"
    | "projects"
    | "resume"
    | "terminal"
    | "contact"
    | "settings"
    | ProjectAppId;

export type EmptyParams = {
    readonly __emptyParams?: never;
};

type ProjectSlugFromId<K extends ProjectAppId> =
    K extends `project:${infer Slug extends ProjectSlug}` ? Slug : never;

export type GuiAppParamsMap = {
    about: EmptyParams;
    projects: EmptyParams;
    resume: EmptyParams;
    terminal: EmptyParams;
    contact: EmptyParams;
    settings: EmptyParams;
} & {
    [K in ProjectAppId]: {
        slug: ProjectSlugFromId<K>;
    };
};

export type GuiAppComponentProps<K extends GuiAppId> = GuiAppParamsMap[K] & {
    language: Language;
};

export type GuiAppLoaderMap = {
    [K in GuiAppId]: ComponentType<GuiAppComponentProps<K>>;
};

type GuiAppUrlTargetMap = {
    about: { app: "about" };
    projects: { app: "projects" };
    resume: { app: "resume" };
    terminal: { app: "terminal" };
    contact: { app: "contact" };
    settings: { app: "settings" };
} & {
    [K in ProjectAppId]: {
        app: "project";
        slug: ProjectSlugFromId<K>;
    };
};

export type GuiAppCatalogEntry<K extends GuiAppId> = {
    appId: K;
    url: GuiAppUrlTargetMap[K];
    titles: Record<Language, string>;
    icon: PublicAssetPath;
    order: number;
    window: {
        width: number;
        height: number;
    };
};

export type GuiAppCatalog = {
    [K in GuiAppId]: GuiAppCatalogEntry<K>;
};

export type OpenAppCommand = {
    [K in GuiAppId]: {
        type: "open-app";
        appId: K;
        params: GuiAppParamsMap[K];
    };
}[GuiAppId];

export type GuiUrlState =
    | { app: "about"; lang: Language }
    | { app: "projects"; lang: Language }
    | { app: "resume"; lang: Language }
    | { app: "terminal"; lang: Language }
    | { app: "contact"; lang: Language }
    | { app: "settings"; lang: Language }
    | { app: "desktop"; lang: Language }
    | { app: "project"; slug: ProjectSlug; lang: Language };

export function isProjectSlug(value: string): value is ProjectSlug {
    return projectSlugs.some((slug) => slug === value);
}

export function isProjectAppId(appId: GuiAppId): appId is ProjectAppId {
    return appId.startsWith("project:");
}

export function createOpenAppCommand(appId: GuiAppId): OpenAppCommand {
    switch (appId) {
        case "about":
        case "projects":
        case "resume":
        case "terminal":
        case "contact":
        case "settings":
            return { type: "open-app", appId, params: {} };
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
        case "project:weconnect":
            return {
                type: "open-app",
                appId,
                params: { slug: "weconnect" },
            };
        case "project:pagessence":
            return {
                type: "open-app",
                appId,
                params: { slug: "pagessence" },
            };
        case "project:diceroller":
            return {
                type: "open-app",
                appId,
                params: { slug: "diceroller" },
            };
        case "project:mejubot":
            return {
                type: "open-app",
                appId,
                params: { slug: "mejubot" },
            };
        case "project:webpiano":
            return {
                type: "open-app",
                appId,
                params: { slug: "webpiano" },
            };
    }
}
