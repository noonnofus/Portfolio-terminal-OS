"use client";

import type { Viewer } from "@/features/auth/model/viewer";
import { GuiShell } from "@/features/gui/components/GuiShell";
import { GuiNavigationProvider } from "@/features/gui/navigation/GuiNavigationProvider";
import { GuiStoreProvider } from "@/features/gui/store/GuiStoreProvider";
import { QueryProvider } from "@/shared/lib/query/QueryProvider";

export function GuiEntry({ viewer }: { viewer?: Viewer }) {
    return (
        <QueryProvider>
            <GuiStoreProvider initialViewer={viewer} urlBasePath="/gui">
                <GuiNavigationProvider>
                    <GuiShell />
                </GuiNavigationProvider>
            </GuiStoreProvider>
        </QueryProvider>
    );
}
