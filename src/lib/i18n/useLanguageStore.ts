import { create } from "zustand";
import {
  DEFAULT_LANGUAGE,
  type Language,
} from "@/lib/i18n/language";

export type { Language } from "@/lib/i18n/language";
export { DEFAULT_LANGUAGE } from "@/lib/i18n/language";

interface LanguageState {
    currentLanguage: Language;
    setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
    currentLanguage: DEFAULT_LANGUAGE,
    setLanguage: (lang) => set({ currentLanguage: lang }),
}));
