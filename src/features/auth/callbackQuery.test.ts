import { describe, expect, it } from "vitest";

import { parseAuthCallbackQuery } from "@/features/auth/callbackQuery";

describe("parseAuthCallbackQuery", () => {
  it("accepts one authorization code", () => {
    expect(
      parseAuthCallbackQuery(
        new URL("https://portfolio.test/auth/callback?code=valid-code"),
      ),
    ).toEqual({ code: "valid-code", type: "code" });
  });

  it.each([
    "https://portfolio.test/auth/callback",
    "https://portfolio.test/auth/callback?code=",
    "https://portfolio.test/auth/callback?code=one&code=two",
    "https://portfolio.test/auth/callback?code=one&next=/admin",
    "https://portfolio.test/auth/callback?error=access_denied",
    "https://portfolio.test/auth/callback?error_code=provider_error",
    "https://portfolio.test/auth/callback?error_description=sensitive",
    "https://portfolio.test/auth/callback?code=one&error=access_denied",
  ])("rejects malformed or error callbacks: %s", (value) => {
    expect(parseAuthCallbackQuery(new URL(value))).toEqual({ type: "error" });
  });

  it("rejects oversized callback queries", () => {
    const oversizedCode = "a".repeat(2_048);

    expect(
      parseAuthCallbackQuery(
        new URL(
          `https://portfolio.test/auth/callback?code=${oversizedCode}`,
        ),
      ),
    ).toEqual({ type: "error" });
  });
});
