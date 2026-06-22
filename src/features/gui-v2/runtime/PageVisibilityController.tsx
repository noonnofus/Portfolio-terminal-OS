"use client";

import { useEffect } from "react";
import { useGuiV2StoreApi } from "@/features/gui-v2/store/GuiV2StoreProvider";

export function PageVisibilityController() {
    const store = useGuiV2StoreApi();

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
