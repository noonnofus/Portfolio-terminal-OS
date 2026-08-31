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

describe("getApplicationOrigin", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  it("uses the current Vercel deployment origin for previews", async () => {
    vi.stubEnv("APP_ORIGIN", "https://hyunhokim.is-a.dev");
    vi.stubEnv("VERCEL_ENV", "preview");
    vi.stubEnv(
      "VERCEL_URL",
      "hyunho-preview-bcitkevins-projects.vercel.app",
    );

    const { getApplicationOrigin } =
      await import("@/shared/lib/supabase/env");

    expect(getApplicationOrigin()).toBe(
      "https://hyunho-preview-bcitkevins-projects.vercel.app",
    );
  });

  it("keeps the configured canonical origin outside previews", async () => {
    vi.stubEnv("APP_ORIGIN", "https://hyunhokim.is-a.dev");
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv(
      "VERCEL_URL",
      "hyunho-preview-bcitkevins-projects.vercel.app",
    );

    const { getApplicationOrigin } =
      await import("@/shared/lib/supabase/env");

    expect(getApplicationOrigin()).toBe("https://hyunhokim.is-a.dev");
  });
});
