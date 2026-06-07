import { create } from 'zustand';

export type Language = "ko" | "en";
export const DEFAULT_LANGUAGE: Language = "ko";

interface LanguageState {
    currentLanguage: Language;
    setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
    currentLanguage: DEFAULT_LANGUAGE,
    setLanguage: (lang) => set({ currentLanguage: lang }),
}));
