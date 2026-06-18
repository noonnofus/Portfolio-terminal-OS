"use client";

import React, { useMemo, useRef, useState } from "react";
import getRootApplicationDefinitions from "@/features/applications/lib/getRootApplicationDefinitions";
import getProjectApplicationDefinitions from "@/features/applications/lib/getProjectApplicationDefinitions";
import { DesktopIcon } from "./DesktopIcon";
import GuidePopOver from "./GuidePopOver";
import { DesktopAppWindow } from "./DesktopAppWindow";
import { useDesktopStore } from "@/features/Desktop/store/useDesktopStore";
import { useLanguageStore } from "@/shared/lib/i18n/useLanguageStore";

export default function DesktopMainTouchArea() {
    type Position = { left: number; top: number };
    const openApps = useDesktopStore((state) => state.openApps);
    const focusApp = useDesktopStore((state) => state.focusApp);
    const setFocusApp = useDesktopStore((state) => state.setFocusApp);
    const setActiveApp = useDesktopStore((state) => state.setActiveApp);
    const desktopIconPositions = useDesktopStore((state) => state.desktopIconPositions);
    const setDesktopIconPosition = useDesktopStore((state) => state.setDesktopIconPosition);
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

    const getDefaultDesktopIconPosition = (index: number): Position => ({
        left: 5 + index * 80,
        top: 0,
    });

    const handleDesktopIconDragEnd = (
        appName: string,
        currentPosition: Position,
        info: { offset: { x: number; y: number } }
    ) => {
        setDesktopIconPosition(appName, {
            left: Math.round(currentPosition.left + info.offset.x),
            top: Math.round(currentPosition.top + info.offset.y),
        });
    };

    return (
        <div ref={desktopAreaRef} className="grow relative bg-no-repeat bg-center">
            {getRootApplicationDefinitions(language).map((app, index) => {
                const iconPosition =
                    desktopIconPositions[app.appName] ??
                    getDefaultDesktopIconPosition(index);

                return (
                <div
                    key={`icon-${app.appName}-${iconPosition.left}-${iconPosition.top}`}
                    style={{
                        position: "absolute",
                        left: iconPosition.left,
                        top: iconPosition.top,
                    }}
                >
                    <DesktopIcon
                        dragConstraintRef={desktopAreaRef}
                        iconSrc={app.iconSrc}
                        isFocused={focusApp === app.appName}
                        onDragEnd={(info) =>
                            handleDesktopIconDragEnd(app.appName, iconPosition, info)
                        }
                        onClick={() => {
                            setFocusApp(app.appName);
                            setActiveApp(app.appName);
                        }}
                        title={app.title}
                    />
                </div>
            )})}
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
