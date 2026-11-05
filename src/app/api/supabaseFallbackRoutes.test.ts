import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { AuthApiError, AuthSessionMissingError, type User } from "@supabase/supabase-js";

const authenticatedUser: User = {
  id: "viewer-user",
  aud: "authenticated",
  app_metadata: {},
  user_metadata: {},
  created_at: "2026-11-04T00:00:00Z",
};

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

  it("returns a private guest response when the auth session is missing", async () => {
    getUser.mockResolvedValue({
      data: { user: null },
      error: new AuthSessionMissingError(),
    });
    getViewerForUser.mockResolvedValue({ status: "guest" });

    const response = await getViewer(
      new NextRequest("https://portfolio.example/api/auth/viewer"),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    await expect(response.json()).resolves.toEqual({ status: "guest" });
    expect(getViewerForUser).toHaveBeenCalledExactlyOnceWith(null);
  });

  it("returns the authenticated viewer without changing its fields", async () => {
    const viewer = {
      status: "authenticated",
      accountId: authenticatedUser.id,
      displayName: "Viewer",
      email: null,
      avatarUrl: null,
      role: "user",
    };
    getUser.mockResolvedValue({
      data: { user: authenticatedUser },
      error: null,
    });
    getViewerForUser.mockResolvedValue(viewer);

    const response = await getViewer(
      new NextRequest("https://portfolio.example/api/auth/viewer"),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    await expect(response.json()).resolves.toEqual(viewer);
    expect(getViewerForUser).toHaveBeenCalledExactlyOnceWith(authenticatedUser);
  });

  it.each([
    { name: "authentication service failure", error: new Error("auth offline") },
    { name: "other authentication errors", error: new AuthApiError("invalid token", 401, "bad_jwt") },
  ])("returns a private 503 for $name", async ({ error }) => {
    getUser.mockResolvedValue({
      data: { user: null },
      error,
    });

    const response = await getViewer(
      new NextRequest("https://portfolio.example/api/auth/viewer"),
    );

    expect(response.status).toBe(503);
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    await expect(response.json()).resolves.toEqual({ error: "viewer_unavailable" });
    expect(getViewerForUser).not.toHaveBeenCalled();
  });

  it.each(["authentication", "account lookup"] as const)(
    "returns a private 503 when %s throws",
    async (stage) => {
      getUser.mockResolvedValue({ data: { user: authenticatedUser }, error: null });
      if (stage === "authentication") {
        getUser.mockRejectedValue(new Error("auth unavailable"));
      } else {
        getViewerForUser.mockRejectedValue(new Error("account unavailable"));
      }

      const response = await getViewer(
        new NextRequest("https://portfolio.example/api/auth/viewer"),
      );

      expect(response.status).toBe(503);
      expect(response.headers.get("cache-control")).toBe("private, no-store");
      await expect(response.json()).resolves.toEqual({ error: "viewer_unavailable" });
      if (stage === "authentication") expect(getViewerForUser).not.toHaveBeenCalled();
      else expect(getViewerForUser).toHaveBeenCalledExactlyOnceWith(authenticatedUser);
    },
  );
});
