"use client";

import { useEffect, useRef, type ReactNode } from "react";

import {
    AppRuntimeContext,
    type AppRuntimeContextValue,
} from "@/app/desktop/contexts/AppRuntimeContext";
import { useDesktopStore } from "@/app/desktop/store/DesktopStoreProvider";
import type { WindowVisibility } from "@/app/desktop/types/appVisibility";
import { deriveVisibility } from "@/app/desktop/utils/deriveVisibility";

export function AppRuntimeBoundary({
    children,
    windowVisibility,
}: {
    children: ReactNode;
    windowVisibility: WindowVisibility;
}) {
    const pageVisibility = useDesktopStore((state) => state.pageVisibility);
    const resumeEpoch = useDesktopStore((state) => state.resumeEpoch);
    const containerRef = useRef<HTMLDivElement>(null);
    const effectiveVisibility = deriveVisibility(windowVisibility, pageVisibility);
    const value: AppRuntimeContextValue = {
        windowVisibility,
        pageVisibility,
        effectiveVisibility,
        resumeEpoch,
    };

    useEffect(() => {
        if (effectiveVisibility === "active") return;

        const mediaElements = containerRef.current?.querySelectorAll<
            HTMLAudioElement | HTMLVideoElement
        >("audio, video");
        mediaElements?.forEach((media) => media.pause());
    }, [effectiveVisibility]);

    return (
        <AppRuntimeContext.Provider value={value}>
            <div
                ref={containerRef}
                className="h-full"
                data-effective-visibility={effectiveVisibility}
                data-resume-epoch={resumeEpoch}
            >
                {children}
            </div>
        </AppRuntimeContext.Provider>
    );
}
