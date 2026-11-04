"use client";

import {
  DEFAULT_UI_PREFERENCES,
  UI_PREFERENCES_COOKIE,
  decodeUiPreferences,
  encodeUiPreferences,
  type UiPreferences,
} from "./uiPreferences";

const PREFERENCES_EVENT = "ui-preferences-change";

export function readUiPreferencesCookie(): UiPreferences | null {
  try {
    const prefix = `${UI_PREFERENCES_COOKIE}=`;
    const cookie = document.cookie.split(";").map((item) => item.trim()).find((item) => item.startsWith(prefix));
    return decodeUiPreferences(cookie?.slice(prefix.length));
  } catch {
    // Cookies may be unavailable in restricted browser contexts.
    return null;
  }
}

export function writeUiPreferencesCookie(next: UiPreferences): boolean {
  const encoded = encodeUiPreferences(next);
  const current = readUiPreferencesCookie();
  if (current && encodeUiPreferences(current) === encoded) return true;
  try {
    document.cookie = `${UI_PREFERENCES_COOKIE}=${encoded}; Path=/; SameSite=Lax; Max-Age=31536000${window.location.protocol === "https:" ? "; Secure" : ""}`;
  } catch {
    return false;
  }
  const saved = readUiPreferencesCookie();
  if (!saved || encodeUiPreferences(saved) !== encoded) return false;

  window.dispatchEvent(new Event(PREFERENCES_EVENT));
  if (typeof BroadcastChannel !== "undefined") {
    const channel = new BroadcastChannel(UI_PREFERENCES_COOKIE);
    channel.postMessage(null);
    channel.close();
  }
  return true;
}

export function patchUiPreferencesCookie(
  patch: Partial<Pick<UiPreferences, "colorMode" | "wallpaper" | "dockAutoHide">>,
): boolean {
  return writeUiPreferencesCookie({ ...(readUiPreferencesCookie() ?? DEFAULT_UI_PREFERENCES), ...patch });
}

export function subscribeUiPreferences(listener: () => void): () => void {
  const onPageShow = (event: PageTransitionEvent) => {
    if (event.persisted) listener();
  };
  const channel = typeof BroadcastChannel === "undefined" ? null : new BroadcastChannel(UI_PREFERENCES_COOKIE);
  // Cookie propagation can lag behind BroadcastChannel in another browser process.
  const cookieEvents = "cookieStore" in window && window.cookieStore instanceof EventTarget ? window.cookieStore : null;
  cookieEvents?.addEventListener("change", listener);
  channel?.addEventListener("message", listener);
  window.addEventListener(PREFERENCES_EVENT, listener);
  window.addEventListener("pageshow", onPageShow);
  // Another tab can change the cookie between the server request and hydration.
  listener();
  return () => {
    cookieEvents?.removeEventListener("change", listener);
    channel?.removeEventListener("message", listener);
    channel?.close();
    window.removeEventListener(PREFERENCES_EVENT, listener);
    window.removeEventListener("pageshow", onPageShow);
  };
}
