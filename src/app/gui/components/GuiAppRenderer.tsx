"use client";

import { appLoaderRegistry } from "@/app/gui/lib/appLoaderRegistry";
import { type GuiAppId, isFolderAppId } from "@/app/gui/types/appTypes";
import { DirectorySurface } from "@/app/gui/components/directory/DirectorySurface";
import { findDirectoryByAppId } from "@/app/gui/components/directory/directoryTree";
import type { WindowId } from "@/app/gui/types/navigationTypes";
import type { Language } from "@/lib/i18n/language";

export function GuiAppRenderer({
    windowId,
    appId,
    language,
}: {
    windowId: WindowId;
    appId: GuiAppId;
    language: Language;
}) {
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
