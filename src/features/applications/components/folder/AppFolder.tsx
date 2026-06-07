import getProjectApplicationDefinitions from "@/features/applications/lib/getProjectApplicationDefinitions";
import React from "react";
import { motion } from "framer-motion";
import { useDesktopStore } from "@/features/Desktop/store/useDesktopStore";
import { DesktopIcon } from "@/features/Desktop/components/DesktopIcon";
import "@/shared/styles/touchFolderLayout.css";
import { useRef } from "react";
import { useLanguageStore } from "@/shared/lib/i18n/useLanguageStore";

export default function AppFolder() {
    const focusApp = useDesktopStore((state) => state.focusApp);
    const isTouchDevice = useDesktopStore((state) => state.isTouchDevice);
    const setFocusApp = useDesktopStore((state) => state.setFocusApp);
    const setActiveApp = useDesktopStore((state) => state.setActiveApp);
    const language = useLanguageStore((state) => state.currentLanguage);

    const dragAreaRef = useRef<HTMLDivElement>(null);

    return (
        <div
            className="w-full h-full grow overflow-scroll text-black rounded-pen-lg relative"
            ref={dragAreaRef}
        >
            <div className="flex flex-wrap h-full">
                {getProjectApplicationDefinitions(language).map((app, i) => (
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
                                iconSrc={app.iconSrc}
                                isFocused={focusApp === app.appName}
                                onClick={() => {
                                    setFocusApp(app.appName);
                                    setActiveApp(app.appName);
                                }}
                                title={app.title}
                            />

                        ) : (
                            <DesktopIcon
                                iconSrc={app.iconSrc}
                                isFocused={focusApp === app.appName}
                                onClick={() => {
                                    setFocusApp(app.appName);
                                }}
                                onDoubleClick={() => {
                                    setFocusApp(app.appName);
                                    setActiveApp(app.appName);
                                }}
                                title={app.title}
                            />
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
