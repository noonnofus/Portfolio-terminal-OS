'use client';

import { Flex, Box } from "@chakra-ui/react";
import React from "react";
import DesktopApps from "@/lib/apps";
import allApps from "@/lib/allApps";
import { DesktopIcon } from "./DesktopIcon";
import { useSelector, useDispatch } from 'react-redux';
import { motion } from "framer-motion";
import { RootState } from "../store/store";
import { setActiveApp, setFoucsApp } from "../store/features/desktopSlice";
import GuidePopOver from "./GuidePopOver";
import "@/app/styles/dragAreaLayout.css";
import { useState, useEffect } from "react";

export default function DesktopMainDragArea() {
    type Position = { left: number; top: number };
    const [fullScreenStates, setFullScreenStates] = useState<Record<string, boolean>>({});
    const isFullScreen = useSelector((state: RootState) => state.desktop.fullScreen);
    const openApps = useSelector((state: RootState) => state.desktop.openApps);
    const focusApp = useSelector((state: RootState) => state.desktop.focusApp);
    const dispatch = useDispatch();

    const allAppList = allApps();

    const [openAppPositions, setOpenAppPositions] = useState<Record<string, Position>>({});

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
                {DesktopApps().map((app, i) => (
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
                            onClick={() => dispatch(setFoucsApp(app.appName))}
                            onDoubleClick={() => {
                                dispatch(setFoucsApp(app.appName))
                                dispatch(setActiveApp(app.appName))
                            }}
                            title={app.title}
                        />
                    </motion.div>
                ))}
            </Flex>
            {allAppList.map((app, i) =>
                openApps.includes(app.appName) && openAppPositions[app.appName] && (
                    <motion.div
                        key={`opened-${app.appName}`}
                        drag
                        dragElastic={0}
                        dragTransition={{ power: 0 }}
                        animate={{
                            x: openAppPositions[app.appName].left,
                            y: openAppPositions[app.appName].top
                        }}
                        transition={{ duration: 0 }}
                        style={{
                            position: "absolute",
                            zIndex: focusApp === app.appName ? 10 : 1,
                            border: "0.5px solid black",
                            borderRadius: "9px",
                        }}
                        className="border-black"
                        onClick={() => dispatch(setFoucsApp(app.appName))}
                    >
                        {app.component}
                    </motion.div>
                )
            )}

            <Box position="fixed" bottom="1rem" left="1rem" zIndex={50}>
                <GuidePopOver />
            </Box>
        </Flex>
    );
}