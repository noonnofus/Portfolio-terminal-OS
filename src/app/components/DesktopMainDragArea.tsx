'use client';

import { Flex } from "@chakra-ui/react";
import React from "react";
import DesktopApps from "@/lib/apps";
import { DesktopIcon } from "./DesktopIcon";
import { useSelector, useDispatch } from 'react-redux';
import { motion } from "framer-motion";
import { RootState } from "../store/store";
import { setActiveApp, setFoucsApp } from "../store/features/desktopSlice";
import "@/app/styles/dragAreaLayout.css";

export default function DesktopMainDragArea() {
    const isFullScreen = useSelector((state: RootState) => state.desktop.fullScreen);
    const activeApp = useSelector((state: RootState) => state.desktop.activeApp);
    const focusApp = useSelector((state: RootState) => state.desktop.focusApp);
    const dispatch = useDispatch();

    return (
        <Flex
            flexGrow={1}
            backgroundRepeat="no-repeat"
            pos="relative"
            backgroundPosition="center"
        >
            <Flex flexWrap="wrap" h="30%">
                {DesktopApps().map((app, i) => (
                    <React.Fragment key={`touchview-${app.appName}`}>
                        <motion.div
                            key={i}
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
                                key={`touchview-${app.appName}`}
                                iconName={app.iconName}
                                isFocused={focusApp === app.appName}
                                onClick={() => dispatch(setFoucsApp(app.appName))}
                                onDoubleClick={() => dispatch(setActiveApp(app.appName))}
                                title={app.title}
                            />
                        </motion.div>
                        {activeApp === app.appName && (
                            <motion.div
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
                                }}
                            >
                                {app.component}
                            </motion.div>
                        )}
                    </React.Fragment>
                ))}
            </Flex>
        </Flex>
    );
}
