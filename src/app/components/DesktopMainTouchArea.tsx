"use client";

import { Flex, Box } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import DesktopApps from "@/lib/apps";
import allApps from "@/lib/allApps";
import { DesktopIcon } from "./DesktopIcon";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { RootState } from "../store/store";
import { setActiveApp, setFoucsApp } from "../store/features/desktopSlice";
import GuidePopOver from "./GuidePopOver";
import "@/app/styles/dragAreaLayout.css";
import { DesktopAppWindow } from "./desktop/DesktopAppWindow";

export default function DesktopMainTouchArea() {
    type Position = { left: number; top: number };
    const openApps = useSelector((state: RootState) => state.desktop.openApps);
    const focusApp = useSelector((state: RootState) => state.desktop.focusApp);
    const language = useSelector(
        (state: RootState) => state.language.currentLanguage
    );
    const dispatch = useDispatch();
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
                const offset = index * 20;
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
                        style={{ position: "absolute", cursor: "grab" }}
                        className={`app-initial-position app-${i + 1}`}
                    >
                        <DesktopIcon
                            iconName={app.iconName}
                            isFocused={focusApp === app.appName}
                            onClick={() => {
                                dispatch(setFoucsApp(app.appName));
                                dispatch(setActiveApp(app.appName));
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
                            width="85vw"
                            height="75vh"
                            onPointerDown={(e) => {
                                if (e.target === e.currentTarget) {
                                    dispatch(setFoucsApp(app.appName));
                                }
                            }}
                        />
                    )
            )}
            <Box position="fixed" bottom="1rem" left="1rem" zIndex={50}>
                <GuidePopOver />
            </Box>
        </Flex>
    );
}
