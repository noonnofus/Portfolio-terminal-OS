"use client";

import { useDesktopInitialView } from "@/app/desktop/store/DesktopStoreProvider";
import AboutApp from "@/features/portfolio/apps/about/AboutApp";
import { ProjectCaseStudyPage } from "@/features/portfolio/components/ProjectCaseStudyPage";
import { getProjectDetailPageContent } from "@/features/portfolio/content/projectDetailContent";
import { appLoaderRegistry } from "@/app/desktop/lib/appLoaderRegistry";
import { type DesktopAppId, isFolderAppId } from "@/app/desktop/types/appTypes";
import { DirectorySurface } from "@/app/desktop/components/directory/DirectorySurface";
import { findDirectoryByAppId } from "@/app/desktop/components/directory/directoryTree";
import type { WindowId } from "@/app/desktop/types/navigationTypes";
import type { Language } from "@/lib/i18n/language";

export function DesktopAppRenderer({
    windowId,
    appId,
    language,
}: {
    windowId: WindowId;
    appId: DesktopAppId;
    language: Language;
}) {
    const initialView = useDesktopInitialView();
    // ponytail: reuse the requested About UI outside the dynamic streaming fallback.
    if (initialView.app === "about" && appId === "about") {
        return <AboutApp language={language} />;
    }
    // Keep the requested article outside the dynamic loader's streaming fallback.
    if (initialView.app === "project" && appId === `project:${initialView.slug}`) {
        return <ProjectCaseStudyPage
            {...getProjectDetailPageContent(initialView.slug, language)}
            projectId={initialView.slug}
            language={language}
        />;
    }

    if (isFolderAppId(appId)) {
        const directory = findDirectoryByAppId(appId);
        if (directory === null) return null;
        return (
            <DirectorySurface
                key={`${windowId}:${directory.nodeId}`}
                windowId={windowId}
                directory={directory}
                variant="window"
            />
        );
    }

    switch (appId) {
        case "about": {
            const App = appLoaderRegistry.about;
            return <App language={language} />;
        }
        case "resume": {
            const App = appLoaderRegistry.resume;
            return <App language={language} />;
        }
        case "terminal": {
            const App = appLoaderRegistry.terminal;
            return <App language={language} />;
        }
        case "contact": {
            const App = appLoaderRegistry.contact;
            return <App language={language} />;
        }
        case "notes": {
            const App = appLoaderRegistry.notes;
            return <App language={language} />;
        }
        case "settings": {
            const App = appLoaderRegistry.settings;
            return <App language={language} />;
        }
        case "project:portfolio": {
            const App = appLoaderRegistry["project:portfolio"];
            return <App language={language} slug="portfolio" />;
        }
        case "project:optigen": {
            const App = appLoaderRegistry["project:optigen"];
            return <App language={language} slug="optigen" />;
        }
        case "project:mcp": {
            const App = appLoaderRegistry["project:mcp"];
            return <App language={language} slug="mcp" />;
        }
        case "project:voice-gateway": {
            const App = appLoaderRegistry["project:voice-gateway"];
            return <App language={language} slug="voice-gateway" />;
        }
        case "project:kepco": {
            const App = appLoaderRegistry["project:kepco"];
            return <App language={language} slug="kepco" />;
        }
        case "project:wchms": {
            const App = appLoaderRegistry["project:wchms"];
            return <App language={language} slug="wchms" />;
        }
        case "project:flare": {
            const App = appLoaderRegistry["project:flare"];
            return <App language={language} slug="flare" />;
        }
    }
}
