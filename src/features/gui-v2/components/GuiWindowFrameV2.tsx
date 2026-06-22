"use client";

import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { appCatalog } from "@/features/gui-v2/apps/appCatalog";
import {
    createOpenAppCommand,
    type GuiAppId,
} from "@/features/gui-v2/apps/appTypes";
import { GuiAppRenderer } from "@/features/gui-v2/components/GuiAppRenderer";
import { useGuiNavigation } from "@/features/gui-v2/navigation/GuiNavigationProvider";
import type { GuiWindowSnapshot } from "@/features/gui-v2/navigation/navigationTypes";
import { useGuiV2Store } from "@/features/gui-v2/store/GuiV2StoreProvider";
import { AppRuntimeBoundary } from "@/features/gui-v2/runtime/AppRuntimeContext";

/* ── macOS-style traffic-light SVG icons ────────────────── */

function MacCloseIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden="true"
            className={className}
        >
            <path
                d="M3.5 3.5l5 5M8.5 3.5l-5 5"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
            />
        </svg>
    );
}

function MacMinimizeIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden="true"
            className={className}
        >
            <path
                d="M2.5 6h7"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
            />
        </svg>
    );
}

function MacMaximizeIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden="true"
            className={className}
        >
            {/* Two opposing diagonal arrows */}
            <path
                d="M2 10L10 2M10 2H5.5M10 2V6.5M10 2L2 10M2 10H6.5M2 10V5.5"
                stroke="currentColor"
                strokeWidth="1.1"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function MacRestoreIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden="true"
            className={className}
        >
            {/* Two inward-pointing arrows (restore) */}
            <path
                d="M7.5 2v3h3M4.5 10V7h-3"
                stroke="currentColor"
                strokeWidth="1.1"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

/* ── Window frame component ─────────────────────────────── */

