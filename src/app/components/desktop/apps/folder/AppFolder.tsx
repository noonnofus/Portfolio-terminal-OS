import AppDesktopHeader from "../layout/AppDesktopHeader";
import { Flex } from "@chakra-ui/react";
import ProjectsApps from "@/lib/projectsApps";
import React from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from "@/app/store/store";
import { setActiveApp, setFoucsApp } from "@/app/store/features/desktopSlice";
import { DesktopIcon } from "@/app/components/DesktopIcon";
import "@/app/styles/dragAreaLayout.css";
import { useState } from "react";

export default function AppFolder() {
    const [isFullScreen, setIsFullScreen] = useState<boolean>(true);
    const focusApp = useSelector((state: RootState) => state.desktop.focusApp);
    const dispatch = useDispatch();

    return (
        <div
            style={{
                width: isFullScreen ? "100vw" : "75vw",
                height: isFullScreen ? "100vh" : "75vh",
                backgroundColor: "white",
                borderRadius: 8,
                display: "flex",
                flexDirection: "column"
            }}
        >
            <AppDesktopHeader
                appName="Projects Folder"
                title="Projects"
                isFullScreen={isFullScreen}
                setIsFullScreen={setIsFullScreen}
            />
            <div
                style={{
                    flexGrow: 1,
                    overflow: "scroll",
                    backgroundColor: "white",
                    color: 'black',
                }}
            >
                <Flex flexWrap="wrap" h="30%">
                    {ProjectsApps().map((app, i) => (
                        <motion.div
                            key={`touchview-${app.appName}`}
                            drag
                            dragElastic={0}
                            dragTransition={{ power: 0 }}
                            style={{ position: "absolute", cursor: "grab" }}
                            className={`app-initial-position app-${i + 1}`}
                        >
                            <DesktopIcon
                                iconName={app.iconName}
                                isFocused={focusApp === app.appName}
                                onClick={() => dispatch(setFoucsApp(app.appName))}
                                onDoubleClick={() => {
                                    dispatch(setFoucsApp(app.appName));
                                    dispatch(setActiveApp(app.appName));
                                }}
                                title={app.title}
                            />
                        </motion.div>
                    ))}
                </Flex>
            </div>
        </div>
    );
}