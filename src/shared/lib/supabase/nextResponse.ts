import "server-only";

import type { NextRequest, NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/shared/lib/supabase/server";

export function createResponseSupabaseClient(
  request: NextRequest,
  response: NextResponse,
) {
  return createSupabaseServerClient({
    getAll: () => request.cookies.getAll(),
    setAll: (cookiesToSet, headersToSet) => {
      for (const { name, options, value } of cookiesToSet) {
        response.cookies.set(name, value, options);
      }

      for (const [name, value] of Object.entries(headersToSet)) {
        response.headers.set(name, value);
      }
    },
  });
}
