import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { isWallpaperId, wallpaperIds } from "@/features/settings/config/wallpaperCatalog";
import { createDesktopStore } from "@/app/desktop/store/desktopStore";
import { migrateUiPreferences } from "@/app/migrateUiPreferences";
import { DEFAULT_UI_PREFERENCES, UI_PREFERENCES_COOKIE, decodeUiPreferences, encodeUiPreferences } from "@/lib/preferences/uiPreferences";
import { patchUiPreferencesCookie, readUiPreferencesCookie, subscribeUiPreferences, writeUiPreferencesCookie } from "@/lib/preferences/uiPreferences.client";

describe("UI preference codec and initial state", () => {
  it("round-trips all modes, wallpapers and Dock states", () => {
    for (const colorMode of ["light", "dark", "auto"] as const) {
      for (const wallpaper of wallpaperIds) {
        for (const dockAutoHide of [true, false]) {
          const preferences = { version: 1 as const, colorMode, wallpaper, dockAutoHide };
          expect(decodeUiPreferences(encodeUiPreferences(preferences))).toEqual(preferences);
        }
      }
    }
  });

  it("rejects invalid cookie data and prototype/asset names", () => {
    for (const wallpaper of ["toString", "constructor", "__proto__", "/wallpapers/tahoe_light.jpg"]) {
      expect(isWallpaperId(wallpaper)).toBe(false);
      expect(decodeUiPreferences(encodeURIComponent(JSON.stringify({ ...DEFAULT_UI_PREFERENCES, wallpaper })))).toBeNull();
    }
    for (const raw of [undefined, "", "%", "no json", "null", "[]", "1"]) expect(decodeUiPreferences(raw)).toBeNull();
    for (const patch of [{ version: 2 }, { colorMode: "system" }, { dockAutoHide: "true" }]) {
      expect(decodeUiPreferences(encodeURIComponent(JSON.stringify({ ...DEFAULT_UI_PREFERENCES, ...patch })))).toBeNull();
    }
  });

  it("seeds getInitialState and keeps requests isolated", () => {
    const a = createDesktopStore(undefined, { app: "project", slug: "kepco", lang: "en" }, { ...DEFAULT_UI_PREFERENCES, wallpaper: "tahoe_dark", dockAutoHide: true });
    const b = createDesktopStore();
    for (const state of [a.getInitialState(), a.getState()]) {
      expect(state.wallpaper).toBe("tahoe_dark");
      expect(state.dockAutoHide).toBe(true);
      expect(state.windows[0].appId).toBe("project:kepco");
    }
    a.getState().dispatch({ type: "change-wallpaper", wallpaper: "tahoe_light" });
    expect(b.getState().wallpaper).toBe("golden_gate_light");
    expect(a.getInitialState().wallpaper).toBe("tahoe_dark");
  });
});

