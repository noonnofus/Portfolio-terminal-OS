import { appCatalog } from "@/app/desktop/config/appCatalog";
import {
    isProjectSlug,
    type DesktopAppId,
    type DesktopUrlState,
    type OpenAppCommand,
} from "@/app/desktop/types/appTypes";
import type { Language } from "@/lib/i18n/language";

const MAX_QUERY_LENGTH = 256;

export function getDesktopUrlBasePath(language: Language): "/desktop" | "/en/desktop" {
    return language === "en" ? "/en/desktop" : "/desktop";
}

export function getDesktopLanguageFromPathname(
    pathname: string,
    fallbackLanguage: Language,
): Language {
    const normalizedPathname = pathname.replace(/\/$/, "");

    if (normalizedPathname === "/en/desktop") {
        return "en";
    }

    if (normalizedPathname === "/desktop") {
        return "ko";
    }

    return fallbackLanguage;
}

export function parseDesktopUrl(
    searchParams: URLSearchParams,
    defaultLanguage: Language = "ko",
): DesktopUrlState {
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

export function serializeDesktopUrl(state: DesktopUrlState): string {
    const searchParams = new URLSearchParams();

    if (state.app !== "about") {
        searchParams.set("app", state.app);
    }

    if (state.app === "project") {
        searchParams.set("slug", state.slug);
    }

    const query = searchParams.toString();
    const basePath = getDesktopUrlBasePath(state.lang);
    return query.length === 0 ? basePath : `${basePath}?${query}`;
}

export function getDesktopUrlStateForApp(
    appId: DesktopAppId,
    language: Language,
): DesktopUrlState {
    const target = appCatalog[appId].url;

    if (target.app === "project") {
        return { app: "project", slug: target.slug, lang: language };
    }

    return { app: target.app, lang: language };
}

export function getDesktopUrlStateForCommand(
    command: OpenAppCommand,
    language: Language,
): DesktopUrlState {
    return getDesktopUrlStateForApp(command.appId, language);
}

export function isSameDesktopUrlState(
    left: DesktopUrlState,
    right: DesktopUrlState,
): boolean {
    return serializeDesktopUrl(left) === serializeDesktopUrl(right);
}
