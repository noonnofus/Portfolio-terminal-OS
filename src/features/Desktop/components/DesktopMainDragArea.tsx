"use client";

import { Flex, Box } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import DesktopApps from "@/features/Apps/Config/apps";
import allApps from "@/features/Apps/Config/allApps";
import { DesktopIcon } from "./DesktopIcon";
import { motion } from "framer-motion";
import GuidePopOver from "./GuidePopOver";
import "@/shared/styles/dragAreaLayout.css";
import { DesktopAppWindow } from "./DesktopAppWindow";
import { useDesktopStore } from "@/features/Desktop/store/useDesktopStore";
import { useLanguageStore } from "@/shared/lib/i18n/useLanguageStore";

export default function DesktopMainDragArea() {
    type Position = { left: number; top: number };
    const openApps = useDesktopStore((state) => state.openApps);
    const focusApp = useDesktopStore((state) => state.focusApp);
    const setFocusApp = useDesktopStore((state) => state.setFocusApp);
    const setActiveApp = useDesktopStore((state) => state.setActiveApp);
    const language = useLanguageStore((state) => state.currentLanguage);
    
    const allAppList = allApps();

    const [fullscreenStates, setFullscreenStates] = useState<
        Record<string, boolean>
    >({});
    const [openAppPositions, setOpenAppPositions] = useState<
        Record<string, Position>
    >({});

    const toggleFullscreen = (appName: string) => {
        setFullscreenStates((prev) => ({
            ...prev,
            [appName]: !prev[appName],
        }));
    };

    useEffect(() => {
        const newPositions = { ...openAppPositions };

        openApps.forEach((appName, index) => {
            if (!newPositions[appName]) {
                const offset = index * 50;
                newPositions[appName] = { left: offset, top: offset };
            }
        });

        setOpenAppPositions(newPositions);
    }, [openApps]);

    return (
        <Flex
            flexGrow={1}
            backgroundRepeat="no-repeat"
            pos="relative"
            backgroundPosition="center"
        >
            <Flex flexWrap="wrap" h="30%">
                {DesktopApps(language).map((app, i) => (
                    <motion.div
                        key={`icon-${app.appName}`}
                        drag
                        dragElastic={0}
                        dragTransition={{ power: 0 }}
                        style={{
                            position: "absolute",
                            cursor: "grab",
                        }}
                        className={`app-initial-position app-${i + 1}`}
                    >
                        <DesktopIcon
                            iconName={app.iconName}
                            isFocused={focusApp === app.appName}
                            onClick={() => setFocusApp(app.appName)}
                            onDoubleClick={() => {
                                setFocusApp(app.appName);
                                setActiveApp(app.appName);
                            }}
                            title={app.title}
                        />
                    </motion.div>
                ))}
            </Flex>
            {allAppList.map(
                (app) =>
                    openApps.includes(app.appName) &&
                    openAppPositions[app.appName] && (
                        <DesktopAppWindow
                            key={app.appName}
                            app={app}
                            openAppPosition={openAppPositions[app.appName]}
                            isFullScreen={!!fullscreenStates[app.appName]}
                            isFocused={focusApp === app.appName}
                            toggleFullscreen={toggleFullscreen}
                            width="75vw"
                            height="75vh"
                        />
                    )
            )}

            <Box position="fixed" bottom="1rem" left="1rem" zIndex={50}>
                <GuidePopOver />
            </Box>
        </Flex>
    );
}
