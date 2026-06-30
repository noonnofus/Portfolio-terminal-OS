"use client";

import { useSyncExternalStore } from "react";
import { MotionConfig } from "framer-motion";
import { GuiDesktopShortcutsV2 } from "@/features/gui-v2/components/GuiDesktopShortcutsV2";
import { GuiDockV2 } from "@/features/gui-v2/components/GuiDockV2";
import { GuiSystemBarV2 } from "@/features/gui-v2/components/GuiSystemBarV2";
import type { GuiViewer } from "@/features/gui-v2/components/GuiSystemBarV2";
import { GuiWindowLayerV2 } from "@/features/gui-v2/components/GuiWindowLayerV2";
import { PageVisibilityController } from "@/features/gui-v2/runtime/PageVisibilityController";
import { useGuiV2Store } from "@/features/gui-v2/store/GuiV2StoreProvider";
import { useColorMode } from "@/shared/ui/color-mode";
import "@/features/gui-v2/styles/gui-v2.css";

export function GuiShellV2({
    viewer = { kind: "guest" },
}: {
    viewer?: GuiViewer;
}) {
    const urlReady = useGuiV2Store((state) => state.urlReady);
    const wallpaper = useGuiV2Store((state) => state.wallpaper);
    const { colorMode } = useColorMode();
    const themeMounted = useSyncExternalStore(
        () => () => undefined,
        () => true,
        () => false,
    );

    return (
        <MotionConfig reducedMotion="user">
            <div
                className="gui-v2-shell"
                data-wallpaper={wallpaper}
                data-theme={themeMounted ? colorMode : undefined}
            >
                <PageVisibilityController />
                <div
                    aria-hidden="true"
                    className="gui-v2-wallpaper-art"
                >
                    <span />
                    <span />
                    <span />
                </div>
                <div aria-hidden className="gui-v2-background-type">
                    HYUNHO
                </div>
                <GuiSystemBarV2 viewer={viewer} />
                <GuiDesktopShortcutsV2 />
                {urlReady ? <GuiWindowLayerV2 /> : null}
                <GuiDockV2 />
            </div>
        </MotionConfig>
    );
}
