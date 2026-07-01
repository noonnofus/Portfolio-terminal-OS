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
import { appCatalog } from "@/features/gui/registry/appCatalog";
import {
    createOpenAppCommand,
    type GuiAppId,
} from "@/features/gui/registry/appTypes";
import { GuiAppRenderer } from "@/features/gui/components/GuiAppRenderer";
import { WindowErrorBoundary } from "@/features/gui/components/WindowErrorBoundary";
import { useGuiNavigation } from "@/features/gui/navigation/GuiNavigationProvider";
import type { GuiWindowSnapshot } from "@/features/gui/navigation/navigationTypes";
import { useGuiStore } from "@/features/gui/store/GuiStoreProvider";
import { AppRuntimeBoundary } from "@/features/gui/runtime/AppRuntimeContext";

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

/**
 * Total vertical chrome reservation in pixels.
 * window-layer CSS already offsets the top by SYSTEM_BAR_HEIGHT (36 px),
 * but JS clamps use globalThis.innerHeight so we subtract
 * SYSTEM_BAR_HEIGHT + a small bottom margin (8 px) here.
 * Windows may slide behind the floating Dock (z-index 100),
 * matching macOS behaviour.
 */
const WINDOW_CHROME_RESERVE_PX = 44; // 36 (system bar) + 8 (bottom padding)

/* ── Window frame component ─────────────────────────────── */

export function GuiWindowFrame({
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
    const language = useGuiStore((state) => state.language);
    const { navigate, navigationBusy } = useGuiNavigation();
    const shouldReduceMotion = useReducedMotion();
    const appId: GuiAppId = win.appId;
    const app = appCatalog[appId];
    const title = app.titles[language];
    const headingId = `gui-window-${appId.replace(":", "-")}`;
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
            const usesTouchWindowLayout = globalThis.matchMedia(
                "(pointer: coarse)",
            ).matches;
            if (e.button !== 0 || usesTouchWindowLayout || maximized) return;
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

            const element = sectionRef.current;
            if (element === null) return;

            const rect = element.getBoundingClientRect();
            const maxLeft = Math.max(
                0,
                globalThis.innerWidth - rect.width,
            );
            const maxTop = Math.max(
                0,
                globalThis.innerHeight - WINDOW_CHROME_RESERVE_PX - rect.height,
            );
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
        const usesTouchWindowLayout = globalThis.matchMedia(
            "(pointer: coarse)",
        ).matches;
        if (usesTouchWindowLayout || maximized) {
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
            globalThis.innerHeight - WINDOW_CHROME_RESERVE_PX - rect.height,
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
              maxHeight: `calc(100dvh - ${WINDOW_CHROME_RESERVE_PX}px)`,
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
        : Math.min(app.window.height, screenHeight - WINDOW_CHROME_RESERVE_PX);
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
                    className={`gui-window${maximized ? " gui-window-maximized" : ""}`}
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
                        className="gui-title-bar"
                        onPointerDown={handlePointerDown}
                    >
                        {/* Traffic lights (left side) */}
                        <div className="gui-traffic-lights">
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
                                className="gui-traffic-light gui-traffic-close"
                            >
                                <MacCloseIcon className="gui-traffic-icon" />
                            </button>
                            <button
                                type="button"
                                aria-label={`${title} minimize`}
                                disabled={navigationBusy}
                                onClick={handleMinimize}
                                className="gui-traffic-light gui-traffic-minimize"
                            >
                                <MacMinimizeIcon className="gui-traffic-icon" />
                            </button>
                            <button
                                type="button"
                                aria-label={
                                    maximized
                                        ? `${title} restore`
                                        : `${title} maximize`
                                }
                                onClick={() => setMaximized((v) => !v)}
                                className="gui-traffic-light gui-traffic-maximize"
                            >
                                {maximized ? (
                                    <MacRestoreIcon className="gui-traffic-icon" />
                                ) : (
                                    <MacMaximizeIcon className="gui-traffic-icon" />
                                )}
                            </button>
                        </div>

                        {/* Centered title */}
                        <h2
                            ref={headingRef}
                            id={headingId}
                            tabIndex={-1}
                            className="gui-title-text"
                        >
                            {title}
                        </h2>

                        <div className="gui-title-spacer" aria-hidden="true" />
                    </div>

                    {/* ── Window content ─────────────────── */}
                    <div
                        className="gui-window-content"
                        inert={!active ? true : undefined}
                    >
                        <AppRuntimeBoundary
                            windowVisibility={windowVisibility}
                        >
                            <WindowErrorBoundary appId={appId}>
                                <GuiAppRenderer
                                    windowId={win.windowId}
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
