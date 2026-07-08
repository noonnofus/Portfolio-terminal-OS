"use client";

import { useEffect, useState } from "react";
import { createOpenAppCommand } from "@/features/gui/registry/appTypes";
import { useGuiNavigation } from "@/features/gui/navigation/GuiNavigationProvider";
import { useGuiStore } from "@/features/gui/store/GuiStoreProvider";

/* ── Icons (dineshd.dev style — Lucide-like stroked SVGs) ─── */

function WifiIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="gui-system-icon"
        >
            <path d="M12 20h.01" />
            <path d="M2 8.82a15 15 0 0 1 20 0" />
            <path d="M5 12.859a10 10 0 0 1 14 0" />
            <path d="M8.5 16.429a5 5 0 0 1 7 0" />
        </svg>
    );
}

function BatteryIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="gui-system-icon gui-system-icon-battery"
        >
            <rect x="2" y="7" width="16" height="10" rx="2" />
            <path d="M22 11v2" />
            {/* Fill bar */}
            <rect
                x="4"
                y="9"
                width="12"
                height="6"
                rx="1"
                fill="currentColor"
                stroke="none"
                opacity="0.35"
            />
        </svg>
    );
}

/* ── Clock (dineshd.dev style — compact monospace HH:MM) ──── */

function SystemClock() {
    const [time, setTime] = useState<string>("--:--");

    useEffect(() => {
        function tick() {
            const now = new Date();
            const h = now.getHours().toString().padStart(2, "0");
            const m = now.getMinutes().toString().padStart(2, "0");
            setTime(`${h}:${m}`);
        }
        tick();
        const id = setInterval(tick, 10_000);
        return () => clearInterval(id);
    }, []);

    return (
        <time
            className="gui-system-clock"
            aria-label="Current time"
        >
            {time}
        </time>
    );
}

/* ── System bar ───────────────────────────────────────────── */

export function GuiSystemBar() {
    const windows = useGuiStore((state) => state.windows);
    const focus = useGuiStore((state) => state.focus);
    const viewer = useGuiStore((state) => state.viewer);
    const { navigate } = useGuiNavigation();
    const viewerName =
        viewer.status === "authenticated" ? viewer.displayName : "Guest";

    useEffect(() => {
        const handleWindowCycle = (event: KeyboardEvent) => {
            if (!event.ctrlKey || event.key !== "F6") {
                return;
            }

            const candidates = windows
                .filter((window) => !window.minimized)
                .toSorted(
                    (left, right) =>
                        right.activationOrder - left.activationOrder,
                );

            if (candidates.length === 0) {
                return;
            }

            event.preventDefault();
            const currentIndex = candidates.findIndex(
                (window) =>
                    focus.mode === "windows" &&
                    window.windowId === focus.activeWindowId,
            );
            const direction = event.shiftKey ? -1 : 1;
            const nextIndex =
                currentIndex === -1
                    ? 0
                    : (currentIndex + direction + candidates.length) %
                      candidates.length;
            navigate(createOpenAppCommand(candidates[nextIndex].appId));
        };

        globalThis.addEventListener("keydown", handleWindowCycle);
        return () =>
            globalThis.removeEventListener(
                "keydown",
                handleWindowCycle,
            );
    }, [focus, navigate, windows]);

    return (
        <header className="gui-system-bar">
            <div className="gui-system-identity">
                <span className="gui-viewer-name">{viewerName}</span>
            </div>

            <strong className="gui-system-title">
                Hyunho&apos;s Portfolio
            </strong>

            <nav
                aria-label="System controls"
                className="gui-system-controls"
            >


                <div
                    className="gui-system-divider"
                    aria-hidden="true"
                />

                {/* dineshd.dev style: status icons + clock */}
                <output
                    className="gui-system-status"
                    aria-label="Wifi connected"
                >
                    <WifiIcon />
                </output>

                <output
                    className="gui-system-status"
                    aria-label="Battery full"
                >
                    <BatteryIcon />
                </output>

                <SystemClock />
            </nav>
        </header>
    );
}
