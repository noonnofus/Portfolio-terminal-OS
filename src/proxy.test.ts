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

describe("proxy", () => {
  beforeEach(() => {
    getClaims.mockReset();
    createSupabaseServerClient.mockClear();
    getClaims.mockResolvedValue({ data: { claims: null }, error: null });
  });

  it.each(["GET", "HEAD"])(
    "lets public GUI %s requests render without Supabase",
    async (method) => {
      const response = await proxy(
        new NextRequest("https://portfolio.example/gui", { method }),
      );

      expect(response.status).toBe(200);
      expect(createSupabaseServerClient).not.toHaveBeenCalled();
    },
  );

  it("refreshes auth for GUI Server Action requests", async () => {
    await proxy(
      new NextRequest("https://portfolio.example/gui", { method: "POST" }),
    );

    expect(getClaims).toHaveBeenCalledOnce();
  });

  it("only matches GUI and account-related backend routes", () => {
    expect(config.matcher).toEqual([
      "/gui/:path*",
      "/api/auth/viewer",
      "/api/account",
    ]);
  });
});
