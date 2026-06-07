'use client';

import { Provider } from '@/shared/ui/provider';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/shared/lib/i18n';
import { useEffect } from 'react';
import { useLanguageStore } from '@/shared/lib/i18n/useLanguageStore';

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
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <I18nextProvider i18n={i18n}>
            <Provider>
                <I18nWrapper>
                    {children}
                </I18nWrapper>
            </Provider>
        </I18nextProvider>
    );
}
