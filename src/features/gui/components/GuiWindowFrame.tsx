"use client";

import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import {
    motion,
    AnimatePresence,
    useReducedMotion,
} from "framer-motion";
import { appCatalog } from "@/features/gui-v2/apps/appCatalog";
import {
    createOpenAppCommand,
    type GuiAppId,
} from "@/features/gui-v2/apps/appTypes";
import { GuiAppRenderer } from "@/features/gui-v2/components/GuiAppRenderer";
import { WindowErrorBoundary } from "@/features/gui-v2/components/WindowErrorBoundary";
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
    clampEpoch,
}: {
    window: GuiWindowSnapshot;
    active: boolean;
    workspaceDesktop: boolean;
    index: number;
    clampEpoch: number;
}) {
    const language = useGuiV2Store((state) => state.language);
    const { navigate, navigationBusy } = useGuiNavigation();
    const shouldReduceMotion = useReducedMotion();
    const appId: GuiAppId = win.appId;
    const app = appCatalog[appId];
    const title = app.titles[language];
    const headingId = `gui-v2-window-${appId.replace(":", "-")}`;
    const windowVisibility = win.minimized
        ? "minimized"
        : active
          ? "active"
          : "inactive";

    /* ── Maximize state ─────────────────────────────────── */
    const [maximized, setMaximized] = useState(false);

    const handleMinimize = useCallback(() => {
        navigate({
            type: "minimize-window",
            windowId: appId,
        });
    }, [appId, navigate]);

    /* ── Drag state (desktop ≥1024px only) ──────────────── */
    const sectionRef = useRef<HTMLElement>(null);
    const headingRef = useRef<HTMLHeadingElement>(null);
    const wasActiveRef = useRef(false);
    const dragState = useRef<{
        startX: number;
        startY: number;
        origLeft: number;
        origTop: number;
    } | null>(null);
    const [pos, setPos] = useState<{ left: number; top: number } | null>(null);

    const defaultLeft = 64 + index * 44;
    const defaultTop = 32 + index * 36;
    const currentLeft = pos?.left ?? defaultLeft;
    const currentTop = pos?.top ?? defaultTop;

    const handlePointerDown = useCallback(
        (e: React.PointerEvent<HTMLDivElement>) => {
            // Only primary button, desktop viewport, not maximized
            if (e.button !== 0 || globalThis.innerWidth < 768 || maximized)
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
            const maxTop = globalThis.innerHeight - 116;
            setPos({
                left: Math.max(
                    0,
                    Math.min(maxLeft, dragState.current.origLeft + dx),
                ),
                top: Math.max(
                    0,
                    Math.min(maxTop, dragState.current.origTop + dy),
                ),
            });
        },
        [],
    );

    const handlePointerUp = useCallback(() => {
        dragState.current = null;
    }, []);


    useEffect(() => {
        if (active && !wasActiveRef.current) {
            requestAnimationFrame(() => headingRef.current?.focus());
        }
        wasActiveRef.current = active;
    }, [active]);

    useEffect(() => {
        if (globalThis.innerWidth < 768 || maximized) {
            return;
        }

        const element = sectionRef.current;
        if (element === null) {
            return;
        }

        const rect = element.getBoundingClientRect();
        const maxLeft = Math.max(0, globalThis.innerWidth - rect.width);
        const maxTop = Math.max(
            0,
            globalThis.innerHeight - 116 - rect.height,
        );

        setPos((current) => {
            const nextLeft = Math.min(
                maxLeft,
                Math.max(0, current?.left ?? defaultLeft),
            );
            const nextTop = Math.min(
                maxTop,
                Math.max(0, current?.top ?? defaultTop),
            );

            if (
                current?.left === nextLeft &&
                current.top === nextTop
            ) {
                return current;
            }

            return { left: nextLeft, top: nextTop };
        });
    }, [
        active,
        clampEpoch,
        defaultLeft,
        defaultTop,
        maximized,
    ]);

    const isHidden = win.minimized || workspaceDesktop;

    /* ── Compute style for normal vs maximized ──────────── */
    const windowStyle = maximized
        ? {
              left: "0px",
              top: "36px",
              width: "100vw",
              height: "calc(100dvh - 36px)",
              zIndex: active ? 80 : 40 + index,
              borderRadius: "0px",
          }
        : {
              left: `${currentLeft}px`,
              top: `${currentTop}px`,
              width: `${app.window.width}px`,
              height: `${app.window.height}px`,
              maxWidth: "calc(100vw - 48px)",
              maxHeight: "calc(100dvh - 116px)",
              zIndex: active ? 80 : 40 + index,
          };

    // Calculate dynamic minimize transition offsets to the specific Dock icon
    const dockAppIds = [
        "about",
        "projects",
        "resume",
        "terminal",
        "contact",
        "settings",
    ];
    const dockIndex = dockAppIds.indexOf(appId);
    const screenWidth =
        typeof window !== "undefined" ? window.innerWidth : 1024;
    const screenHeight =
        typeof window !== "undefined" ? window.innerHeight : 768;
    const targetX =
        screenWidth / 2 +
        (dockIndex !== -1 ? dockIndex - 2.5 : 0) * 54;
    const windowWidth = maximized
        ? screenWidth
        : Math.min(app.window.width, screenWidth - 48);
    const windowHeight = maximized
        ? screenHeight - 36
        : Math.min(app.window.height, screenHeight - 116);
    const minimizeX = shouldReduceMotion
        ? 0
        : targetX - (currentLeft + windowWidth / 2);
    const minimizeY = shouldReduceMotion
        ? 0
        : screenHeight - 34 - (currentTop + windowHeight / 2);

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
                    data-app-type={appId.startsWith("project:") ? "project" : appId}
                    data-window-visibility={windowVisibility}
                    onPointerDownCapture={(event) => {
                        if (event.button === 0 && !active && !navigationBusy) {
                            navigate(createOpenAppCommand(appId));
                        }
                    }}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onLostPointerCapture={handlePointerUp}
                    style={windowStyle}
                    initial={false}
                    animate={{
                        scale: 1,
                        x: 0,
                        y: 0,
                        opacity: 1,
                    }}
                    exit={{
                        scale: shouldReduceMotion ? 1 : 0.15,
                        x: minimizeX,
                        y: minimizeY,
                        opacity: 0,
                    }}
                    transition={{
                        duration: shouldReduceMotion ? 0 : 0.38,
                        ease: [0.16, 1, 0.3, 1], // easeOutExpo for ultra smooth experience
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
                                disabled={navigationBusy}
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
                            ref={headingRef}
                            id={headingId}
                            tabIndex={-1}
                            className="gui-v2-title-text"
                        >
                            {title}
                        </h2>

                        <div className="gui-v2-title-spacer" aria-hidden="true" />
                    </div>

                    {/* ── Window content ─────────────────── */}
                    <div
                        className="gui-v2-window-content"
                        inert={!active ? true : undefined}
                    >
                        <AppRuntimeBoundary
                            windowVisibility={windowVisibility}
                        >
                            <WindowErrorBoundary appId={appId}>
                                <GuiAppRenderer
                                    appId={appId}
                                    language={language}
                                />
                            </WindowErrorBoundary>
                        </AppRuntimeBoundary>
                    </div>
                </motion.section>
            )}
        </AnimatePresence>
    );
}
