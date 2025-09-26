import { configureStore } from "@reduxjs/toolkit";
import desktopReducer from "./features/desktopSlice";
import languageSlice from "./features/languageSlice";

export const store = configureStore({
    reducer: {
        desktop: desktopReducer,
        language: languageSlice,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
