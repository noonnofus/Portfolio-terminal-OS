"use client";

import dynamic from "next/dynamic";
import { WindowLoadingState } from "@/features/gui/components/WindowLoadingState";
import type { GuiAppComponentProps } from "@/features/gui/registry/appTypes";
import { ensureProjectNamespace } from "@/shared/lib/i18n/loadProjectNamespace";

export const optigenAppLoader = dynamic<
    GuiAppComponentProps<"project:optigen">
>(
    async () => {
        await ensureProjectNamespace("Optigen");
        const { default: App } = await import("./OptigenApp");
        return function OptigenAdapter({ language }) {
            return <App language={language} />;
        };
    },
    { loading: WindowLoadingState },
);
