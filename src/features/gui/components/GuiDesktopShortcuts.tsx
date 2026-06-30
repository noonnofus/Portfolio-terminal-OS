"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { appCatalog } from "@/features/gui/registry/appCatalog";
import {
    createOpenAppCommand,
    type GuiAppId,
} from "@/features/gui/registry/appTypes";
import { useGuiNavigation } from "@/features/gui/navigation/GuiNavigationProvider";
import { useGuiStore } from "@/features/gui/store/GuiStoreProvider";
import { GuiAppIcon } from "@/features/gui/components/GuiAppIcon";

const shortcutIds = [
    "projects",
    "resume",
] as const satisfies readonly GuiAppId[];

/* ── Individual draggable shortcut icon ─────────────────── */

function DraggableShortcut({
    appId,
    language,
    isSelected,
    onSelect,
}: {
    appId: GuiAppId;
    language: "ko" | "en";
    isSelected: boolean;
    onSelect: (id: GuiAppId) => void;
}) {
    const app = appCatalog[appId];
    const { navigate, navigationBusy } = useGuiNavigation();

    const ref = useRef<HTMLButtonElement>(null);
    const dragState = useRef<{
        startX: number;
        startY: number;
        origX: number;
        origY: number;
        wasDragged: boolean;
    } | null>(null);
    const [offset, setOffset] = useState<{
        x: number;
        y: number;
    } | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handlePointerDown = useCallback(
        (e: React.PointerEvent<HTMLButtonElement>) => {
            if (e.button !== 0) return;

            const el = ref.current;
            if (!el) return;

            dragState.current = {
                startX: e.clientX,
                startY: e.clientY,
                origX: offset?.x ?? 0,
                origY: offset?.y ?? 0,
                wasDragged: false,
            };

            el.setPointerCapture(e.pointerId);
            setIsDragging(true);

            // Prevent default to avoid text selection
            e.preventDefault();
        },
        [offset],
    );

    const handlePointerMove = useCallback(
        (e: React.PointerEvent<HTMLButtonElement>) => {
            if (!dragState.current) return;
            const dx = e.clientX - dragState.current.startX;
            const dy = e.clientY - dragState.current.startY;

            // Only count as drag if moved more than 4px
            if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
                dragState.current.wasDragged = true;
            }

            setOffset({
                x: dragState.current.origX + dx,
                y: dragState.current.origY + dy,
            });
        },
        [],
    );

    const handlePointerUp = useCallback(
        (e: React.PointerEvent<HTMLButtonElement>) => {
            const state = dragState.current;
            dragState.current = null;
            setIsDragging(false);
            // If it was just a click (not a drag)
            if (state && !state.wasDragged) {
                if (e.pointerType === "touch" || e.pointerType === "pen") {
                    // Touch/Pen devices: run app immediately on single tap
                    navigate(createOpenAppCommand(appId));
                } else {
                    // Mouse: focus and select on a single click. Opening remains
                    // exclusive to the native double-click handler below.
                    ref.current?.focus();
                    onSelect(appId);
                }
            }
        },
        [appId, navigate, onSelect],
    );

    return (
        <button
            ref={ref}
            key={appId}
            type="button"
            disabled={navigationBusy}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onLostPointerCapture={handlePointerUp}
            onClick={(event) => {
                if (event.detail === 0) {
                    navigate(createOpenAppCommand(appId));
                }
            }}
            onDoubleClick={() => {
                navigate(createOpenAppCommand(appId));
            }}
            className="desktop-app"
            data-selected={isSelected}
            style={{
                transform: offset
                    ? `translate(${offset.x}px, ${offset.y}px)`
                    : undefined,
                cursor: isDragging ? "grabbing" : "pointer",
                touchAction: "none",
            }}
        >
            <GuiAppIcon appId={appId} size="desktop" />
            <span className="pointer-events-none">
                {app.titles[language]}
            </span>
        </button>
    );
}

/* ── Desktop shortcuts container ────────────────────────── */

export function GuiDesktopShortcuts() {
    const language = useGuiStore((state) => state.language);
    const [selectedShortcutId, setSelectedShortcutId] = useState<GuiAppId | null>(null);

    useEffect(() => {
        const handleGlobalClick = (e: PointerEvent) => {
            const target = e.target as HTMLElement;
            // 만약 클릭된 요소가 바탕화면 단축아이콘 내부가 아니라면 선택을 해제합니다.
            if (!target.closest(".desktop-app")) {
                setSelectedShortcutId(null);
            }
        };

        window.addEventListener("pointerdown", handleGlobalClick);
        return () => {
            window.removeEventListener("pointerdown", handleGlobalClick);
        };
    }, []);

    return (
        <nav aria-label="Desktop shortcuts" className="desktop-apps">
            {shortcutIds.map((appId) => (
                <DraggableShortcut
                    key={appId}
                    appId={appId}
                    language={language}
                    isSelected={selectedShortcutId === appId}
                    onSelect={setSelectedShortcutId}
                />
            ))}
        </nav>
    );
}
