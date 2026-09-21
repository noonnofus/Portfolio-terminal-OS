"use client";

import { useEffect } from "react";
import {
  createViewerRequestTimeout,
  fetchViewer,
} from "@/features/auth/api/viewerClient";
import { useDesktopStoreApi } from "@/app/desktop/store/DesktopStoreProvider";

export function useViewerBootstrap() {
  const store = useDesktopStoreApi();

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = createViewerRequestTimeout(controller);

    async function loadViewer() {
      try {
        const viewer = await fetchViewer(controller.signal);
        if (viewer !== null) store.getState().setViewer(viewer);
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
}
