"use client";

import {
  type KeyboardEvent,
  type RefObject,
} from "react";
import { DirectoryItemIcon } from "@/app/desktop/components/directory/DirectoryItemIcon";
import {
  type Point,
  useDraggableAppItem,
} from "@/app/desktop/hooks/useDraggableAppItem";
import type {
  DirectoryNode,
  DirectoryNodeId,
} from "@/app/desktop/components/directory/directoryTypes";
import { appCatalog } from "@/app/desktop/config/appCatalog";
import { getAppTitle } from "@/app/desktop/lib/getAppTitle";
import { useDesktopLanguage } from "@/app/desktop/store/DesktopStoreProvider";
import { useTranslation } from "react-i18next";
import { getDesktopUrlStateForApp, serializeDesktopUrl } from "@/app/desktop/lib/parseDesktopAppTarget";

export function DirectoryItem({
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
  node: DirectoryNode;
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
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
  onContextMenu: () => void;
  registerElement: (
    nodeId: DirectoryNodeId,
    element: HTMLElement | null,
  ) => void;
}) {
  const language = useDesktopLanguage();
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
  const setRef = (element: HTMLElement | null) => {
    ref.current = element;
    registerElement(node.nodeId, element);
  };

  const isLink = app.url.app === "project" || app.url.app === "projects";
  const Element = isLink ? "a" : "button";

  return (
    <Element
      ref={setRef}
      {...(isLink
        ? { href: serializeDesktopUrl(getDesktopUrlStateForApp(node.appId, language)), draggable: false }
        : { type: "button" as const, disabled: navigationBusy })}
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
        if (isLink) {
          if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || navigationBusy) return;
          event.preventDefault();
        }
        if (event.detail === 0) onOpen();
      }}
      onDoubleClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        onOpen();
      }}
      onKeyDown={(event) => {
        if (isLink && event.key === "Enter" && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
          event.preventDefault();
          onOpen();
          return;
        }
        onKeyDown(event);
      }}
      onContextMenu={(event) => {
        if (isLink) return;
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
    </Element>
  );
}
