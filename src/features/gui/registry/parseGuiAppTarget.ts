import { appMetadata } from "@/features/gui/registry/appMetadata";
import {
    isProjectSlug,
    type GuiAppId,
    type GuiUrlState,
    type OpenAppCommand,
} from "@/features/gui/registry/appTypes";
import type { Language } from "@/shared/lib/i18n/useLanguageStore";

const MAX_QUERY_LENGTH = 256;

export function parseGuiUrl(searchParams: URLSearchParams): GuiUrlState {
    if (searchParams.toString().length > MAX_QUERY_LENGTH) {
        return { app: "about", lang: "ko" };
    }

    const lang: Language = searchParams.get("lang") === "en" ? "en" : "ko";
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

export function serializeGuiUrl(
    state: GuiUrlState,
    basePath: "/gui" = "/gui",
): string {
    const searchParams = new URLSearchParams();

    if (state.app !== "about") {
        searchParams.set("app", state.app);
    }

    if (state.app === "project") {
        searchParams.set("slug", state.slug);
    }

    if (state.lang === "en") {
        searchParams.set("lang", "en");
    }

    const query = searchParams.toString();
    return query.length === 0 ? basePath : `${basePath}?${query}`;
}

export function getGuiUrlStateForApp(
    appId: GuiAppId,
    language: Language,
): GuiUrlState {
    const target = appMetadata[appId].url;

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
