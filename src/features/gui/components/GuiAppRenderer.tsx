"use client";

import { appLoaderRegistry } from "@/features/gui/registry/appLoaderRegistry";
import type { GuiAppId } from "@/features/gui/registry/appTypes";
import type { Language } from "@/shared/lib/i18n/useLanguageStore";

export function GuiAppRenderer({
    appId,
    language,
}: {
    appId: GuiAppId;
    language: Language;
}) {
    switch (appId) {
        case "about": {
            const App = appLoaderRegistry.about;
            return <App language={language} />;
        }
        case "projects": {
            const App = appLoaderRegistry.projects;
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
        case "settings": {
            const App = appLoaderRegistry.settings;
            return <App language={language} />;
        }
        case "project:wchms": {
            const App = appLoaderRegistry["project:wchms"];
            return <App language={language} slug="wchms" />;
        }
        case "project:flare": {
            const App = appLoaderRegistry["project:flare"];
            return <App language={language} slug="flare" />;
        }
        case "project:weconnect": {
            const App = appLoaderRegistry["project:weconnect"];
            return <App language={language} slug="weconnect" />;
        }
        case "project:pagessence": {
            const App = appLoaderRegistry["project:pagessence"];
            return <App language={language} slug="pagessence" />;
        }
        case "project:diceroller": {
            const App = appLoaderRegistry["project:diceroller"];
            return <App language={language} slug="diceroller" />;
        }
        case "project:mejubot": {
            const App = appLoaderRegistry["project:mejubot"];
            return <App language={language} slug="mejubot" />;
        }
        case "project:webpiano": {
            const App = appLoaderRegistry["project:webpiano"];
            return <App language={language} slug="webpiano" />;
        }
    }
}
