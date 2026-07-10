import { afterEach, describe, expect, it, vi } from "vitest";

import { listNotes } from "@/features/notes/client/notesClient";

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
});
