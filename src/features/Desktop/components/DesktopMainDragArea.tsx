"use client";

import React, { useMemo, useRef, useState } from "react";
import getRootApplicationDefinitions from "@/features/applications/lib/getRootApplicationDefinitions";
import getProjectApplicationDefinitions from "@/features/applications/lib/getProjectApplicationDefinitions";
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
    const desktopAreaRef = useRef<HTMLDivElement>(null);
    
    const allAppList = [
        ...getRootApplicationDefinitions(language),
        ...getProjectApplicationDefinitions(language),
    ];

    const [fullscreenStates, setFullscreenStates] = useState<
        Record<string, boolean>
    >({});
    const openAppPositions = useMemo(
        () =>
            openApps.reduce<Record<string, Position>>((positions, appName, index) => {
                const offset = index * 50;
                positions[appName] = { left: offset, top: offset };
                return positions;
            }, {}),
        [openApps]
    );

    const toggleFullscreen = (appName: string) => {
        setFullscreenStates((prev) => ({
            ...prev,
            [appName]: !prev[appName],
        }));
    };

    return (
        <div ref={desktopAreaRef} className="grow relative bg-no-repeat bg-center">
            {getRootApplicationDefinitions(language).map((app, i) => (
                <motion.div
                    key={`icon-${app.appName}`}
                    drag
                    dragConstraints={desktopAreaRef}
                    dragElastic={0}
                    dragTransition={{ power: 0 }}
                    style={{
                        position: "absolute",
                        cursor: "grab",
                    }}
                    className={`app-initial-position app-${i + 1}`}
                >
                    <DesktopIcon
                        iconSrc={app.iconSrc}
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
                            dragConstraintRef={desktopAreaRef}
                        />
                    )
            )}

            <div className="fixed bottom-4 left-4 z-50">
                <GuidePopOver />
            </div>
        </div>
    );
}
