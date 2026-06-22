"use client";

import { GuiShellV2 } from "@/features/gui-v2/components/GuiShellV2";
import { GuiNavigationProvider } from "@/features/gui-v2/navigation/GuiNavigationProvider";
import { GuiV2StoreProvider } from "@/features/gui-v2/store/GuiV2StoreProvider";

export function GuiV2Entry() {
    return (
        <GuiV2StoreProvider urlBasePath="/gui-v2">
            <GuiNavigationProvider>
                <GuiShellV2 />
            </GuiNavigationProvider>
        </GuiV2StoreProvider>
    );
}