export function GuiWindowFrameV2({
    window: win,
    active,
    workspaceDesktop,
    index,
}: {
    window: GuiWindowSnapshot;
    active: boolean;
    workspaceDesktop: boolean;
    index: number;
}) {
    const language = useGuiV2Store((state) => state.language);
    const { navigate, navigationBusy } = useGuiNavigation();
    const appId: GuiAppId = win.appId;
    const title = appCatalog[appId].titles[language];
    const headingId = `gui-v2-window-${appId.replace(":", "-")}`;
    const windowVisibility = win.minimized
        ? "minimized"
        : active
          ? "active"
          : "inactive";

    /* ── Maximize state ─────────────────────────────────── */
    const [maximized, setMaximized] = useState(false);

    /* ── Minimize animation state ───────────────────────── */
    const [minimizing, setMinimizing] = useState(false);

    const handleMinimize = useCallback(() => {
        setMinimizing(true);
        // Let animation run, then dispatch actual minimize
        setTimeout(() => {
            setMinimizing(false);
            navigate({
                type: "minimize-window",
                windowId: appId,
            });
        }, 350);
    }, [appId, navigate]);

    /* ── Drag state (desktop ≥1024px only) ──────────────── */
    const sectionRef = useRef<HTMLElement>(null);
    const dragState = useRef<{
        startX: number;
        startY: number;
        origLeft: number;
        origTop: number;
    } | null>(null);
    const [pos, setPos] = useState<{ left: number; top: number } | null>(null);

    const defaultLeft = 64 + index * 44;
    const defaultTop = 68 + index * 36;
    const currentLeft = pos?.left ?? defaultLeft;
    const currentTop = pos?.top ?? defaultTop;

    const handlePointerDown = useCallback(
        (e: React.PointerEvent<HTMLDivElement>) => {
            // Only primary button, desktop viewport, not maximized
            if (e.button !== 0 || globalThis.innerWidth < 1024 || maximized)
                return;
            // Don't drag if clicking on a button
            if ((e.target as HTMLElement).closest("button")) return;

            if (!active) {
                navigate(createOpenAppCommand(appId));
            }

            const el = sectionRef.current;
            if (!el) return;

            dragState.current = {
                startX: e.clientX,
                startY: e.clientY,
                origLeft: currentLeft,
                origTop: currentTop,
            };

            el.setPointerCapture(e.pointerId);
        },
        [active, appId, currentLeft, currentTop, maximized, navigate],
    );

    const handlePointerMove = useCallback(
        (e: React.PointerEvent<HTMLElement>) => {
            if (!dragState.current) return;
            const dx = e.clientX - dragState.current.startX;
            const dy = e.clientY - dragState.current.startY;

            const maxLeft = globalThis.innerWidth - 200;
            const maxTop = globalThis.innerHeight - 100;
            setPos({
                left: Math.max(
                    0,
                    Math.min(maxLeft, dragState.current.origLeft + dx),
                ),
                top: Math.max(
                    36,
                    Math.min(maxTop, dragState.current.origTop + dy),
                ),
            });
        },
        [],
    );

    const handlePointerUp = useCallback(() => {
        dragState.current = null;
    }, []);

    const isHidden = win.minimized || workspaceDesktop;

    /* ── Compute style for normal vs maximized ──────────── */
    const windowStyle = maximized
        ? {
              left: "0px",
              top: "36px",
              width: "100vw",
              height: "calc(100dvh - 36px - 80px)",
              zIndex: active ? 40 : 10 + index,
              borderRadius: "0px",
          }
        : {
              left: `${currentLeft}px`,
              top: `${currentTop}px`,
              zIndex: active ? 40 : 10 + index,
          };

    return (
        <AnimatePresence>
            {!isHidden && (
                <motion.section
                    ref={sectionRef as React.Ref<HTMLElement>}
                    role="dialog"
                    aria-labelledby={headingId}
                    className={`gui-v2-window${maximized ? " gui-v2-window-maximized" : ""}`}
                    data-active={active}
                    data-window-id={appId}
                    data-window-visibility={windowVisibility}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onLostPointerCapture={handlePointerUp}
                    style={windowStyle}
                    // Minimize-to-dock animation
                    initial={false}
                    animate={
                        minimizing
                            ? {
                                  scale: 0.15,
                                  y: "80vh",
                                  opacity: 0,
                              }
                            : {
                                  scale: 1,
                                  y: 0,
                                  opacity: 1,
                              }
                    }
                    transition={{
                        duration: 0.35,
                        ease: [0.32, 0, 0.67, 0],
                    }}
                >
                    {/* ── macOS-style title bar ──────────── */}
                    <div
                        className="gui-v2-title-bar"
                        onPointerDown={handlePointerDown}
                    >
                        {/* Traffic lights (left side) */}
                        <div className="gui-v2-traffic-lights">
                            <button
                                type="button"
                                aria-label={`${title} close`}
                                disabled={navigationBusy}
                                onClick={() =>
                                    navigate({
                                        type: "close-window",
                                        windowId: appId,
                                    })
                                }
                                className="gui-v2-traffic-light gui-v2-traffic-close"
                            >
                                <MacCloseIcon className="gui-v2-traffic-icon" />
                            </button>
                            <button
                                type="button"
                                aria-label={`${title} minimize`}
                                disabled={navigationBusy || minimizing}
                                onClick={handleMinimize}
                                className="gui-v2-traffic-light gui-v2-traffic-minimize"
                            >
                                <MacMinimizeIcon className="gui-v2-traffic-icon" />
                            </button>
                            <button
                                type="button"
                                aria-label={
                                    maximized
                                        ? `${title} restore`
                                        : `${title} maximize`
                                }
                                onClick={() => setMaximized((v) => !v)}
                                className="gui-v2-traffic-light gui-v2-traffic-maximize"
                            >
                                {maximized ? (
                                    <MacRestoreIcon className="gui-v2-traffic-icon" />
                                ) : (
                                    <MacMaximizeIcon className="gui-v2-traffic-icon" />
                                )}
                            </button>
                        </div>

                        {/* Centered title */}
                        <h2
                            id={headingId}
                            tabIndex={-1}
                            className="gui-v2-title-text"
                        >
                            {title}
                        </h2>

                        {/* Spacer for grid balance */}
                        <div
                            className="gui-v2-title-spacer"
                            aria-hidden="true"
                        />
                    </div>

                    {/* ── Window content ─────────────────── */}
                    <div
                        className="gui-v2-window-content"
                        inert={!active ? true : undefined}
                    >
                        <AppRuntimeBoundary
                            windowVisibility={windowVisibility}
                        >
                            <GuiAppRenderer
                                appId={appId}
                                language={language}
                            />
                        </AppRuntimeBoundary>
                    </div>
                </motion.section>
            )}
        </AnimatePresence>
    );
}
