"use client";

import React from "react";
import { motion, useDragControls } from "framer-motion";
import { useDispatch } from "react-redux";
import { Box } from "@chakra-ui/react";
import AppDesktopHeader from "./apps/layout/AppDesktopHeader";
import { setFoucsApp } from "../../store/features/desktopSlice";

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
    width: string;
    height: string;
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
    const dispatch = useDispatch();

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
                border: "0.3px solid gray",
                borderRadius: "9px",
                width: isFullScreen ? "100vw" : width,
                height: isFullScreen ? "100vh" : height,
                backgroundColor: "white",
                display: "flex",
                flexDirection: "column",
            }}
            className="border-black"
            onPointerDown={(e) => {
                dispatch(setFoucsApp(app.appName));
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
            <Box flex="1" overflow="auto">
                {app.component}
            </Box>
        </motion.div>
    );
};
