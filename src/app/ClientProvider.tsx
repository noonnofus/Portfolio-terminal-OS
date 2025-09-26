'use client';

import { Provider as ChakraProvider } from "@/components/ui/provider"
import { Provider } from "react-redux";
import store from "./store/store";
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';

function I18nWrapper({ children }: { children: React.ReactNode }) {
    const language = useSelector((state: RootState) => state.language.currentLanguage);
    
    useEffect(() => {
        i18n.changeLanguage(language);
    }, [language]);
    
    return <>{children}</>;
}

export default function ClientProvider({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <Provider store={store}>
            <I18nextProvider i18n={i18n}>
                <ChakraProvider>
                    <I18nWrapper>
                        {children}
                    </I18nWrapper>
                </ChakraProvider>
            </I18nextProvider>
        </Provider>
    );
}