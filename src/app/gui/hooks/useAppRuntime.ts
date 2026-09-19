"use client";

import { useContext } from "react";

import {
    AppRuntimeContext,
    type AppRuntimeContextValue,
} from "@/app/gui/contexts/AppRuntimeContext";

export function useAppRuntime(): AppRuntimeContextValue {
    const value = useContext(AppRuntimeContext);

    if (value === null) {
        throw new Error("AppRuntimeBoundary is missing.");
    }

    return value;
}
