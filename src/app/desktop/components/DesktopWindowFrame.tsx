"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion, type Variants } from "framer-motion";
import { appCatalog } from "@/app/desktop/config/appCatalog";
import {
    createOpenAppCommand,
    type DesktopAppId,
} from "@/app/desktop/types/appTypes";
import { DesktopAppRenderer } from "@/app/desktop/components/DesktopAppRenderer";
import { WindowErrorBoundary } from "@/app/desktop/components/WindowErrorBoundary";
import { useDesktopNavigation } from "@/app/desktop/hooks/useDesktopNavigation";
import type { DesktopWindowSnapshot } from "@/app/desktop/types/navigationTypes";
import { useDesktopLanguage } from "@/app/desktop/store/DesktopStoreProvider";
import { AppRuntimeBoundary } from "@/app/desktop/components/AppRuntimeBoundary";
import { getAppTitle } from "@/app/desktop/lib/getAppTitle";
import { useTranslation } from "react-i18next";
import { useDesktopStore } from "@/app/desktop/store/DesktopStoreProvider";

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
const DESKTOP_SYSTEM_BAR_HEIGHT_PX = 36;
const DESKTOP_WINDOW_MAX_WIDTH_OFFSET_PX = 48;
const DESKTOP_WINDOW_CHROME_RESERVE_PX = 44; // 36 (system bar) + 8 (bottom padding)

type DockTarget = { x: number; y: number; scale: number };
const MINIMIZE_DURATION = 0.34;
const RESTORE_DURATION = 0.32;

/* ── Window frame component ─────────────────────────────── */

