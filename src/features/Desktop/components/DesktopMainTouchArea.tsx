"use client";

import React, { useMemo, useState } from "react";
import DesktopApps from "@/features/Apps/Config/apps";
import allApps from "@/features/Apps/Config/allApps";
import { DesktopIcon } from "./DesktopIcon";
import { motion } from "framer-motion";
import GuidePopOver from "./GuidePopOver";
import "@/shared/styles/dragAreaLayout.css";
import { DesktopAppWindow } from "./DesktopAppWindow";
import { useDesktopStore } from "@/features/Desktop/store/useDesktopStore";
import { useLanguageStore } from "@/shared/lib/i18n/useLanguageStore";

export default function DesktopMainTouchArea() {
    type Position = { left: number; top: number };
    const openApps = useDesktopStore((state) => state.openApps);
    const focusApp = useDesktopStore((state) => state.focusApp);
    const setFocusApp = useDesktopStore((state) => state.setFocusApp);
    const setActiveApp = useDesktopStore((state) => state.setActiveApp);
    const language = useLanguageStore((state) => state.currentLanguage);
    
    const allAppList = allApps(language);

    const [fullscreenStates, setFullscreenStates] = useState<
        Record<string, boolean>
    >({});
    const openAppPositions = useMemo(
        () =>
            openApps.reduce<Record<string, Position>>((positions, appName, index) => {
                const offset = index * 20;
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
        <div className="grow relative bg-no-repeat bg-center">
            <div className="flex flex-wrap h-[30%]">
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
                            iconSrc={app.iconSrc}
                            isFocused={focusApp === app.appName}
                            onClick={() => {
                                setFocusApp(app.appName);
                                setActiveApp(app.appName);
                            }}
                            title={app.title}
                        />
                    </motion.div>
                ))}
            </div>
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
                                    setFocusApp(app.appName);
                                }
                            }}
                        />
                    )
            )}
            <div className="fixed bottom-4 left-4 z-50">
                <GuidePopOver />
            </div>
        </div>
    );
}
