"use client";

import {
  useCallback,
  useRef,
  useState,
  type PointerEvent,
  type RefObject,
} from "react";

type DragState = {
  startX: number;
  startY: number;
  origX: number;
  origY: number;
  wasDragged: boolean;
  bounds:
    | {
        minX: number;
        maxX: number;
        minY: number;
        maxY: number;
      }
    | undefined;
};

export function useDraggableAppItem({
  boundsRef,
  onOpen,
  onSelect,
}: {
  boundsRef?: RefObject<HTMLElement | null>;
  onOpen: () => void;
  onSelect: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const dragState = useRef<DragState | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const handlePointerDown = useCallback(
    (event: PointerEvent<HTMLButtonElement>) => {
      if (event.button !== 0) return;

      const element = ref.current;
      if (element === null) return;

      const elementRect = element.getBoundingClientRect();
      const boundsRect = boundsRef?.current?.getBoundingClientRect();
      dragState.current = {
        startX: event.clientX,
        startY: event.clientY,
        origX: offset.x,
        origY: offset.y,
        wasDragged: false,
        bounds:
          boundsRect === undefined
            ? undefined
            : {
                minX: offset.x + boundsRect.left - elementRect.left,
                maxX: offset.x + boundsRect.right - elementRect.right,
                minY: offset.y + boundsRect.top - elementRect.top,
                maxY: offset.y + boundsRect.bottom - elementRect.bottom,
              },
      };

      element.setPointerCapture(event.pointerId);
      setIsDragging(true);
      event.preventDefault();
    },
    [boundsRef, offset],
  );

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLButtonElement>) => {
      const state = dragState.current;
      if (state === null) return;

      const deltaX = event.clientX - state.startX;
      const deltaY = event.clientY - state.startY;
      if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
        state.wasDragged = true;
      }

      const nextX = state.origX + deltaX;
      const nextY = state.origY + deltaY;
      setOffset({
        x:
          state.bounds === undefined
            ? nextX
            : Math.min(state.bounds.maxX, Math.max(state.bounds.minX, nextX)),
        y:
          state.bounds === undefined
            ? nextY
            : Math.min(state.bounds.maxY, Math.max(state.bounds.minY, nextY)),
      });
    },
    [],
  );

  const handlePointerUp = useCallback(
    (event: PointerEvent<HTMLButtonElement>) => {
      const state = dragState.current;
      dragState.current = null;
      setIsDragging(false);

      if (state === null || state.wasDragged) return;
      if (event.pointerType === "touch" || event.pointerType === "pen") {
        onOpen();
        return;
      }

      ref.current?.focus();
      onSelect();
    },
    [onOpen, onSelect],
  );

  return {
    ref,
    offset,
    isDragging,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
}
