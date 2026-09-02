import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const listNotes = vi.hoisted(() => vi.fn());
const listEnabledWallpapers = vi.hoisted(() => vi.fn());
const getUser = vi.hoisted(() => vi.fn());
const getViewerForUser = vi.hoisted(() => vi.fn());

vi.mock("server-only", () => ({}));
vi.mock("@/features/guestbook/server/noteRepository", () => ({ listNotes }));
vi.mock("@/features/settings/server/wallpaperRepository", () => ({
  listEnabledWallpapers,
}));
vi.mock("@/features/auth/server/getViewer", () => ({ getViewerForUser }));
vi.mock("@/lib/supabase/server", () => ({
  createSupabaseRequestClient: () => ({ auth: { getUser } }),
}));

import { GET as getViewer } from "@/app/api/auth/viewer/route";
import { GET as getNotes } from "@/app/api/notes/route";
import { GET as getWallpapers } from "@/app/api/wallpapers/route";

describe("Supabase feature route fallbacks", () => {
  beforeEach(() => {
    listNotes.mockReset();
    listEnabledWallpapers.mockReset();
    getUser.mockReset();
    getViewerForUser.mockReset();
  });

  it("returns a private 503 when notes are unavailable", async () => {
    listNotes.mockRejectedValue(new Error("database offline"));

    const response = await getNotes(
      new NextRequest("https://portfolio.example/api/notes?sort=asc"),
    );

    expect(response.status).toBe(503);
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    await expect(response.json()).resolves.toEqual({
      error: "notes_unavailable",
    });
  });

  it("returns a private 503 when wallpapers are unavailable", async () => {
    listEnabledWallpapers.mockRejectedValue(new Error("database offline"));

    const response = await getWallpapers();

    expect(response.status).toBe(503);
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    await expect(response.json()).resolves.toEqual({
      error: "wallpapers_unavailable",
    });
  });

  it("returns a private 503 when viewer authentication is unavailable", async () => {
    getUser.mockResolvedValue({
      data: { user: null },
      error: new Error("auth offline"),
    });

    const response = await getViewer(
      new NextRequest("https://portfolio.example/api/auth/viewer"),
    );

    expect(response.status).toBe(503);
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(getViewerForUser).not.toHaveBeenCalled();
  });
});
