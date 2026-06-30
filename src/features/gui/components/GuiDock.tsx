"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { appCatalog } from "@/features/gui/registry/appCatalog";
import {
    createOpenAppCommand,
    type GuiAppId,
} from "@/features/gui/registry/appTypes";
import { useGuiNavigation } from "@/features/gui/navigation/GuiNavigationProvider";
import { useGuiStore } from "@/features/gui/store/GuiStoreProvider";
import { GuiAppIcon } from "@/features/gui/components/GuiAppIcon";

const dockAppIds = [
    "about",
    "projects",
    "resume",
    "terminal",
    "contact",
    "settings",
] as const satisfies readonly GuiAppId[];

export function GuiDock() {
    const language = useGuiStore((state) => state.language);
    const activeWindowId = useGuiStore((state) =>
        state.focus.mode === "windows" ? state.focus.activeWindowId : null,
    );
    const windows = useGuiStore((state) => state.windows);
    const dockAutoHide = useGuiStore((state) => state.dockAutoHide);
    const { navigate, navigationBusy } = useGuiNavigation();

    // Hover state for tooltips
    const [hoveredAppId, setHoveredAppId] = useState<GuiAppId | null>(null);

    // Bounce state for clicks
    const [bouncingAppId, setBouncingAppId] = useState<GuiAppId | null>(null);

    const handleButtonClick = (appId: GuiAppId) => {
        setBouncingAppId(appId);
        // Trigger navigation
        navigate(createOpenAppCommand(appId));
    };

    return (
        <nav
            aria-label="Applications"
            className="gui-dock"
            data-auto-hide={dockAutoHide}
        >
            {dockAppIds.map((appId) => {
                const app = appCatalog[appId];
                const isOpen = windows.some((w) => w.appId === appId);
                const isActive = activeWindowId === appId;

                return (
                    <div
                        key={appId}
                        className="relative flex flex-col items-center"
                        onMouseEnter={() => setHoveredAppId(appId)}
                        onMouseLeave={() => setHoveredAppId(null)}
                    >
                        {/* ── Tooltip ── */}
                        <AnimatePresence>
                            {hoveredAppId === appId && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 8, scale: 0.9 }}
                                    transition={{ duration: 0.15, ease: "easeOut" }}
                                    className="absolute -top-12 px-3 py-1 bg-slate-900/90 dark:bg-slate-800/90 text-white text-[11px] font-semibold rounded-lg shadow-md border border-slate-700/30 whitespace-nowrap backdrop-blur-md z-[110]"
                                >
                                    {app.titles[language]}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* ── Dock Button ── */}
                        <motion.button
                            type="button"
                            disabled={navigationBusy}
                            aria-label={app.titles[language]}
                            aria-pressed={isActive}
                            onClick={() => handleButtonClick(appId)}
                            className="dock-app relative"
                            // macOS-style hover scale + float lift effect
                            whileHover={{
                                scale: 1.2,
                                y: -6,
                                transition: { type: "spring", stiffness: 400, damping: 18 }
                            }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {/* Click bounce animation wrapper */}
                            <motion.div
                                animate={
                                    bouncingAppId === appId
                                        ? {
                                              y: [0, -14, 0, -7, 0],
                                          }
                                        : { y: 0 }
                                }
                                transition={{
                                    duration: 0.5,
                                    times: [0, 0.35, 0.6, 0.8, 1],
                                    ease: "easeInOut",
                                }}
                                onAnimationComplete={() => {
                                    if (bouncingAppId === appId) {
                                        setBouncingAppId(null);
                                    }
                                }}
                                className="flex items-center justify-center w-full h-full"
                            >
                                <GuiAppIcon appId={appId} />
                            </motion.div>

                            <span className="sr-only">
                                {app.titles[language]}
                            </span>

                            {/* ── Running / Open Indicator Dot ── */}
                            {isOpen && (
                                <span className="absolute bottom-[2px] left-1/2 -translate-x-1/2 w-[4px] h-[4px] rounded-full bg-slate-700 dark:bg-slate-300 transition-colors duration-200" />
                            )}
                        </motion.button>
                    </div>
                );
            })}
        </nav>
    );
}
