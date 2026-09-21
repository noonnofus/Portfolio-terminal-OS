import { isProjectSlug, type DesktopUrlState } from "@/app/desktop/types/appTypes";
import type { DesktopHistoryState } from "@/app/desktop/types/navigationTypes";

function isDesktopUrlState(value: unknown): value is DesktopUrlState {
    if (typeof value !== "object" || value === null) {
        return false;
    }

    const app = Reflect.get(value, "app");
    const lang = Reflect.get(value, "lang");

    if (lang !== "ko" && lang !== "en") {
        return false;
    }

    if (app === "project") {
        const slug = Reflect.get(value, "slug");
        return typeof slug === "string" && isProjectSlug(slug);
    }

    return (
        app === "about" ||
        app === "projects" ||
        app === "resume" ||
        app === "terminal" ||
        app === "contact" ||
        app === "notes" ||
        app === "settings" ||
        app === "desktop"
    );
}

export function readDesktopHistoryState(
    value: unknown,
): DesktopHistoryState | null {
    if (typeof value !== "object" || value === null) {
        return null;
    }

    const desktop =
        Reflect.get(value, "desktop") ?? Reflect.get(value, "gui");
    if (typeof desktop !== "object" || desktop === null) {
        return null;
    }

    const entryId = Reflect.get(desktop, "entryId");
    const view = Reflect.get(desktop, "view");
    const from = Reflect.get(desktop, "from");

    if (
        typeof entryId !== "string" ||
        !isDesktopUrlState(view) ||
        (from !== null && !isDesktopUrlState(from))
    ) {
        return null;
    }

    return {
        desktop: {
            entryId,
            view,
            from,
        },
    };
}
