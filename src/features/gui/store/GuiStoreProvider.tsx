"use client";

import {
    createContext,
    useContext,
    useState,
    type ReactNode,
} from "react";
import { useStore } from "zustand";
import type { Viewer } from "@/features/auth/model/viewer";
import {
    createGuiStore,
    type GuiStore,
    type GuiStoreApi,
} from "@/features/gui/store/guiStore";

const GuiStoreContext = createContext<GuiStoreApi | null>(null);

export function GuiStoreProvider({
    children,
    initialViewer = { status: "guest" },
    urlBasePath = "/gui",
}: {
    children: ReactNode;
    initialViewer?: Viewer;
    urlBasePath?: "/gui";
}) {
    const [store] = useState<GuiStoreApi>(() =>
        createGuiStore(urlBasePath, initialViewer),
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
