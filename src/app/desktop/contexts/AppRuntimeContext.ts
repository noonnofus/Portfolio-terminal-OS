"use client";

import { createContext } from "react";

import type {
    EffectiveVisibility,
    PageVisibility,
    WindowVisibility,
} from "@/app/desktop/types/appVisibility";

export type AppRuntimeContextValue = {
    windowVisibility: WindowVisibility;
    pageVisibility: PageVisibility;
    effectiveVisibility: EffectiveVisibility;
    resumeEpoch: number;
};

export const AppRuntimeContext =
    createContext<AppRuntimeContextValue | null>(null);
