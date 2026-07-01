"use client";

import { GuiShell } from "@/features/gui/components/GuiShell";
import { GuiNavigationProvider } from "@/features/gui/navigation/GuiNavigationProvider";
import { GuiStoreProvider } from "@/features/gui/store/GuiStoreProvider";

export function GuiEntry() {
    return (
        <GuiStoreProvider urlBasePath="/gui">
            <GuiNavigationProvider>
                <GuiShell />
            </GuiNavigationProvider>
        </GuiStoreProvider>
    );
}
