"use client";

import { useEffect, useState } from "react";
import { GuiWindowFrameV2 } from "@/features/gui-v2/components/GuiWindowFrameV2";
import { useGuiV2Store } from "@/features/gui-v2/store/GuiV2StoreProvider";

export function GuiWindowLayerV2() {
    const windows = useGuiV2Store((state) => state.windows);
    const focus = useGuiV2Store((state) => state.focus);
    const [clampEpoch, setClampEpoch] = useState(0);

    useEffect(() => {
        let frame = 0;
        const handleResize = () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => {
                setClampEpoch((current) => current + 1);
            });
        };

        globalThis.addEventListener("resize", handleResize);
        return () => {
            cancelAnimationFrame(frame);
            globalThis.removeEventListener("resize", handleResize);
        };
    }, []);

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
                        clampEpoch={clampEpoch}
                    />
                ))}
        </main>
    );
}
