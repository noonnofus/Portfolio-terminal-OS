"use client";

import { GuiShell } from "@/app/gui/components/GuiShell";
import { GuiNavigationProvider } from "@/app/gui/components/GuiNavigationProvider";
import { useViewerBootstrap } from "@/app/gui/hooks/useViewerBootstrap";
import { GuiStoreProvider } from "@/app/gui/store/GuiStoreProvider";
import { QueryProvider } from "@/lib/query/QueryProvider";

export function GuiClient() {
    return (
        <QueryProvider>
            <GuiStoreProvider urlBasePath="/gui">
                <GuiApplication />
            </GuiStoreProvider>
        </QueryProvider>
    );
}

function GuiApplication() {
    useViewerBootstrap();

    return (
        <GuiNavigationProvider>
            <GuiShell />
        </GuiNavigationProvider>
    );
}
