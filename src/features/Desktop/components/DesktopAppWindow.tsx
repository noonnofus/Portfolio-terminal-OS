"use client";

import React from "react";
import { motion, useDragControls } from "framer-motion";
import { useDesktopStore } from "@/features/Desktop/store/useDesktopStore";
import AppDesktopHeader from "./AppDesktopHeader";

interface AppDefinition {
    iconName: string;
    appName: string;
    title: string;
    component: React.ReactNode;
}

interface DesktopAppWindowProps {
    app: AppDefinition;
    openAppPosition: { left: number; top: number };
    isFullScreen: boolean;
    isFocused: boolean;
    toggleFullscreen: (appName: string) => void;
    width?: string;
    height?: string;
    onPointerDown?: (e: React.PointerEvent) => void;
}

export const DesktopAppWindow: React.FC<DesktopAppWindowProps> = ({
    app,
    openAppPosition,
    isFullScreen,
    isFocused,
    toggleFullscreen,
    width,
    height,
    onPointerDown
}) => {
    const dragControls = useDragControls();
    const setFocusApp = useDesktopStore((state) => state.setFocusApp);

    return (
        <motion.div
            key={`opened-${app.appName}-${isFullScreen ? "fs" : "normal"}`}
            drag
            dragControls={dragControls}
            dragElastic={0}
            dragTransition={{ power: 0 }}
            dragConstraints={{ top: 0 }}
            dragListener={false}
            animate={{
                x: isFullScreen ? 0 : openAppPosition.left,
                y: isFullScreen ? 0 : openAppPosition.top,
            }}
            transition={{ duration: 0 }}
            style={{
                position: "absolute",
                zIndex: isFocused ? 10 : 1,
                borderRadius: "9px",
                width: isFullScreen ? "100vw" : width,
                height: isFullScreen ? "100vh" : height,
            }}
            className="border-[0.3px] border-pen-gray-500 bg-white flex flex-col overflow-hidden"
            onPointerDown={(e) => {
                setFocusApp(app.appName);
                if (onPointerDown) onPointerDown(e);
            }}
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
                {app.component}
            </div>
        </motion.div>
    );
};
