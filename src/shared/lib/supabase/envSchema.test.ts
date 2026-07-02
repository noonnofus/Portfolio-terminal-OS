import { describe, expect, it } from "vitest";

import {
  parseSupabasePublicEnv,
  parseSupabaseSecretEnv,
} from "@/shared/lib/supabase/envSchema";

describe("parseSupabasePublicEnv", () => {
  it("accepts a hosted HTTPS project", () => {
    expect(
      parseSupabasePublicEnv({
        SUPABASE_URL: "https://project.supabase.co/path",
        SUPABASE_PUBLISHABLE_KEY: "publishable-key",
      }),
    ).toEqual({
      url: "https://project.supabase.co",
      publishableKey: "publishable-key",
    });
  });

  it("accepts local Supabase over HTTP", () => {
    expect(
      parseSupabasePublicEnv({
        SUPABASE_URL: "http://127.0.0.1:54321",
        SUPABASE_PUBLISHABLE_KEY: "publishable-key",
      }).url,
    ).toBe("http://127.0.0.1:54321");
  });

  it("rejects non-local HTTP URLs without leaking their value", () => {
    const unsafeUrl = "http://example.com/private-path";

    expect(() =>
      parseSupabasePublicEnv({
        SUPABASE_URL: unsafeUrl,
        SUPABASE_PUBLISHABLE_KEY: "publishable-key",
      }),
    ).toThrow("SUPABASE_URL must use HTTPS");

    try {
      parseSupabasePublicEnv({
        SUPABASE_URL: unsafeUrl,
        SUPABASE_PUBLISHABLE_KEY: "publishable-key",
      });
    } catch (error) {
      expect(String(error)).not.toContain(unsafeUrl);
    }
  });

  it("rejects incomplete configuration", () => {
    expect(() =>
      parseSupabasePublicEnv({
        SUPABASE_URL: "https://project.supabase.co",
      }),
    ).toThrow("SUPABASE_PUBLISHABLE_KEY");
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
