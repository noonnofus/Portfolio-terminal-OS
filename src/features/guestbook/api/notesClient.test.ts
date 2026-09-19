import { afterEach, describe, expect, it, vi } from "vitest";

import { listNotes } from "@/features/guestbook/api/notesClient";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("listNotes", () => {
  it("forwards the query cancellation signal to fetch", async () => {
    const signal = new AbortController().signal;
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ notes: [] }),
    });
    vi.stubGlobal("fetch", fetchMock);

    await listNotes("asc", signal);

    expect(fetchMock).toHaveBeenCalledWith("/api/notes?sort=asc", {
      cache: "no-store",
      signal,
    });
  });

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

    await expect(listNotes()).rejects.toThrow("notes_list_failed:503");
    expect(cancel).toHaveBeenCalledOnce();
  });
});
