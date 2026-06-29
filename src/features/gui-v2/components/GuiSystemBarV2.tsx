"use client";

import { useEffect, useState } from "react";
import { PanelsTopLeft, X } from "lucide-react";
import { createOpenAppCommand } from "@/features/gui-v2/apps/appTypes";
import { useGuiNavigation } from "@/features/gui-v2/navigation/GuiNavigationProvider";
import { useGuiV2Store } from "@/features/gui-v2/store/GuiV2StoreProvider";

export type GuiViewer =
    | { kind: "guest" }
    | { kind: "authenticated"; displayName: string };

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
            className="gui-v2-system-icon"
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
            className="gui-v2-system-icon gui-v2-system-icon-battery"
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
            className="gui-v2-system-clock"
            aria-label="Current time"
        >
            {time}
        </time>
    );
}

/* ── System bar ───────────────────────────────────────────── */

export function GuiSystemBarV2({
    viewer,
}: {
    viewer: GuiViewer;
}) {
    const language = useGuiV2Store((state) => state.language);
    const windows = useGuiV2Store((state) => state.windows);
    const focus = useGuiV2Store((state) => state.focus);
    const { navigate, navigationBusy } = useGuiNavigation();
    const viewerName =
        viewer.kind === "authenticated"
            ? viewer.displayName
            : language === "ko"
              ? "게스트"
              : "Guest";

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
        <header className="gui-v2-system-bar">
            <div className="gui-v2-system-identity">
                <span className="gui-v2-viewer-chip">
                    <span className="gui-v2-viewer-avatar" aria-hidden="true">
                        {viewerName.slice(0, 1).toUpperCase()}
                    </span>
                    <span>{viewerName}</span>
                </span>
            </div>

            <strong className="gui-v2-system-title">
                Hyunho&apos;s Portfolio
            </strong>

            <nav
                aria-label="System controls"
                className="gui-v2-system-controls"
            >
                {(["ko", "en"] as const).map((option) => (
                    <button
                        key={option}
                        type="button"
                        aria-pressed={language === option}
                        disabled={navigationBusy}
                        onClick={() =>
                            navigate({
                                type: "change-language",
                                language: option,
                            })
                        }
                        className="gui-v2-lang-button"
                    >
                        {option}
                    </button>
                ))}


                <button
                    type="button"
                    aria-label="Show desktop"
                    disabled={navigationBusy}
                    onClick={() => navigate({ type: "show-desktop" })}
                    className="gui-v2-system-action"
                >
                    <PanelsTopLeft aria-hidden="true" />
                </button>

                <button
                    type="button"
                    aria-label="Close active window"
                    disabled={
                        navigationBusy || focus.mode !== "windows"
                    }
                    onClick={() => {
                        if (focus.mode === "windows") {
                            navigate({
                                type: "close-window",
                                windowId: focus.activeWindowId,
                            });
                        }
                    }}
                    className="gui-v2-system-action"
                >
                    <X aria-hidden="true" />
                </button>

                <div
                    className="gui-v2-system-divider"
                    aria-hidden="true"
                />

                {/* dineshd.dev style: status icons + clock */}
                <output
                    className="gui-v2-system-status"
                    aria-label="Wifi connected"
                >
                    <WifiIcon />
                </output>

                <output
                    className="gui-v2-system-status"
                    aria-label="Battery full"
                >
                    <BatteryIcon />
                </output>

                <SystemClock />
            </nav>
        </header>
    );
}
