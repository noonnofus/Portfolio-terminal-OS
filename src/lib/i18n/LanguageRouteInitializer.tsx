"use client";

import { useLayoutEffect } from "react";
import type { Language } from "@/lib/i18n/language";
import { useLanguageStore } from "@/lib/i18n/useLanguageStore";

export function LanguageRouteInitializer({
    language,
}: {
    language: Language;
}) {
    const setLanguage = useLanguageStore((state) => state.setLanguage);

    useLayoutEffect(() => {
        setLanguage(language);
    }, [language, setLanguage]);

    return null;
}