export function DesktopWindowFrame({
    window: win,
    active,
    workspaceDesktop,
    index,
    clampEpoch,
}: {
    window: DesktopWindowSnapshot;
    active: boolean;
    workspaceDesktop: boolean;
    index: number;
    clampEpoch: number;
}) {
    const language = useDesktopLanguage();
    const { t } = useTranslation("appShell", { lng: language });
    const { navigate, navigationBusy } = useDesktopNavigation();
    const shouldReduceMotion = useReducedMotion();
    const appId: DesktopAppId = win.appId;
    const app = appCatalog[appId];
    const title = getAppTitle(app, t);
    const headingId = `desktop-window-${appId.replace(":", "-")}`;
    const windowVisibility = win.minimized
        ? "minimized"
        : active
          ? "active"
          : "inactive";

    /* ── Maximize state ─────────────────────────────────── */
    const maximized = useDesktopStore((state) => state.fullscreenWindowId === win.windowId);
    const setFullscreenWindow = useDesktopStore((state) => state.setFullscreenWindow);

    const [dockTarget, setDockTarget] = useState<DockTarget | null>(null);

    const handleMinimize = () => {
        const dockAppId = app.url.app === "project" ? "projects" : appId;
        const icon = document.querySelector<HTMLElement>(`[data-dock-app-id="${dockAppId}"] .application-app-icon`);
        const dock = icon?.closest<HTMLElement>(".application-dock");
        const rect = sectionRef.current?.getBoundingClientRect();
        if (!shouldReduceMotion && icon && dock && rect) {
            const target = icon.getBoundingClientRect();
            // Measure the resting Dock position, including fullscreen and auto-hide.
            const targetY = globalThis.innerHeight - parseFloat(getComputedStyle(dock).bottom)
                - dock.offsetHeight + target.top - dock.getBoundingClientRect().top + target.height / 2;
            setDockTarget({
                x: target.left + target.width / 2 - rect.left - rect.width / 2,
                y: targetY - rect.top - rect.height / 2,
                scale: Math.min(icon.offsetWidth / rect.width, icon.offsetHeight / rect.height),
            });
        }
        navigate({
            type: "minimize-window",
            windowId: appId,
        });
    };

    /* ── Drag state (desktop ≥1024px only) ──────────────── */
    const sectionRef = useRef<HTMLElement>(null);
    const headingRef = useRef<HTMLHeadingElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
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
    const initialWidth = `max(var(--application-window-min-width), min(${app.window.width}px, calc(100vw - ${DESKTOP_WINDOW_MAX_WIDTH_OFFSET_PX}px)))`;
    const initialHeight = `min(${app.window.height}px, calc(100dvh - ${DESKTOP_WINDOW_CHROME_RESERVE_PX}px))`;
    const initialLeft = `clamp(0px, ${defaultLeft}px, calc(100vw - ${initialWidth}))`;
    const initialTop = `clamp(0px, ${defaultTop}px, calc(100dvh - ${DESKTOP_WINDOW_CHROME_RESERVE_PX}px - ${initialHeight}))`;

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        // Only primary button, desktop viewport, not maximized
        const usesTouchWindowLayout =
            globalThis.matchMedia("(pointer: coarse)").matches;
        if (e.button !== 0 || usesTouchWindowLayout || maximized) return;
        // Don't drag if clicking on a button
        if ((e.target as HTMLElement).closest("button")) return;

        if (!active) {
            navigate(createOpenAppCommand(appId));
        }

        const el = sectionRef.current;
        if (!el) return;

        const computedStyle = getComputedStyle(el);
        dragState.current = {
            startX: e.clientX,
            startY: e.clientY,
            origLeft: Number.parseFloat(computedStyle.left),
            origTop: Number.parseFloat(computedStyle.top),
        };

        el.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
        if (!dragState.current) return;
        const dx = e.clientX - dragState.current.startX;
        const dy = e.clientY - dragState.current.startY;

        const element = sectionRef.current;
        if (element === null) return;

        const rect = element.getBoundingClientRect();
        const maxLeft = Math.max(0, globalThis.innerWidth - rect.width);
        const maxTop = Math.max(
            0,
            globalThis.innerHeight -
                DESKTOP_WINDOW_CHROME_RESERVE_PX -
                rect.height,
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
    };

    const handlePointerUp = () => {
        dragState.current = null;
    };

    useEffect(() => {
        if (active && !wasActiveRef.current) {
            requestAnimationFrame(() => {
                const section = sectionRef.current;
                if (section?.dataset.active !== "true" || section.contains(document.activeElement)) return;
                (maximized ? contentRef.current : headingRef.current)?.focus({ preventScroll: true });
            });
        }
        wasActiveRef.current = active;
    }, [active, maximized]);

    useEffect(() => {
        const usesTouchWindowLayout =
            globalThis.matchMedia("(pointer: coarse)").matches;
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
            globalThis.innerHeight - DESKTOP_WINDOW_CHROME_RESERVE_PX - rect.height,
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

            if (current?.left === nextLeft && current.top === nextTop) {
                return current;
            }

            return { left: nextLeft, top: nextTop };
        });
    }, [active, clampEpoch, defaultLeft, defaultTop, maximized]);

    const isHidden = win.minimized || workspaceDesktop;

    /* ── Compute style for normal vs maximized ──────────── */
    const windowStyle = maximized
        ? {
              left: "0px",
              top: `${DESKTOP_SYSTEM_BAR_HEIGHT_PX}px`,
              width: "100vw",
              height: `calc(100dvh - ${DESKTOP_SYSTEM_BAR_HEIGHT_PX}px)`,
              zIndex: active ? 80 : 40 + index,
          }
        : {
              left: pos === null ? initialLeft : `${pos.left}px`,
              top: pos === null ? initialTop : `${pos.top}px`,
              width: `${app.window.width}px`,
              height: `${app.window.height}px`,
              maxWidth: `calc(100vw - ${DESKTOP_WINDOW_MAX_WIDTH_OFFSET_PX}px)`,
              maxHeight: `calc(100dvh - ${DESKTOP_WINDOW_CHROME_RESERVE_PX}px)`,
              zIndex: active ? 80 : 40 + index,
          };

    const variants: Variants = {
        docked: (target: DockTarget) => ({ ...target, opacity: 0 }),
        open: {
            x: 0, y: 0, scale: 1, opacity: 1,
            transition: {
                duration: shouldReduceMotion ? 0 : RESTORE_DURATION,
                ease: [0.22, 0.75, 0.25, 1],
                opacity: { duration: shouldReduceMotion ? 0 : 0.08 },
            },
        },
        hidden: (target: DockTarget | null) => target && !shouldReduceMotion ? {
            ...target, opacity: 0,
            transition: {
                duration: MINIMIZE_DURATION,
                ease: [0.36, 0, 0.64, 1],
                opacity: { delay: MINIMIZE_DURATION - 0.04, duration: 0.04, ease: "linear" },
            },
        } : { opacity: 0, transition: { duration: shouldReduceMotion ? 0 : 0.12 } },
    };

    return (
        <AnimatePresence custom={win.minimized ? dockTarget : null}>
            {!isHidden && (
                <motion.section
                    ref={sectionRef as React.Ref<HTMLElement>}
                    role="dialog"
                    aria-labelledby={headingId}
                    className={`application-window${maximized ? " application-window-maximized" : ""}`}
                    data-active={active}
                    data-window-id={appId}
                    data-app-type={
                        appId.startsWith("project:") ? "project" : appId
                    }
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
                    layout={!shouldReduceMotion}
                    layoutDependency={maximized}
                    custom={dockTarget}
                    variants={variants}
                    initial={dockTarget && !shouldReduceMotion ? "docked" : false}
                    animate="open"
                    exit="hidden"
                    onAnimationStart={(definition) => {
                        sectionRef.current?.toggleAttribute("inert", definition === "hidden");
                    }}
                    onAnimationComplete={(definition) => {
                        if (definition === "open") setDockTarget(null);
                    }}
                    transition={{
                        duration: shouldReduceMotion ? 0 : 0.38,
                        ease: [0.16, 1, 0.3, 1], // easeOutExpo for ultra smooth experience
                    }}
                >
                    {maximized && (
                        <div aria-hidden="true" className="application-title-bar-trigger" />
                    )}
                    {/* ── macOS-style title bar ──────────── */}
                    <div
                        className="application-title-bar"
                        onPointerDown={handlePointerDown}
                    >
                        {/* Traffic lights (left side) */}
                        <div
                            className="application-traffic-lights"
                            inert={!active ? true : undefined}
                        >
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
                                className="application-traffic-light application-traffic-close"
                            >
                                <MacCloseIcon className="application-traffic-icon" />
                            </button>
                            <button
                                type="button"
                                aria-label={`${title} minimize`}
                                disabled={navigationBusy}
                                onClick={handleMinimize}
                                className="application-traffic-light application-traffic-minimize"
                            >
                                <MacMinimizeIcon className="application-traffic-icon" />
                            </button>
                            <button
                                type="button"
                                aria-label={
                                    maximized
                                        ? `${title} restore`
                                        : `${title} maximize`
                                }
                                onClick={() => {
                                    setFullscreenWindow(maximized ? null : win.windowId);
                                    // Keep pointer activation from pinning the overlay open via focus-within.
                                    contentRef.current?.focus({ preventScroll: true });
                                }}
                                className="application-traffic-light application-traffic-maximize"
                            >
                                {maximized ? (
                                    <MacRestoreIcon className="application-traffic-icon" />
                                ) : (
                                    <MacMaximizeIcon className="application-traffic-icon" />
                                )}
                            </button>
                        </div>

                        {/* Centered title */}
                        <h2
                            ref={headingRef}
                            id={headingId}
                            tabIndex={-1}
                            className="application-title-text"
                        >
                            {title}
                        </h2>

                        <div className="application-title-spacer" aria-hidden="true" />
                    </div>

                    {/* ── Window content ─────────────────── */}
                    <div
                        ref={contentRef}
                        tabIndex={-1}
                        className="application-window-content"
                        inert={!active ? true : undefined}
                    >
                        <AppRuntimeBoundary windowVisibility={windowVisibility}>
                            <WindowErrorBoundary appId={appId}>
                                <DesktopAppRenderer
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
