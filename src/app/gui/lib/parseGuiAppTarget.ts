import { appCatalog } from "@/app/gui/config/appCatalog";
import {
    isProjectSlug,
    type GuiAppId,
    type GuiUrlState,
    type OpenAppCommand,
} from "@/app/gui/types/appTypes";
import type { Language } from "@/lib/i18n/language";

const MAX_QUERY_LENGTH = 256;

export function getGuiUrlBasePath(language: Language): "/gui" | "/en/gui" {
    return language === "en" ? "/en/gui" : "/gui";
}

export function getGuiLanguageFromPathname(
    pathname: string,
    fallbackLanguage: Language,
): Language {
    const normalizedPathname = pathname.replace(/\/$/, "");

    if (normalizedPathname === "/en/gui") {
        return "en";
    }

    if (normalizedPathname === "/gui") {
        return "ko";
    }

    return fallbackLanguage;
}

export function parseGuiUrl(
    searchParams: URLSearchParams,
    defaultLanguage: Language = "ko",
): GuiUrlState {
    if (searchParams.toString().length > MAX_QUERY_LENGTH) {
        return { app: "about", lang: defaultLanguage };
    }

    const requestedLanguage = searchParams.get("lang");
    const lang: Language =
        requestedLanguage === "ko" || requestedLanguage === "en"
            ? requestedLanguage
            : defaultLanguage;
    const app = searchParams.get("app");

    switch (app) {
        case null:
        case "":
        case "about":
            return { app: "about", lang };
        case "desktop":
            return { app: "desktop", lang };
        case "projects":
            return { app: "projects", lang };
        case "resume":
            return { app: "resume", lang };
        case "terminal":
            return { app: "terminal", lang };
        case "contact":
            return { app: "contact", lang };
        case "notes":
            return { app: "notes", lang };
        case "settings":
            return { app: "settings", lang };
        case "project": {
            const slug = searchParams.get("slug");
            return slug !== null && isProjectSlug(slug)
                ? { app: "project", slug, lang }
                : { app: "projects", lang };
        }
        default:
            return { app: "about", lang };
    }
}

export function serializeGuiUrl(state: GuiUrlState): string {
    const searchParams = new URLSearchParams();

    if (state.app !== "about") {
        searchParams.set("app", state.app);
    }

    if (state.app === "project") {
        searchParams.set("slug", state.slug);
    }

    const query = searchParams.toString();
    const basePath = getGuiUrlBasePath(state.lang);
    return query.length === 0 ? basePath : `${basePath}?${query}`;
}

export function getGuiUrlStateForApp(
    appId: GuiAppId,
    language: Language,
): GuiUrlState {
    const target = appCatalog[appId].url;

    if (target.app === "project") {
        return { app: "project", slug: target.slug, lang: language };
    }

    return { app: target.app, lang: language };
}

export function getGuiUrlStateForCommand(
    command: OpenAppCommand,
    language: Language,
): GuiUrlState {
    return getGuiUrlStateForApp(command.appId, language);
}

export function isSameGuiUrlState(
    left: GuiUrlState,
    right: GuiUrlState,
): boolean {
    return serializeGuiUrl(left) === serializeGuiUrl(right);
}
