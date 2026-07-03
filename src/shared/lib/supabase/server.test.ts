import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

describe("getSupabaseCookieOptions", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  it("uses HttpOnly SameSite=Lax cookies for local development", async () => {
    vi.stubEnv("APP_ORIGIN", "http://localhost:3000");

    const { getSupabaseCookieOptions } =
      await import("@/shared/lib/supabase/server");

    expect(getSupabaseCookieOptions()).toEqual({
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: false,
    });
  });

  it("adds Secure on HTTPS origins", async () => {
    vi.stubEnv("APP_ORIGIN", "https://portfolio.example");

    const { getSupabaseCookieOptions } =
      await import("@/shared/lib/supabase/server");

    expect(getSupabaseCookieOptions()).toMatchObject({
      httpOnly: true,
      sameSite: "lax",
      secure: true,
    });
  });
});