describe("browser persistence and migration", () => {
  let cookie: string;
  let blocked: boolean;
  let values: Map<string, string>;
  let reload: ReturnType<typeof vi.fn>;
  let storage: { getItem: ReturnType<typeof vi.fn>; removeItem: ReturnType<typeof vi.fn> };
  let writes: ReturnType<typeof vi.fn<(value: string) => void>>;
  let channels: FakeChannel[];
  let cookieEvents: EventTarget;

  class FakeChannel extends EventTarget {
    close = vi.fn();
    postMessage = vi.fn();
    constructor(public name: string) { super(); channels.push(this); }
  }

  beforeEach(() => {
    cookie = "";
    blocked = false;
    channels = [];
    values = new Map();
    reload = vi.fn();
    writes = vi.fn();
    storage = {
      getItem: vi.fn((key: string) => values.get(key) ?? null),
      removeItem: vi.fn((key: string) => values.delete(key)),
    };
    const target = new EventTarget();
    cookieEvents = new EventTarget();
    Object.assign(target, { location: { protocol: "https:", reload }, localStorage: storage, cookieStore: cookieEvents });
    vi.stubGlobal("window", target);
    vi.stubGlobal("BroadcastChannel", FakeChannel);
    vi.stubGlobal("document", {
      get cookie() { return cookie; },
      set cookie(value: string) {
        writes(value);
        if (!blocked) cookie = value.split(";")[0];
      },
    });
  });
  afterEach(() => vi.unstubAllGlobals());

  function legacy(key = "desktop:preferences", wallpaper = "tahoe_dark", dockAutoHide = true) {
    values.set(key, JSON.stringify({ version: 1, preferences: { language: "en", wallpaper, dockAutoHide } }));
  }

  it("patches fresh cookie fields, notifies once and releases subscriptions", () => {
    cookie = `unrelated=1; ${UI_PREFERENCES_COOKIE}=${encodeUiPreferences({ ...DEFAULT_UI_PREFERENCES, wallpaper: "tahoe_dark", dockAutoHide: true })}`;
    const listener = vi.fn();
    const unsubscribe = subscribeUiPreferences(listener);
    expect(listener).toHaveBeenCalledTimes(1);
    listener.mockClear();
    expect(patchUiPreferencesCookie({ colorMode: "dark" })).toBe(true);
    expect(readUiPreferencesCookie()).toEqual({ ...DEFAULT_UI_PREFERENCES, colorMode: "dark", wallpaper: "tahoe_dark", dockAutoHide: true });
    expect(writes).toHaveBeenCalledWith(expect.stringContaining("; Path=/; SameSite=Lax; Max-Age=31536000; Secure"));
    expect(listener).toHaveBeenCalledTimes(1);
    expect(patchUiPreferencesCookie({ colorMode: "dark" })).toBe(true);
    expect(writes).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledTimes(1);
    channels[0].dispatchEvent(new Event("message"));
    const restored = new Event("pageshow");
    Object.assign(restored, { persisted: true });
    window.dispatchEvent(restored);
    expect(listener).toHaveBeenCalledTimes(3);
    expect(writes).toHaveBeenCalledTimes(1);
    unsubscribe();
    expect(channels.every(channel => channel.close.mock.calls.length === 1)).toBe(true);
    window.dispatchEvent(restored);
    expect(listener).toHaveBeenCalledTimes(3);
  });

  it("matches only the designated cookie and verifies rejected writes", () => {
    cookie = `prefix-${UI_PREFERENCES_COOKIE}=${encodeUiPreferences(DEFAULT_UI_PREFERENCES)}`;
    expect(readUiPreferencesCookie()).toBeNull();
    blocked = true;
    expect(writeUiPreferencesCookie(DEFAULT_UI_PREFERENCES)).toBe(false);
    expect(channels).toHaveLength(0);
  });

  it("rereads on native cookie changes and releases that listener", () => {
    const listener = vi.fn();
    const unsubscribe = subscribeUiPreferences(listener);
    cookieEvents.dispatchEvent(new Event("change"));
    expect(listener).toHaveBeenCalledTimes(2);
    expect(writes).not.toHaveBeenCalled();
    unsubscribe();
    cookieEvents.dispatchEvent(new Event("change"));
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it("prioritizes valid cookies without reading legacy storage", () => {
    cookie = `${UI_PREFERENCES_COOKIE}=${encodeUiPreferences(DEFAULT_UI_PREFERENCES)}`;
    values.set("theme", "dark");
    migrateUiPreferences();
    expect(storage.getItem).not.toHaveBeenCalled();
    expect(values.get("theme")).toBe("dark");
    expect(reload).not.toHaveBeenCalled();
  });

  it.each(["desktop:preferences", "gui:preferences"])("migrates %s once, ignores saved language and preserves unrelated keys", (key) => {
    legacy(key);
    values.set("theme", "auto");
    values.set("unrelated", "keep");
    migrateUiPreferences();
    expect(readUiPreferencesCookie()).toEqual({ ...DEFAULT_UI_PREFERENCES, colorMode: "auto", wallpaper: "tahoe_dark", dockAutoHide: true });
    expect(values).toEqual(new Map([["unrelated", "keep"]]));
    expect(reload).toHaveBeenCalledTimes(1);
    migrateUiPreferences();
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it("prefers the current legacy format over GUI and removes only the consumed key", () => {
    legacy();
    legacy("gui:preferences", "tahoe_light", false);
    migrateUiPreferences();
    expect(readUiPreferencesCookie()?.wallpaper).toBe("tahoe_dark");
    expect(values.has("gui:preferences")).toBe(true);
  });

  it.each(["theme", "desktop", "defaults"])("handles %s-only migration", (variant) => {
    if (variant === "theme") values.set("theme", "dark");
    else legacy("desktop:preferences", variant === "defaults" ? "golden_gate_light" : "tahoe_dark", variant !== "defaults");
    migrateUiPreferences();
    expect(readUiPreferencesCookie()).not.toBeNull();
    expect(reload).toHaveBeenCalledTimes(variant === "defaults" ? 0 : 1);
  });

  it("preserves old data and avoids reload when cookies are blocked", () => {
    values.set("theme", "dark");
    legacy();
    blocked = true;
    migrateUiPreferences();
    migrateUiPreferences();
    expect(values.size).toBe(2);
    expect(storage.removeItem).not.toHaveBeenCalled();
    expect(reload).not.toHaveBeenCalled();
  });

  it("aborts unreadable storage and skips absent/invalid legacy values", () => {
    storage.getItem.mockImplementationOnce(() => { throw new Error("blocked"); });
    migrateUiPreferences();
    values.set("theme", "invalid");
    values.set("desktop:preferences", "invalid");
    migrateUiPreferences();
    expect(writes).not.toHaveBeenCalled();
    expect(reload).not.toHaveBeenCalled();
    expect(storage.removeItem).not.toHaveBeenCalled();
  });
});
