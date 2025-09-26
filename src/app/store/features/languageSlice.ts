import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Language = "ko" | "en";

interface LanguageState {
    currentLanguage: Language;
}

const getInitialLanguage = (): Language => {
    if (typeof window !== "undefined") {
        const browserLang = navigator.language.split("-")[0];
        return browserLang === "ko" ? "ko" : "en";
    }
    return "ko";
};

const initialState: LanguageState = {
    currentLanguage: getInitialLanguage(),
};

const languageSlice = createSlice({
    name: "language",
    initialState,
    reducers: {
        setLanguage: (state, action: PayloadAction<Language>) => {
            state.currentLanguage = action.payload;
        },
    },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
