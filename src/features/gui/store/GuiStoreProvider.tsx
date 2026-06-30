"use client";

import {
    createContext,
    useContext,
    useState,
    type ReactNode,
} from "react";
import { useStore } from "zustand";
import {
    createGuiV2Store,
    type GuiV2Store,
    type GuiV2StoreApi,
} from "@/features/gui-v2/store/guiV2Store";

const GuiV2StoreContext = createContext<GuiV2StoreApi | null>(null);

export function GuiV2StoreProvider({
    children,
    urlBasePath = "/gui-v2",
}: {
    children: ReactNode;
    urlBasePath?: "/gui" | "/gui-v2";
}) {
    const [store] = useState<GuiV2StoreApi>(() =>
        createGuiV2Store(urlBasePath),
    );

    return (
        <GuiV2StoreContext.Provider value={store}>
            {children}
        </GuiV2StoreContext.Provider>
    );
}

export function useGuiV2StoreApi(): GuiV2StoreApi {
    const store = useContext(GuiV2StoreContext);

    if (store === null) {
        throw new Error("GuiV2StoreProvider is missing.");
    }

    return store;
}

export function useGuiV2Store<T>(
    selector: (store: GuiV2Store) => T,
): T {
    return useStore(useGuiV2StoreApi(), selector);
}
