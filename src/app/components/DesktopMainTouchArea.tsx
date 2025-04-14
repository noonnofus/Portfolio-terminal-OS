'use client';

import AppDesktopHeader from "./desktop/apps/layout/AppDesktopHeader";
import { Flex, Box } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import DesktopApps from "@/lib/apps";
import allApps from "@/lib/allApps";
import { DesktopIcon } from "./DesktopIcon";
import { useSelector, useDispatch } from 'react-redux';
import { motion, useDragControls, DragControls } from "framer-motion";
import { RootState } from "../store/store";
import { setActiveApp, setFoucsApp } from "../store/features/desktopSlice";
import GuidePopOver from "./GuidePopOver";
import "@/app/styles/dragAreaLayout.css";

export default function DesktopMainTouchArea() {
    type Position = { left: number; top: number };
    const openApps = useSelector((state: RootState) => state.desktop.openApps);
    const focusApp = useSelector((state: RootState) => state.desktop.focusApp);
    const dispatch = useDispatch();
    const allAppList = allApps();

    const [fullscreenStates, setFullscreenStates] = useState<Record<string, boolean>>({});
    const [openAppPositions, setOpenAppPositions] = useState<Record<string, Position>>({});

    const dragControlsList = allAppList.map(() => useDragControls());
    const dragControlsMap = allAppList.reduce<Record<string, DragControls>>((map, app, i) => {
        map[app.appName] = dragControlsList[i];
        return map;
    }, {});

    const toggleFullscreen = (appName: string) => {
        setFullscreenStates(prev => ({
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
                {DesktopApps().map((app, i) => (
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
            {allAppList.map((app, i) =>
                openApps.includes(app.appName) && openAppPositions[app.appName] && (
                    <motion.div
                        key={`opened-${app.appName}-${fullscreenStates[app.appName] ? "fs" : "normal"}`}
                        drag
                        dragControls={dragControlsMap[app.appName]}
                        dragElastic={0}
                        dragTransition={{ power: 0 }}
                        dragConstraints={{ top: 0 }}
                        dragListener={false}
                        animate={{
                            x: fullscreenStates[app.appName] ? 0 : openAppPositions[app.appName].left,
                            y: fullscreenStates[app.appName] ? 0 : openAppPositions[app.appName].top,
                        }}
                        transition={{ duration: 0 }}
                        style={{
                            position: "absolute",
                            zIndex: focusApp === app.appName ? 10 : 1,
                            border: "0.3px solid gray",
                            borderRadius: "9px",
                            width: fullscreenStates[app.appName] ? "100vw" : "75vw",
                            height: fullscreenStates[app.appName] ? "100vh" : "75vh",
                            backgroundColor: "white",
                            display: "flex",
                            flexDirection: "column"
                        }}
                        className="border-black"
                        onClick={() => dispatch(setFoucsApp(app.appName))}
                    >
                        <div onPointerDown={(e) => dragControlsMap[app.appName].start(e)}>
                            <AppDesktopHeader
                                appName={app.appName}
                                title={app.title}
                                isFullScreen={!!fullscreenStates[app.appName]}
                                setIsFullScreen={() => toggleFullscreen(app.appName)}
                            />
                        </div>
                        <Box flex="1" overflow="auto">
                            {app.component}
                        </Box>
                    </motion.div>
                )
            )}

            <Box position="fixed" bottom="1rem" left="1rem" zIndex={50}>
                <GuidePopOver />
            </Box>
        </Flex>
    );
}