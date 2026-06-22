"use client";

import { GuiWindowFrameV2 } from "@/features/gui-v2/components/GuiWindowFrameV2";
import { useGuiV2Store } from "@/features/gui-v2/store/GuiV2StoreProvider";

export function GuiWindowLayerV2() {
    const windows = useGuiV2Store((state) => state.windows);
    const focus = useGuiV2Store((state) => state.focus);

    return (
        <main
            className="gui-v2-window-layer"
            data-workspace-mode={focus.mode}
        >
            {windows.map((window, index) => (
                    <GuiWindowFrameV2
                        key={window.windowId}
                        window={window}
                        active={
                            focus.mode === "windows" &&
                            focus.activeWindowId === window.windowId
                        }
                        workspaceDesktop={focus.mode === "desktop"}
                        index={index}
                    />
                ))}
        </main>
    );
}
