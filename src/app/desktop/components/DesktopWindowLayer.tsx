"use client";

import { useEffect, useState } from "react";
import { DesktopWindowFrame } from "@/app/desktop/components/DesktopWindowFrame";
import { useDesktopStore } from "@/app/desktop/store/DesktopStoreProvider";

export function DesktopWindowLayer() {
    const windows = useDesktopStore((state) => state.windows);
    const focus = useDesktopStore((state) => state.focus);
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
                    <DesktopWindowFrame
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
