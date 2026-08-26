"use client";

import { useEffect } from "react";

import type { Viewer } from "@/features/auth/model/viewer";
import { useGuiStoreApi } from "@/features/gui/store/GuiStoreProvider";

const VIEWER_REQUEST_TIMEOUT_MS = 7_000;

export function ViewerBootstrap() {
  const store = useGuiStoreApi();

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(
      () => controller.abort(),
      VIEWER_REQUEST_TIMEOUT_MS,
    );

    async function loadViewer() {
      try {
        const response = await fetch("/api/auth/viewer", {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          await response.body?.cancel();
          return;
        }

        const viewer = (await response.json()) as Viewer;
        store.getState().setViewer(viewer);
      } catch {
        // Guest is the intentional fallback when viewer lookup is unavailable.
      } finally {
        window.clearTimeout(timeoutId);
      }
    }

    void loadViewer();
    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [store]);

  return null;
}
