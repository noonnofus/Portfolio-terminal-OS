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
import { useEffect } from "react";

export default function AppFolder() {
    const isFullScreen = useSelector((state: RootState) => state.desktop.fullScreen);
    const activeApp = useSelector((state: RootState) => state.desktop.activeApp);
    const focusApp = useSelector((state: RootState) => state.desktop.focusApp);
    const openApps = useSelector((state: RootState) => state.desktop.openApps);
    const dispatch = useDispatch();

    return (
        <>
            <div style={{
                backgroundColor: "white",
                borderRadius: "8px 8px 0 0",
            }}>
                <AppDesktopHeader appName="Projects Folder" />
            </div>
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    overflow: "scroll",
                    backgroundColor: "white",
                    borderRadius: "0 0 8px 8px",
                    color: 'black',
                }}
            >
                <Flex
                    flexGrow={1}
                    backgroundRepeat="no-repeat"
                    pos="relative"
                    backgroundPosition="center"
                >
                    <Flex flexWrap="wrap" h="30%">
                        {ProjectsApps().map((app, i) => (
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
                                        onDoubleClick={() => {
                                            dispatch(setActiveApp(app.appName))
                                        }}
                                        title={app.title}
                                    />
                                </motion.div>
                            </React.Fragment>
                        ))}
                    </Flex>
                </Flex>
            </div>
        </>
    );
}