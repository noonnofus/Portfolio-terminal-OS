"use client";

import { useCallback, useRef, useState } from "react";
import { appCatalog } from "@/features/gui-v2/apps/appCatalog";
import {
    createOpenAppCommand,
    type GuiAppId,
} from "@/features/gui-v2/apps/appTypes";
import { useGuiNavigation } from "@/features/gui-v2/navigation/GuiNavigationProvider";
import { useGuiV2Store } from "@/features/gui-v2/store/GuiV2StoreProvider";
import { GuiAppIcon } from "@/features/gui-v2/components/GuiAppIcon";

const shortcutIds = [
    "projects",
    "resume",
] as const satisfies readonly GuiAppId[];

/* ── Individual draggable shortcut icon ─────────────────── */

function DraggableShortcut({
    appId,
    language,
}: {
    appId: GuiAppId;
    language: "ko" | "en";
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

    const handlePointerUp = useCallback(() => {
        const state = dragState.current;
        dragState.current = null;
        setIsDragging(false);
        // If it was just a click (not a drag), open the app
        if (state && !state.wasDragged) {
            navigate(createOpenAppCommand(appId));
        }
    }, [appId, navigate]);

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
            className="gui-v2-shortcut"
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

export function GuiDesktopShortcutsV2() {
    const language = useGuiV2Store((state) => state.language);

    return (
        <nav aria-label="Desktop shortcuts" className="gui-v2-shortcuts">
            {shortcutIds.map((appId) => (
                <DraggableShortcut
                    key={appId}
                    appId={appId}
                    language={language}
                />
            ))}
        </nav>
    );
}
