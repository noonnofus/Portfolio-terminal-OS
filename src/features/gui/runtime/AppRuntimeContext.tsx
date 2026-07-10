"use client";

import {
    createContext,
    useContext,
    useEffect,
    useRef,
    type ReactNode,
} from "react";
import {
    deriveVisibility,
    type EffectiveVisibility,
    type WindowVisibility,
} from "@/features/gui/runtime/appVisibility";
import { useGuiStore } from "@/features/gui/store/GuiStoreProvider";

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
    const pageVisibility = useGuiStore(
        (state) => state.pageVisibility,
    );
    const resumeEpoch = useGuiStore((state) => state.resumeEpoch);
    const containerRef = useRef<HTMLDivElement>(null);
    const effectiveVisibility = deriveVisibility(
        windowVisibility,
        pageVisibility,
    );
    const value = {
        windowVisibility,
        pageVisibility,
        effectiveVisibility,
        resumeEpoch,
    };

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
