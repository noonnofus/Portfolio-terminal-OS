"use client";

import {
  type KeyboardEvent,
  type RefObject,
} from "react";
import { DirectoryItemIcon } from "@/app/gui/components/directory/DirectoryItemIcon";
import {
  type Point,
  useDraggableAppItem,
} from "@/app/gui/hooks/useDraggableAppItem";
import type {
  DesktopNode,
  DesktopNodeId,
} from "@/app/gui/components/directory/directoryTypes";
import { appCatalog } from "@/app/gui/config/appCatalog";
import { getAppTitle } from "@/app/gui/lib/getAppTitle";
import { useLanguageStore } from "@/lib/i18n/useLanguageStore";
import { useTranslation } from "react-i18next";

export function DesktopItem({
  node,
  variant,
  selected,
  focused,
  navigationBusy,
  position,
  boundsRef,
  onSelect,
  onOpen,
  onFocus,
  onPositionChange,
  onKeyDown,
  onContextMenu,
  registerElement,
}: {
  node: DesktopNode;
  variant: "desktop" | "window";
  selected: boolean;
  focused: boolean;
  navigationBusy: boolean;
  position: Point;
  boundsRef: RefObject<HTMLElement | null>;
  onSelect: () => void;
  onOpen: () => void;
  onFocus: () => void;
  onPositionChange: (position: Point) => void;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
  onContextMenu: () => void;
  registerElement: (
    nodeId: DesktopNodeId,
    element: HTMLButtonElement | null,
  ) => void;
}) {
  const language = useLanguageStore((state) => state.currentLanguage);
  const { t } = useTranslation("appShell", { lng: language });
  const app = appCatalog[node.appId];
  const title = getAppTitle(app, t);
  const {
    ref,
    isDragging,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  } = useDraggableAppItem({
    boundsRef,
    position,
    onPositionChange,
    onOpen,
    onSelect,
  });
  const setRef = (element: HTMLButtonElement | null) => {
    ref.current = element;
    registerElement(node.nodeId, element);
  };

  return (
    <button
      ref={setRef}
      type="button"
      disabled={navigationBusy}
      tabIndex={focused ? 0 : -1}
      aria-label={
        variant === "desktop"
          ? title
          : `${title} ${
              t("desktop.openProject")
            }`
      }
      data-node-id={node.nodeId}
      className={`desktop-app directory-item ${
        variant === "window" ? "application-project-card" : ""
      }`}
      data-appearance={node.appearance}
      data-selected={selected}
      onFocus={onFocus}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onLostPointerCapture={handlePointerUp}
      onClick={(event) => {
        if (event.detail === 0) onOpen();
      }}
      onDoubleClick={onOpen}
      onKeyDown={onKeyDown}
      onContextMenu={(event) => {
        event.preventDefault();
        onContextMenu();
      }}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        cursor: isDragging ? "grabbing" : "pointer",
        touchAction: "none",
        zIndex: isDragging || selected ? 2 : 1,
      }}
    >
      <span className="desktop-app-icon-wrapper">
        <DirectoryItemIcon node={node} />
      </span>
      <span className="desktop-app-name pointer-events-none">{title}</span>
    </button>
  );
}
