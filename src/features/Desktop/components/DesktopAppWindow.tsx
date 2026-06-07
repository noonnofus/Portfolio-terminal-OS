"use client";

import React from "react";
import { motion, useDragControls } from "framer-motion";
import type { AppDefinition } from "@/features/applications/types/appDefinition";
import AppDesktopHeader from "./AppDesktopHeader";

interface DesktopAppWindowProps {
    app: AppDefinition;
    openAppPosition: { left: number; top: number };
    isFullScreen: boolean;
    isFocused: boolean;
    toggleFullscreen: (appName: string) => void;
    width?: string;
    height?: string;
    dragConstraintRef: React.RefObject<HTMLDivElement | null>;
}

export const DesktopAppWindow: React.FC<DesktopAppWindowProps> = ({
    app,
    openAppPosition,
    isFullScreen,
    isFocused,
    toggleFullscreen,
    width,
    height,
    dragConstraintRef,
}) => {
    const dragControls = useDragControls();

    return (
        <motion.div
            key={`opened-${app.appName}-${isFullScreen ? "fs" : "normal"}`}
            drag
            dragControls={dragControls}
            dragElastic={0}
            dragTransition={{ power: 0 }}
            dragConstraints={dragConstraintRef}
            dragListener={false}
            animate={{
                x: isFullScreen ? 0 : openAppPosition.left,
                y: isFullScreen ? 0 : openAppPosition.top,
            }}
            transition={{ duration: 0 }}
            style={{
                position: "absolute",
                zIndex: isFocused ? 10 : 1,
                width: isFullScreen ? "100vw" : width,
                height: isFullScreen ? "100vh" : height,
            }}
            className="flex flex-col overflow-hidden rounded-os-window border border-window-border bg-window-surface text-window-foreground shadow-os-window"
        >
            <div onPointerDown={(e) => dragControls.start(e)}>
                <AppDesktopHeader
                    appName={app.appName}
                    title={app.title}
                    isFullScreen={isFullScreen}
                    setIsFullScreen={() => toggleFullscreen(app.appName)}
                />
            </div>
            <div className="flex-1 overflow-auto">
                {app.render()}
            </div>
        </motion.div>
    );
};
