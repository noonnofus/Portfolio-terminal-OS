"use client";

import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useRef,
    type ReactNode,
} from "react";
import {
    deriveVisibility,
    type EffectiveVisibility,
    type WindowVisibility,
} from "@/features/gui-v2/runtime/appVisibility";
import { useGuiV2Store } from "@/features/gui-v2/store/GuiV2StoreProvider";

type AppRuntimeContextValue = {
    windowVisibility: WindowVisibility;
    pageVisibility: "visible" | "hidden";
    effectiveVisibility: EffectiveVisibility;
    resumeEpoch: number;
};

const AppRuntimeContext =
    createContext<AppRuntimeContextValue | null>(null);

export function AppRuntimeBoundary({
    children,
    windowVisibility,
}: {
    children: ReactNode;
    windowVisibility: WindowVisibility;
}) {
    const pageVisibility = useGuiV2Store(
        (state) => state.pageVisibility,
    );
    const resumeEpoch = useGuiV2Store((state) => state.resumeEpoch);
    const containerRef = useRef<HTMLDivElement>(null);
    const effectiveVisibility = deriveVisibility(
        windowVisibility,
        pageVisibility,
    );
    const value = useMemo(
        () => ({
            windowVisibility,
            pageVisibility,
            effectiveVisibility,
            resumeEpoch,
        }),
        [
            effectiveVisibility,
            pageVisibility,
            resumeEpoch,
            windowVisibility,
        ],
    );

    useEffect(() => {
        if (effectiveVisibility === "active") {
            return;
        }

        const mediaElements =
            containerRef.current?.querySelectorAll<
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

export function useAppRuntime(): AppRuntimeContextValue {
    const value = useContext(AppRuntimeContext);

    if (value === null) {
        throw new Error("AppRuntimeBoundary is missing.");
    }

    return value;
}
