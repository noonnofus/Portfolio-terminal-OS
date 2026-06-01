import { create } from 'zustand';

export type Language = "ko" | "en";

interface LanguageState {
    currentLanguage: Language;
    setLanguage: (lang: Language) => void;
}

const getInitialLanguage = (): Language => {
    if (typeof window !== "undefined") {
        const browserLang = navigator.language.split("-")[0];
        return browserLang === "ko" ? "ko" : "en";
    }
    return "ko";
};

export const useLanguageStore = create<LanguageState>((set) => ({
    currentLanguage: getInitialLanguage(),
    setLanguage: (lang) => set({ currentLanguage: lang }),
}));
