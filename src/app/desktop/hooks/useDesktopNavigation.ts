"use client";

import { createContext, useContext } from "react";

import type { QueuedNavigationEvent } from "@/app/desktop/types/navigationTypes";

export type DesktopNavigationContextValue = {
    navigate: (event: QueuedNavigationEvent) => void;
    navigationBusy: boolean;
};

export const DesktopNavigationContext =
    createContext<DesktopNavigationContextValue | null>(null);

export function useDesktopNavigation(): DesktopNavigationContextValue {
    const value = useContext(DesktopNavigationContext);

    if (value === null) {
        throw new Error("DesktopNavigationProvider is missing.");
    }

    return value;
}
