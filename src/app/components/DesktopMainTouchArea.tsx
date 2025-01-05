'use client';

import { Flex } from "@chakra-ui/react";
import React from "react";
import DesktopApps from "@/lib/apps";
import { DesktopIcon } from "./DesktopIcon";
import { useSelector, useDispatch } from 'react-redux';
import { motion } from "framer-motion";
import { RootState } from "../store/store";
import { setActiveApp } from "../store/features/desktopSlice";
import "@/app/styles/dragAreaLayout.css";

export default function DesktopMainTouchArea() {
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
                                onClick={() => dispatch(setActiveApp(app.appName))}
                                title={app.title}
                            />
                        </motion.div>
                        {activeApp === app.appName && (
                            <div
                                style={{
                                    width: "100vw",
                                    height: "100vh",
                                    position: "absolute",
                                    zIndex: 1,
                                }}
                            >
                                {app.component}
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </Flex>
        </Flex>
    );
}
