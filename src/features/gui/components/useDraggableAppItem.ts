"use client";

import {
  useCallback,
  useRef,
  useState,
  type PointerEvent,
  type RefObject,
} from "react";

export type Point = {
  x: number;
  y: number;
};

type DragState = {
  startX: number;
  startY: number;
  origin: Point;
  wasDragged: boolean;
  bounds?: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  };
};

export function useDraggableAppItem({
  boundsRef,
  position,
  onPositionChange,
  onOpen,
  onSelect,
}: {
  boundsRef: RefObject<HTMLElement | null>;
  position: Point;
  onPositionChange: (position: Point) => void;
  onOpen: () => void;
  onSelect: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const dragState = useRef<DragState | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handlePointerDown = useCallback(
    (event: PointerEvent<HTMLButtonElement>) => {
      if (event.button !== 0) return;

      const element = ref.current;
      const boundsElement = boundsRef.current;
      if (element === null || boundsElement === null) return;

      const elementRect = element.getBoundingClientRect();
      const boundsRect = boundsElement.getBoundingClientRect();
      dragState.current = {
        startX: event.clientX,
        startY: event.clientY,
        origin: position,
        wasDragged: false,
        bounds: {
          minX: position.x + boundsRect.left - elementRect.left,
          maxX: position.x + boundsRect.right - elementRect.right,
          minY: position.y + boundsRect.top - elementRect.top,
          maxY: position.y + boundsRect.bottom - elementRect.bottom,
        },
      };

      element.setPointerCapture(event.pointerId);
      setIsDragging(true);
      event.preventDefault();
    },
    [boundsRef, position],
  );

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLButtonElement>) => {
      const state = dragState.current;
      if (state === null || state.bounds === undefined) return;

      const deltaX = event.clientX - state.startX;
      const deltaY = event.clientY - state.startY;
      if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
        state.wasDragged = true;
      }

      onPositionChange({
        x: Math.min(
          state.bounds.maxX,
          Math.max(state.bounds.minX, state.origin.x + deltaX),
        ),
        y: Math.min(
          state.bounds.maxY,
          Math.max(state.bounds.minY, state.origin.y + deltaY),
        ),
      });
    },
    [onPositionChange],
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
    isDragging,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
}
