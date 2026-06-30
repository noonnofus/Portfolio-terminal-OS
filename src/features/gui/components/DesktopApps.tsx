"use client";

import { useEffect, useState } from "react";
import { appCatalog } from "@/features/gui/registry/appCatalog";
import {
  createOpenAppCommand,
  type GuiAppId,
} from "@/features/gui/registry/appTypes";
import { useGuiNavigation } from "@/features/gui/navigation/GuiNavigationProvider";
import { useGuiStore } from "@/features/gui/store/GuiStoreProvider";
import { GuiAppIcon } from "@/features/gui/components/GuiAppIcon";
import { useDraggableAppItem } from "@/features/gui/components/useDraggableAppItem";

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
  const openApp = () => navigate(createOpenAppCommand(appId));
  const {
    ref,
    offset,
    isDragging,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  } = useDraggableAppItem({
    onOpen: openApp,
    onSelect: () => onSelect(appId),
  });

  return (
    <button
      ref={ref}
      type="button"
      disabled={navigationBusy}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onLostPointerCapture={handlePointerUp}
      onClick={(event) => {
        if (event.detail === 0) openApp();
      }}
      onDoubleClick={openApp}
      className="desktop-app"
      data-selected={isSelected}
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        cursor: isDragging ? "grabbing" : "pointer",
        touchAction: "none",
      }}
    >
      <div className="desktop-app-icon-wrapper">
        <GuiAppIcon appId={appId} size="desktop" />
      </div>
      <span className="desktop-app-name pointer-events-none">
        {app.titles[language]}
      </span>
    </button>
  );
}

/* ── Desktop shortcuts container ────────────────────────── */

export function DesktopApps() {
  const language = useGuiStore((state) => state.language);
  const [selectedShortcutId, setSelectedShortcutId] = useState<GuiAppId | null>(
    null,
  );

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
