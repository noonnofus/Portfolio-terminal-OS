"use client";

import { GuiShell } from "@/app/gui/components/GuiShell";
import { GuiNavigationProvider } from "@/app/gui/components/GuiNavigationProvider";
import { useViewerBootstrap } from "@/app/gui/hooks/useViewerBootstrap";
import { GuiStoreProvider } from "@/app/gui/store/GuiStoreProvider";
import { LanguageRouteInitializer } from "@/lib/i18n/LanguageRouteInitializer";
import type { Language } from "@/lib/i18n/language";
import { QueryProvider } from "@/lib/query/QueryProvider";

export function GuiClient({ language = "ko" }: { language?: Language }) {
    return (
        <QueryProvider>
            <GuiStoreProvider>
                <LanguageRouteInitializer language={language} />
                <GuiApplication defaultLanguage={language} />
            </GuiStoreProvider>
        </QueryProvider>
    );
}

function GuiApplication({ defaultLanguage }: { defaultLanguage: Language }) {
    useViewerBootstrap();

    return (
        <GuiNavigationProvider defaultLanguage={defaultLanguage}>
            <GuiShell />
        </GuiNavigationProvider>
    );
}
