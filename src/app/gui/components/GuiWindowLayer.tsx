"use client";

import { useEffect, useState } from "react";
import { GuiWindowFrame } from "@/app/gui/components/GuiWindowFrame";
import { useGuiStore } from "@/app/gui/store/GuiStoreProvider";

export function GuiWindowLayer() {
    const windows = useGuiStore((state) => state.windows);
    const focus = useGuiStore((state) => state.focus);
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
            className="application-window-layer"
            data-workspace-mode={focus.mode}
        >
            {windows.map((window, index) => (
                    <GuiWindowFrame
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
