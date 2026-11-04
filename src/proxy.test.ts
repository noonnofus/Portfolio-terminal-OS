import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const getClaims = vi.hoisted(() => vi.fn());
const createSupabaseServerClient = vi.hoisted(() =>
  vi.fn(() => ({ auth: { getClaims } })),
);

vi.mock("server-only", () => ({}));
vi.mock("@/lib/supabase/server", () => ({
  createSupabaseServerClient,
}));

import { config, proxy } from "@/proxy";
import { REQUEST_LANGUAGE_HEADER } from "@/lib/i18n/language";

describe("proxy", () => {
  beforeEach(() => {
    getClaims.mockReset();
    createSupabaseServerClient.mockClear();
    getClaims.mockResolvedValue({ data: { claims: null }, error: null });
  });

  it.each([
    ["GET", "/"],
    ["GET", "/en"],
    ["GET", "/desktop"],
    ["HEAD", "/desktop"],
    ["GET", "/en/desktop"],
    ["HEAD", "/en/desktop"],
  ])(
    "lets public Desktop %s requests to %s render without Supabase",
    async (method, pathname) => {
      const response = await proxy(
        new NextRequest(`https://portfolio.example${pathname}`, { method }),
      );

      expect(response.status).toBe(200);
      expect(createSupabaseServerClient).not.toHaveBeenCalled();
    },
  );

  it("refreshes auth for Desktop Server Action requests", async () => {
    await proxy(
      new NextRequest("https://portfolio.example/desktop", { method: "POST" }),
    );

    expect(getClaims).toHaveBeenCalledOnce();
  });

  it.each([
    ["/", "ko"], ["/en", "en"], ["/desktop", "ko"],
    ["/en/desktop?app=project&slug=kepco", "en"],
    ["/desktop?lang=en", "en"], ["/en/desktop?lang=ko", "ko"],
    ["/en/desktop?lang=invalid", "en"],
    [`/en/desktop?lang=ko&extra=${"a".repeat(256)}`, "en"],
  ])("forwards URL language for %s and overrides client headers", async (path, language) => {
    const response = await proxy(new NextRequest(`https://portfolio.example${path}`, {
      headers: { [REQUEST_LANGUAGE_HEADER]: language === "en" ? "ko" : "en" },
    }));
    expect(response.headers.get(`x-middleware-request-${REQUEST_LANGUAGE_HEADER}`)).toBe(language);
    expect(createSupabaseServerClient).not.toHaveBeenCalled();
  });

  it("matches public entry pages and account-related backend routes", () => {
    expect(config.matcher).toEqual([
      "/",
      "/en",
      "/desktop/:path*",
      "/en/desktop/:path*",
      "/api/auth/viewer",
      "/api/account",
    ]);
  });
});
