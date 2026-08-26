import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const limit = vi.hoisted(() => vi.fn());
const select = vi.hoisted(() => vi.fn(() => ({ limit })));
const from = vi.hoisted(() => vi.fn(() => ({ select })));

vi.mock("server-only", () => ({}));
vi.mock("@/shared/lib/supabase/admin", () => ({
  createSupabaseAdminClient: () => ({ from }),
}));

import { GET } from "@/app/api/cron/supabase-keepalive/route";

function createRequest(secret?: string) {
  return new NextRequest(
    "https://portfolio.example/api/cron/supabase-keepalive",
    {
      headers: secret ? { authorization: `Bearer ${secret}` } : undefined,
    },
  );
}

describe("Supabase keepalive route", () => {
  beforeEach(() => {
    vi.stubEnv("CRON_SECRET", "cron-secret");
    limit.mockReset();
    select.mockClear();
    from.mockClear();
    limit.mockResolvedValue({ data: [{ id: "wallpaper" }], error: null });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("rejects requests without the configured bearer secret", async () => {
    const response = await GET(createRequest());

    expect(response.status).toBe(401);
    expect(from).not.toHaveBeenCalled();
  });

  it("rejects requests when CRON_SECRET is not configured", async () => {
    vi.stubEnv("CRON_SECRET", "");

    const response = await GET(createRequest("cron-secret"));

    expect(response.status).toBe(401);
    expect(from).not.toHaveBeenCalled();
  });

  it("performs one small database read", async () => {
    const response = await GET(createRequest("cron-secret"));

    expect(response.status).toBe(200);
    expect(from).toHaveBeenCalledWith("wallpapers");
    expect(select).toHaveBeenCalledWith("id");
    expect(limit).toHaveBeenCalledWith(1);
    expect(response.headers.get("cache-control")).toBe("private, no-store");
  });

  it("returns 503 without exposing database details", async () => {
    limit.mockResolvedValue({
      data: null,
      error: { message: "private database detail" },
    });

    const response = await GET(createRequest("cron-secret"));
    const body = await response.text();

    expect(response.status).toBe(503);
    expect(body).not.toContain("private database detail");
  });

  it("configures three separate once-daily Vercel schedules", () => {
    const config = JSON.parse(
      readFileSync(resolve(process.cwd(), "vercel.json"), "utf8"),
    ) as {
      crons: Array<{ path: string; schedule: string }>;
    };

    expect(config.crons).toEqual([
      {
        path: "/api/cron/supabase-keepalive",
        schedule: "0 0 * * *",
      },
      {
        path: "/api/cron/supabase-keepalive",
        schedule: "0 8 * * *",
      },
      {
        path: "/api/cron/supabase-keepalive",
        schedule: "0 16 * * *",
      },
    ]);
  });
});
