"use client";

import { DesktopShell } from "@/app/desktop/components/DesktopShell";
import { DesktopNavigationProvider } from "@/app/desktop/components/DesktopNavigationProvider";
import { useViewerBootstrap } from "@/app/desktop/hooks/useViewerBootstrap";
import { DesktopStoreProvider } from "@/app/desktop/store/DesktopStoreProvider";
import { LanguageRouteInitializer } from "@/lib/i18n/LanguageRouteInitializer";
import type { DesktopUrlState } from "@/app/desktop/types/appTypes";
import type { Language } from "@/lib/i18n/language";
import { QueryProvider } from "@/lib/query/QueryProvider";
import type { UiPreferences } from "@/lib/preferences/uiPreferences";

export function DesktopClient({ language = "ko", initialView, initialPreferences }: { language?: Language; initialView: DesktopUrlState; initialPreferences: UiPreferences }) {
    return (
        <QueryProvider>
            <DesktopStoreProvider initialView={initialView} initialPreferences={initialPreferences}>
                <LanguageRouteInitializer language={initialView.lang} />
                <DesktopApplication defaultLanguage={language} />
            </DesktopStoreProvider>
        </QueryProvider>
    );
}

function DesktopApplication({ defaultLanguage }: { defaultLanguage: Language }) {
    useViewerBootstrap();

    return (
        <DesktopNavigationProvider defaultLanguage={defaultLanguage}>
            <DesktopShell />
        </DesktopNavigationProvider>
    );
}
