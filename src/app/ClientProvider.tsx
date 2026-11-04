'use client';

import { AppProvider } from "@/components/providers/AppProvider";
import { I18nextProvider } from 'react-i18next';
import i18n from '@/app/i18n';
import { useEffect } from 'react';
import { useLanguageStore } from '@/lib/i18n/useLanguageStore';
import type { ColorModePreference } from '@/lib/preferences/uiPreferences';
import { migrateUiPreferences } from '@/app/migrateUiPreferences';

function I18nWrapper({ children }: { children: React.ReactNode }) {
    const language = useLanguageStore((state) => state.currentLanguage);
    
    useEffect(() => {
        i18n.changeLanguage(language);
        document.documentElement.lang = language;
    }, [language]);
    
    return <>{children}</>;
}

export default function ClientProvider({
    children,
    initialColorMode,
}: Readonly<{
    children: React.ReactNode;
    initialColorMode: ColorModePreference;
}>) {
    useEffect(migrateUiPreferences, []);
    return (
        <I18nextProvider i18n={i18n}>
            <AppProvider initialColorMode={initialColorMode}>
                <I18nWrapper>
                    {children}
                </I18nWrapper>
            </AppProvider>
        </I18nextProvider>
    );
}
