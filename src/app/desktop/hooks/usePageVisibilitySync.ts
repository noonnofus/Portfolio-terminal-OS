"use client";

import { useEffect } from "react";
import { useDesktopStoreApi } from "@/app/desktop/store/DesktopStoreProvider";

export function usePageVisibilitySync() {
    const store = useDesktopStoreApi();

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

}
