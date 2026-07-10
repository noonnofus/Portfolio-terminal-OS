"use client";

import {
  type KeyboardEvent,
  type RefObject,
} from "react";
import { DirectoryItemIcon } from "@/features/gui/directory/DirectoryItemIcon";
import {
  type Point,
  useDraggableAppItem,
} from "@/features/gui/components/useDraggableAppItem";
import type {
  DesktopNode,
  DesktopNodeId,
} from "@/features/gui/directory/directoryTypes";
import { appMetadata } from "@/features/gui/registry/appMetadata";
import type { Language } from "@/shared/lib/i18n/useLanguageStore";
import { orderedProjectSummaries } from "@/shared/content/portfolio/projectSummaries";

export function DesktopItem({
  node,
  variant,
  language,
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
  language: Language;
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
  const app = appMetadata[node.appId];
  const projectSummary = orderedProjectSummaries.find(
    (project) => `project:${project.slug}` === node.appId,
  );
  const title =
    projectSummary?.content[language].title ?? app.titles[language];
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
              language === "ko" ? "프로젝트 열기" : "open project"
            }`
      }
      data-node-id={node.nodeId}
      className={`desktop-app directory-item ${
        variant === "window" ? "gui-project-card" : ""
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
