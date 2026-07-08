import { NextResponse } from "next/server";

import { getApplicationOrigin } from "@/shared/lib/supabase/env";

export const MAX_JSON_BYTES = 8 * 1024;

export function rejectInvalidOrigin(request: Request): NextResponse | null {
  const origin = request.headers.get("origin");
  const requestOrigin = new URL(request.url).origin;
  if (origin !== requestOrigin && origin !== getApplicationOrigin()) {
    return NextResponse.json({ error: "forbidden_origin" }, { status: 403 });
  }

  return null;
}

export function rejectInvalidJsonRequest(
  request: Request,
): NextResponse | null {
  const contentType = request.headers
    .get("content-type")
    ?.split(";")[0]
    ?.trim();

  if (contentType !== "application/json") {
    return NextResponse.json(
      { error: "unsupported_media_type" },
      { status: 415 },
    );
  }

  const contentLength = request.headers.get("content-length");

  if (contentLength === null || !/^\d+$/.test(contentLength)) {
    return NextResponse.json(
      { error: "content_length_required" },
      { status: 411 },
    );
  }

  if (Number(contentLength) > MAX_JSON_BYTES) {
    return NextResponse.json(
      { error: "payload_too_large" },
      { status: 413 },
    );
  }

  return null;
}
