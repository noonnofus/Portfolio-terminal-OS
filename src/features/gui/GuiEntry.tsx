"use client";

import { ViewerBootstrap } from "@/features/auth/client/ViewerBootstrap";
import { GuiShell } from "@/features/gui/components/GuiShell";
import { GuiNavigationProvider } from "@/features/gui/navigation/GuiNavigationProvider";
import { GuiStoreProvider } from "@/features/gui/store/GuiStoreProvider";
import { QueryProvider } from "@/shared/lib/query/QueryProvider";

export function GuiEntry() {
    return (
        <QueryProvider>
            <GuiStoreProvider urlBasePath="/gui">
                <ViewerBootstrap />
                <GuiNavigationProvider>
                    <GuiShell />
                </GuiNavigationProvider>
            </GuiStoreProvider>
        </QueryProvider>
    );
}
