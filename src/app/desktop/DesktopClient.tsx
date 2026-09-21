"use client";

import { DesktopShell } from "@/app/desktop/components/DesktopShell";
import { DesktopNavigationProvider } from "@/app/desktop/components/DesktopNavigationProvider";
import { useViewerBootstrap } from "@/app/desktop/hooks/useViewerBootstrap";
import { DesktopStoreProvider } from "@/app/desktop/store/DesktopStoreProvider";
import { LanguageRouteInitializer } from "@/lib/i18n/LanguageRouteInitializer";
import type { Language } from "@/lib/i18n/language";
import { QueryProvider } from "@/lib/query/QueryProvider";

export function DesktopClient({ language = "ko" }: { language?: Language }) {
    return (
        <QueryProvider>
            <DesktopStoreProvider>
                <LanguageRouteInitializer language={language} />
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
