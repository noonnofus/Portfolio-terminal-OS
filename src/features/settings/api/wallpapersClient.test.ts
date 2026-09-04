import { afterEach, describe, expect, it, vi } from "vitest";

import { listWallpapers } from "@/features/settings/api/wallpapersClient";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("listWallpapers", () => {
  it("cancels an error response body before rejecting", async () => {
    const cancel = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 503,
        body: { cancel },
      }),
    );

    await expect(listWallpapers()).rejects.toThrow(
      "wallpapers_read_failed:503",
    );
    expect(cancel).toHaveBeenCalledOnce();
  });
});
