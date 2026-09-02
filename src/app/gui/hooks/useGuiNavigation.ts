"use client";

import { createContext, useContext } from "react";

import type { QueuedNavigationEvent } from "@/app/gui/types/navigationTypes";

export type GuiNavigationContextValue = {
    navigate: (event: QueuedNavigationEvent) => void;
    navigationBusy: boolean;
};

export const GuiNavigationContext =
    createContext<GuiNavigationContextValue | null>(null);

export function useGuiNavigation(): GuiNavigationContextValue {
    const value = useContext(GuiNavigationContext);

    if (value === null) {
        throw new Error("GuiNavigationProvider is missing.");
    }

    return value;
}
