import { afterEach, expect, it, vi } from "vitest";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

it.each([undefined, "", "   "])("requires the public canonical origin (%s)", async value => {
  vi.resetModules();
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", value);
  await expect(import("./siteMetadata")).rejects.toThrow("NEXT_PUBLIC_SITE_URL is required");
});

it("rejects an invalid URL", async () => {
  vi.resetModules();
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "not-a-url");
  await expect(import("./siteMetadata")).rejects.toThrow();
});

it.each(["https://portfolio.example", "https://portfolio.example/", " https://portfolio.example/ "])(
  "normalizes the canonical origin (%s)", async value => {
    vi.resetModules();
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", value);
    const { SITE_URL } = await import("./siteMetadata");
    expect(SITE_URL).toBe("https://portfolio.example");
  },
);
