"use client";

import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { DesktopItem } from "@/features/gui/directory/DesktopItem";
import type {
  DesktopFolderNode,
  DesktopNodeId,
} from "@/features/gui/directory/directoryTypes";
import {
  type Point,
} from "@/features/gui/components/useDraggableAppItem";
import { createOpenAppCommand } from "@/features/gui/registry/appTypes";
import { useGuiNavigation } from "@/features/gui/navigation/GuiNavigationProvider";
import type { WindowId } from "@/features/gui/navigation/navigationTypes";
import { useGuiStore } from "@/features/gui/store/GuiStoreProvider";

const ZERO_POINT: Point = { x: 0, y: 0 };
const MIN_ITEM_WIDTH = 88;
const COLUMN_GAP = 16;
const MOVE_STEP = 16;

type ItemPositions = Partial<Record<DesktopNodeId, Point>>;

function chunkRows<T>(items: readonly T[], columnCount: number): T[][] {
  const rows: T[][] = [];
  for (let index = 0; index < items.length; index += columnCount) {
    rows.push(items.slice(index, index + columnCount));
  }
  return rows;
}

export function DirectorySurface({
  windowId,
  directory,
  variant,
}: {
  windowId: WindowId;
  directory: DesktopFolderNode;
  variant: "desktop" | "window";
}) {
  const language = useGuiStore((state) => state.language);
  const { navigate, navigationBusy } = useGuiNavigation();
  const surfaceRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const itemElements = useRef(
    new Map<DesktopNodeId, HTMLButtonElement>(),
  );
  const [contentWidth, setContentWidth] = useState(0);
  const [selectedNodeId, setSelectedNodeId] =
    useState<DesktopNodeId | null>(null);
  const [focusedNodeId, setFocusedNodeId] = useState<DesktopNodeId | null>(
    directory.children[0]?.nodeId ?? null,
  );
  const [positions, setPositions] = useState<ItemPositions>({});
  const [menuNodeId, setMenuNodeId] = useState<DesktopNodeId | null>(null);
  const columnCount = Math.max(
    1,
    Math.floor((contentWidth + COLUMN_GAP) / (MIN_ITEM_WIDTH + COLUMN_GAP)),
  );
  const rows = chunkRows(directory.children, columnCount);

  const registerElement = (
    nodeId: DesktopNodeId,
    element: HTMLButtonElement | null,
  ) => {
    if (element === null) itemElements.current.delete(nodeId);
    else itemElements.current.set(nodeId, element);
  };

  const updatePosition = (nodeId: DesktopNodeId, point: Point) => {
    setPositions((current) => ({ ...current, [nodeId]: point }));
  };

  const reclampAll = useCallback(() => {
    const bounds = (
      variant === "window" ? gridRef.current : surfaceRef.current
    )?.getBoundingClientRect();
    if (bounds === undefined) return;

    setPositions((current) => {
      let changed = false;
      const next = { ...current };
      for (const node of directory.children) {
        const element = itemElements.current.get(node.nodeId);
        if (element === undefined) continue;
        const position = current[node.nodeId] ?? ZERO_POINT;
        const rect = element.getBoundingClientRect();
        const baseLeft = rect.left - position.x;
        const baseTop = rect.top - position.y;
        const clamped = {
          x: Math.min(
            bounds.right - baseLeft - rect.width,
            Math.max(bounds.left - baseLeft, position.x),
          ),
          y: Math.min(
            bounds.bottom - baseTop - rect.height,
            Math.max(bounds.top - baseTop, position.y),
          ),
        };
        if (clamped.x !== position.x || clamped.y !== position.y) {
          next[node.nodeId] = clamped;
          changed = true;
        }
      }
      return changed ? next : current;
    });
  }, [directory.children, variant]);

  useLayoutEffect(() => {
    const surface = surfaceRef.current;
    const grid = gridRef.current;
    if (surface === null || grid === null) return;
    setContentWidth(grid.getBoundingClientRect().width);
    const observer = new ResizeObserver(() => {
      setContentWidth(grid.getBoundingClientRect().width);
      requestAnimationFrame(reclampAll);
    });
    observer.observe(surface);
    observer.observe(grid);
    for (const element of itemElements.current.values()) {
      observer.observe(element);
    }
    return () => observer.disconnect();
  }, [reclampAll]);

  useLayoutEffect(() => {
    if (focusedNodeId === null) return;
    const active = document.activeElement;
    if (active instanceof HTMLButtonElement && active.dataset.nodeId) {
      itemElements.current.get(focusedNodeId)?.focus();
    }
  }, [columnCount, focusedNodeId]);

  const focusIndex = (nextIndex: number) => {
    const node = directory.children[nextIndex];
    if (node === undefined) return;
    setFocusedNodeId(node.nodeId);
    itemElements.current.get(node.nodeId)?.focus();
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
    nodeId: DesktopNodeId,
  ) => {
    let nextIndex: number | null = null;
    switch (event.key) {
      case "ArrowLeft":
        nextIndex = Math.max(0, index - 1);
        break;
      case "ArrowRight":
        nextIndex = Math.min(directory.children.length - 1, index + 1);
        break;
      case "ArrowUp":
        nextIndex = Math.max(0, index - columnCount);
        break;
      case "ArrowDown":
        nextIndex = Math.min(
          directory.children.length - 1,
          index + columnCount,
        );
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = directory.children.length - 1;
        break;
      case "Escape":
        setSelectedNodeId(null);
        setMenuNodeId(null);
        event.preventDefault();
        return;
      case "F10":
        if (event.shiftKey) {
          setMenuNodeId(nodeId);
          event.preventDefault();
        }
        return;
      default:
        return;
    }
    event.preventDefault();
    focusIndex(nextIndex);
  };

  const moveSelected = (delta: Point) => {
    if (menuNodeId === null) return;
    const current = positions[menuNodeId] ?? ZERO_POINT;
    updatePosition(menuNodeId, {
      x: current.x + delta.x,
      y: current.y + delta.y,
    });
    requestAnimationFrame(reclampAll);
  };

  const itemLabel = language === "ko" ? "개 항목" : "items";
  const emptyLabel =
    language === "ko" ? "이 폴더는 비어 있습니다." : "This folder is empty.";
  const rowStyle = {
    "--directory-columns": columnCount,
  } as CSSProperties;

  return (
    <section
      ref={surfaceRef}
      role={variant === "desktop" ? "navigation" : undefined}
      className={`directory-surface directory-surface--${variant} ${
        variant === "desktop" ? "desktop-apps" : "gui-folder-view"
      }`}
      aria-label={
        variant === "desktop"
          ? "Desktop shortcuts"
          : language === "ko"
            ? "폴더"
            : "Folder"
      }
      onPointerDown={(event) => {
        const target = event.target as HTMLElement;
        if (
          target.closest(".directory-item") === null &&
          target.closest(".directory-action-menu") === null
        ) {
          setSelectedNodeId(null);
          setMenuNodeId(null);
        }
      }}
    >
      {directory.children.length === 0 ? (
        <div role="grid" tabIndex={0} className="directory-empty">
          {emptyLabel}
        </div>
      ) : (
        <div
          ref={gridRef}
          role="grid"
          aria-rowcount={rows.length}
          aria-colcount={columnCount}
          className={`directory-grid ${
            variant === "window" ? "gui-project-grid" : ""
          }`}
        >
          {rows.map((row, rowIndex) => (
            <div
              key={`${directory.nodeId}:row:${rowIndex}`}
              role="row"
              className="directory-row"
              style={rowStyle}
            >
              {row.map((node) => {
                const index = directory.children.indexOf(node);
                return (
                  <div
                    key={node.nodeId}
                    role="gridcell"
                    className="directory-cell"
                  >
                    <DesktopItem
                      node={node}
                      variant={variant}
                      language={language}
                      selected={selectedNodeId === node.nodeId}
                      focused={focusedNodeId === node.nodeId}
                      navigationBusy={navigationBusy}
                      position={positions[node.nodeId] ?? ZERO_POINT}
                      boundsRef={
                        variant === "window" ? gridRef : surfaceRef
                      }
                      onSelect={() => {
                        setSelectedNodeId(node.nodeId);
                        setFocusedNodeId(node.nodeId);
                      }}
                      onFocus={() => setFocusedNodeId(node.nodeId)}
                      onOpen={() =>
                        navigate(createOpenAppCommand(node.appId))
                      }
                      onPositionChange={(point) =>
                        updatePosition(node.nodeId, point)
                      }
                      onKeyDown={(event) =>
                        handleKeyDown(event, index, node.nodeId)
                      }
                      onContextMenu={() => setMenuNodeId(node.nodeId)}
                      registerElement={registerElement}
                    />
                    {menuNodeId === node.nodeId ? (
                      <div
                        role="menu"
                        aria-label={
                          language === "ko" ? "위치 변경" : "Move item"
                        }
                        className="directory-action-menu"
                      >
                        {[
                          ["←", { x: -MOVE_STEP, y: 0 }],
                          ["→", { x: MOVE_STEP, y: 0 }],
                          ["↑", { x: 0, y: -MOVE_STEP }],
                          ["↓", { x: 0, y: MOVE_STEP }],
                        ].map(([label, delta]) => (
                          <button
                            key={label as string}
                            type="button"
                            role="menuitem"
                            onClick={() => moveSelected(delta as Point)}
                          >
                            {label as string}
                          </button>
                        ))}
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            updatePosition(node.nodeId, ZERO_POINT);
                            setMenuNodeId(null);
                          }}
                        >
                          {language === "ko" ? "초기화" : "Reset"}
                        </button>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
      {variant === "window" ? (
        <footer className="gui-folder-footer">
          {directory.children.length} {itemLabel}
        </footer>
      ) : null}
      <span className="sr-only">window {windowId}</span>
    </section>
  );
}
