"use client";

import { MotionConfig } from "framer-motion";
import { GuiDesktopShortcutsV2 } from "@/features/gui-v2/components/GuiDesktopShortcutsV2";
import { GuiDockV2 } from "@/features/gui-v2/components/GuiDockV2";
import { GuiSystemBarV2 } from "@/features/gui-v2/components/GuiSystemBarV2";
import { GuiWindowLayerV2 } from "@/features/gui-v2/components/GuiWindowLayerV2";
import { PageVisibilityController } from "@/features/gui-v2/runtime/PageVisibilityController";
import { useGuiV2Store } from "@/features/gui-v2/store/GuiV2StoreProvider";
import "@/features/gui-v2/styles/gui-v2.css";

export function GuiShellV2() {
    const urlReady = useGuiV2Store((state) => state.urlReady);

    return (
        <MotionConfig reducedMotion="user">
            <div className="gui-v2-shell">
                <PageVisibilityController />
                <div aria-hidden className="gui-v2-background-type">
                    HYUNHO
                </div>
                <GuiSystemBarV2 />
                <GuiDesktopShortcutsV2 />
                {urlReady ? <GuiWindowLayerV2 /> : null}
                <GuiDockV2 />
            </div>
        </MotionConfig>
    );
}
