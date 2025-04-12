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

export default function DesktopMainDragArea() {
    const isFullScreen = useSelector((state: RootState) => state.desktop.fullScreen);
    const openApps = useSelector((state: RootState) => state.desktop.openApps);
    const focusApp = useSelector((state: RootState) => state.desktop.focusApp);
    const dispatch = useDispatch();

    const allAppList = allApps();

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
                            onDoubleClick={() => dispatch(setActiveApp(app.appName))}
                            title={app.title}
                        />
                    </motion.div>
                ))}
            </Flex>
            {allAppList.map((app, i) =>
                openApps.includes(app.appName) && (
                    <motion.div
                        key={`opened-${app.appName}`}
                        drag
                        dragElastic={0}
                        dragTransition={{ power: 0 }}
                        animate={{
                            x: isFullScreen ? 0 : "5%",
                            y: 0
                        }}
                        transition={{ duration: 0 }}
                        style={{
                            width: isFullScreen ? "100vw" : "75vw",
                            height: isFullScreen ? "100vh" : "75vh",
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