"use client";

import { GuiWindowFrameV2 } from "@/features/gui-v2/components/GuiWindowFrameV2";
import { useGuiV2Store } from "@/features/gui-v2/store/GuiV2StoreProvider";

export function GuiWindowLayerV2() {
    const windows = useGuiV2Store((state) => state.windows);
    const focus = useGuiV2Store((state) => state.focus);

    if (focus.mode === "desktop") {
        return null;
    }

    return (
        <main className="gui-v2-window-layer">
            {windows
                .filter((window) => !window.minimized)
                .map((window, index) => (
                    <GuiWindowFrameV2
                        key={window.windowId}
                        window={window}
                        active={focus.activeWindowId === window.windowId}
                        index={index}
                    />
                ))}
        </main>
    );
}
