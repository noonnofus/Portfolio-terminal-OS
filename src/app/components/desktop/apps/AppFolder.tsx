import { Flex } from "@chakra-ui/react";
import ProjectsApps from "@/lib/projectsApps";
import React from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from "@/app/store/store";
import { setActiveApp, setFoucsApp } from "@/app/store/features/desktopSlice";
import { DesktopIcon } from "@/app/components/DesktopIcon";
import "@/app/styles/touchFolderLayout.css";
import { useRef } from "react";

export default function AppFolder() {
    const focusApp = useSelector((state: RootState) => state.desktop.focusApp);
    const isTouchDevice = useSelector((state: RootState) => state.desktop.isTouchDevice);
    const dispatch = useDispatch();

    const dragAreaRef = useRef<HTMLDivElement>(null);

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                flexGrow: 1,
                overflow: "scroll",
                color: 'black',
                borderRadius: 8,
            }}
            ref={dragAreaRef}
        >
            <Flex flexWrap="wrap" h="100%">
                {ProjectsApps().map((app, i) => (
                    <motion.div
                        key={`touchview-${app.appName}`}
                        drag
                        dragElastic={0}
                        dragTransition={{ power: 0 }}
                        dragConstraints={dragAreaRef}
                        style={{
                            position: "absolute",
                            zIndex: focusApp === app.appName ? 10 : 1,
                            cursor: "grab",
                        }}
                        className={`app-initial-position ${isTouchDevice ? `folder-app-${i + 1}` : `app-${i + 1}`}`}

                    >
                        {isTouchDevice ? (
                            <DesktopIcon
                                iconName={app.iconName}
                                isFocused={focusApp === app.appName}
                                onClick={() => {
                                    dispatch(setFoucsApp(app.appName));
                                    dispatch(setActiveApp(app.appName));
                                }}
                                title={app.title}
                            />

                        ) : (
                            <DesktopIcon
                                iconName={app.iconName}
                                isFocused={focusApp === app.appName}
                                onClick={() => {
                                    dispatch(setFoucsApp(app.appName));
                                }}
                                onDoubleClick={() => {
                                    dispatch(setFoucsApp(app.appName));
                                    dispatch(setActiveApp(app.appName));
                                }}
                                title={app.title}
                            />
                        )}
                    </motion.div>
                ))}
            </Flex>
        </div>
    );
}