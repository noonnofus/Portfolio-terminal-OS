import { describe, expect, it } from "vitest";

import {
  parseApplicationOrigin,
  parseSupabasePublicEnv,
  parseSupabaseSecretEnv,
} from "@/shared/lib/supabase/envSchema";

describe("parseApplicationOrigin", () => {
  it("normalizes the configured canonical origin", () => {
    expect(
      parseApplicationOrigin({
        APP_ORIGIN: "https://portfolio.example/gui",
      }),
    ).toBe("https://portfolio.example");
  });

  it("allows localhost over HTTP", () => {
    expect(
      parseApplicationOrigin({
        APP_ORIGIN: "http://localhost:3000",
      }),
    ).toBe("http://localhost:3000");
  });

  it("rejects insecure remote origins", () => {
    expect(() =>
      parseApplicationOrigin({
        APP_ORIGIN: "http://portfolio.example",
      }),
    ).toThrow("APP_ORIGIN must use HTTPS");
  });
});

describe("parseSupabasePublicEnv", () => {
  it("accepts a hosted HTTPS project", () => {
    expect(
      parseSupabasePublicEnv({
        NEXT_PUBLIC_SUPABASE_URL: "https://project.supabase.co/path",
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "publishable-key",
      }),
    ).toEqual({
      url: "https://project.supabase.co",
      publishableKey: "publishable-key",
    });
  });

  it("accepts local Supabase over HTTP", () => {
    expect(
      parseSupabasePublicEnv({
        NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54321",
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "publishable-key",
      }).url,
    ).toBe("http://127.0.0.1:54321");
  });

  it("rejects non-local HTTP URLs without leaking their value", () => {
    const unsafeUrl = "http://example.com/private-path";

    expect(() =>
      parseSupabasePublicEnv({
        NEXT_PUBLIC_SUPABASE_URL: unsafeUrl,
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "publishable-key",
      }),
    ).toThrow("NEXT_PUBLIC_SUPABASE_URL must use HTTPS");

    try {
      parseSupabasePublicEnv({
        NEXT_PUBLIC_SUPABASE_URL: unsafeUrl,
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "publishable-key",
      });
    } catch (error) {
      expect(String(error)).not.toContain(unsafeUrl);
    }
  });

  it("rejects incomplete configuration", () => {
    expect(() =>
      parseSupabasePublicEnv({
        NEXT_PUBLIC_SUPABASE_URL: "https://project.supabase.co",
      }),
    ).toThrow("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
  });

  it("supports legacy non-public names during migration", () => {
    expect(
      parseSupabasePublicEnv({
        SUPABASE_URL: "https://project.supabase.co",
        SUPABASE_PUBLISHABLE_KEY: "publishable-key",
      }),
    ).toEqual({
      url: "https://project.supabase.co",
      publishableKey: "publishable-key",
    });
  });
});

describe("parseSupabaseSecretEnv", () => {
  it("prefers the current secret key", () => {
    expect(
      parseSupabaseSecretEnv({
        SUPABASE_SECRET_KEY: "current-secret",
        SUPABASE_SERVICE_ROLE_KEY: "legacy-secret",
      }),
    ).toEqual({ secretKey: "current-secret" });
  });

  it("supports the legacy service-role key during migration", () => {
    expect(
      parseSupabaseSecretEnv({
        SUPABASE_SERVICE_ROLE_KEY: "legacy-secret",
      }),
    ).toEqual({ secretKey: "legacy-secret" });
  });

  it("rejects missing secret configuration", () => {
    expect(() => parseSupabaseSecretEnv({})).toThrow(
      "SUPABASE_SECRET_KEY",
    );
  });
});
