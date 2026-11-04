"use client";

import {
    createContext,
    useSyncExternalStore,
    useContext,
    useState,
    type ReactNode,
} from "react";
import { useStore } from "zustand";
import type { Viewer } from "@/features/auth/types/viewer";
import {
    createDesktopStore,
    type DesktopStore,
    type DesktopStoreApi,
} from "@/app/desktop/store/desktopStore";

import type { DesktopUrlState } from "@/app/desktop/types/appTypes";
import type { Language } from "@/lib/i18n/language";
import { useLanguageStore } from "@/lib/i18n/useLanguageStore";
import type { UiPreferences } from "@/lib/preferences/uiPreferences";
type DesktopStoreContextValue = {
    store: DesktopStoreApi;
    initialView: DesktopUrlState;
};

const DesktopStoreContext = createContext<DesktopStoreContextValue | null>(null);

export function DesktopStoreProvider({
    children,
    initialView,
    initialPreferences,
    initialViewer = { status: "guest" },
}: {
    children: ReactNode;
    initialView: DesktopUrlState;
    initialPreferences: UiPreferences;
    initialViewer?: Viewer;
}) {
    const [context] = useState<DesktopStoreContextValue>(() => ({
        store: createDesktopStore(initialViewer, initialView, initialPreferences),
        initialView,
    }));
    return (
        <DesktopStoreContext.Provider value={context}>
            {children}
        </DesktopStoreContext.Provider>
    );
}

function useDesktopContext() {
    const context = useContext(DesktopStoreContext);
    if (context === null) throw new Error("DesktopStoreProvider is missing.");
    return context;
}

export function useDesktopStoreApi(): DesktopStoreApi {
    return useDesktopContext().store;
}

export function useDesktopInitialView(): DesktopUrlState {
    return useDesktopContext().initialView;
}

export function useDesktopLanguage(): Language {
    const initialView = useDesktopInitialView();
    return useSyncExternalStore(
        useLanguageStore.subscribe,
        () => useLanguageStore.getState().currentLanguage,
        () => initialView.lang,
    );
}

export function useDesktopStore<T>(
    selector: (store: DesktopStore) => T,
): T {
    return useStore(useDesktopStoreApi(), selector);
}
