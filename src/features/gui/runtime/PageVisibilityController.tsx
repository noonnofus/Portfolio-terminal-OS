"use client";

import { useEffect } from "react";
import { useGuiStoreApi } from "@/features/gui/store/GuiStoreProvider";

export function PageVisibilityController() {
    const store = useGuiStoreApi();

    useEffect(() => {
        const syncVisibility = () => {
            store
                .getState()
                .setPageVisibility(
                    document.visibilityState === "hidden"
                        ? "hidden"
                        : "visible",
                );
        };

        syncVisibility();
        document.addEventListener("visibilitychange", syncVisibility);
        const handlePageShow = (event: PageTransitionEvent) => {
            syncVisibility();
            if (event.persisted) {
                store.getState().signalPageRestore();
            }
        };

        window.addEventListener("pageshow", handlePageShow);

        return () => {
            document.removeEventListener(
                "visibilitychange",
                syncVisibility,
            );
            window.removeEventListener("pageshow", handlePageShow);
        };
    }, [store]);

    return null;
}
