import { describe, expect, it, vi } from "vitest";

import {
  rejectInvalidJsonRequest,
  rejectInvalidOrigin,
} from "@/shared/lib/http/requestGuards";

vi.mock("server-only", () => ({}));

describe("request guards", () => {
  it("rejects cross-origin mutations", () => {
    vi.stubEnv("APP_ORIGIN", "https://portfolio.example");
    const request = new Request("https://portfolio.example/api/notes", {
      headers: { origin: "https://evil.example" },
    });

    expect(rejectInvalidOrigin(request)?.status).toBe(403);
    vi.unstubAllEnvs();
  });

  it("accepts the current request origin for local aliases", () => {
    vi.stubEnv("APP_ORIGIN", "http://localhost:3000");
    const request = new Request("http://127.0.0.1:3000/api/notes", {
      headers: { origin: "http://127.0.0.1:3000" },
    });

    expect(rejectInvalidOrigin(request)).toBeNull();
    vi.unstubAllEnvs();
  });

  it("rejects missing and oversized JSON content length", () => {
    expect(
      rejectInvalidJsonRequest(
        new Request("https://portfolio.example/api/notes", {
          headers: { "content-type": "application/json" },
        }),
      )?.status,
    ).toBe(411);

    expect(
      rejectInvalidJsonRequest(
        new Request("https://portfolio.example/api/notes", {
          headers: {
            "content-type": "application/json",
            "content-length": "8193",
          },
        }),
      )?.status,
    ).toBe(413);
  });
});
