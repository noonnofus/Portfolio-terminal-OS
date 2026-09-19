import type { Viewer } from "@/features/auth/types/viewer";

const VIEWER_REQUEST_TIMEOUT_MS = 7_000;

export async function fetchViewer(signal: AbortSignal): Promise<Viewer | null> {
  const response = await fetch("/api/auth/viewer", {
    cache: "no-store",
    signal,
  });

  if (!response.ok) {
    await response.body?.cancel();
    return null;
  }

  return response.json() as Promise<Viewer>;
}

export function createViewerRequestTimeout(controller: AbortController) {
  return window.setTimeout(() => controller.abort(), VIEWER_REQUEST_TIMEOUT_MS);
}
