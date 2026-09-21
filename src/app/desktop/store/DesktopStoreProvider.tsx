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
    createDesktopStore,
    type DesktopStore,
    type DesktopStoreApi,
} from "@/app/desktop/store/desktopStore";

const DesktopStoreContext = createContext<DesktopStoreApi | null>(null);

export function DesktopStoreProvider({
    children,
    initialViewer = { status: "guest" },
}: {
    children: ReactNode;
    initialViewer?: Viewer;
}) {
    const [store] = useState<DesktopStoreApi>(() =>
        createDesktopStore(initialViewer),
    );

    return (
        <DesktopStoreContext.Provider value={store}>
            {children}
        </DesktopStoreContext.Provider>
    );
}

export function useDesktopStoreApi(): DesktopStoreApi {
    const store = useContext(DesktopStoreContext);

    if (store === null) {
        throw new Error("DesktopStoreProvider is missing.");
    }

    return store;
}

export function useDesktopStore<T>(
    selector: (store: DesktopStore) => T,
): T {
    return useStore(useDesktopStoreApi(), selector);
}
