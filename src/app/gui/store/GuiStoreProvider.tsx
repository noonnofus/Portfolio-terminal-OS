"use client";

import {
    createContext,
    useContext,
    useState,
    type ReactNode,
} from "react";
import { useStore } from "zustand";
import type { Viewer } from "@/features/auth/types/viewer";
import {
    createGuiStore,
    type GuiStore,
    type GuiStoreApi,
} from "@/app/gui/store/guiStore";

const GuiStoreContext = createContext<GuiStoreApi | null>(null);

export function GuiStoreProvider({
    children,
    initialViewer = { status: "guest" },
}: {
    children: ReactNode;
    initialViewer?: Viewer;
}) {
    const [store] = useState<GuiStoreApi>(() =>
        createGuiStore(initialViewer),
    );

    return (
        <GuiStoreContext.Provider value={store}>
            {children}
        </GuiStoreContext.Provider>
    );
}

export function useGuiStoreApi(): GuiStoreApi {
    const store = useContext(GuiStoreContext);

    if (store === null) {
        throw new Error("GuiStoreProvider is missing.");
    }

    return store;
}

export function useGuiStore<T>(
    selector: (store: GuiStore) => T,
): T {
    return useStore(useGuiStoreApi(), selector);
}
