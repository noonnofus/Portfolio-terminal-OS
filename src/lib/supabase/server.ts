import "server-only";

import {
  createServerClient,
  type CookieOptions,
  type CookieMethodsServer,
} from "@supabase/ssr";

import type { Database } from "@/lib/supabase/database.types";
import {
  getApplicationOrigin,
  getSupabasePublicEnv,
} from "@/lib/supabase/env";

const SUPABASE_REQUEST_TIMEOUT_MS = 5_000;

function fetchWithSupabaseTimeout(
  input: RequestInfo | URL,
  init?: RequestInit,
) {
  const timeoutSignal = AbortSignal.timeout(SUPABASE_REQUEST_TIMEOUT_MS);
  const signal = init?.signal
    ? AbortSignal.any([init.signal, timeoutSignal])
    : timeoutSignal;

  return fetch(input, { ...init, signal });
}

export function getSupabaseCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: new URL(getApplicationOrigin()).protocol === "https:",
  };
}

export function createSupabaseServerClient(
  cookieMethods: CookieMethodsServer,
) {
  const { publishableKey, url } = getSupabasePublicEnv();

  return createServerClient<Database>(url, publishableKey, {
    global: {
      fetch: fetchWithSupabaseTimeout,
    },
    cookieOptions: getSupabaseCookieOptions(),
    cookies: cookieMethods,
  });
}

export function createSupabaseRequestClient(
  request: { cookies: { getAll: () => ReturnType<CookieMethodsServer["getAll"]> } },
) {
  return createSupabaseServerClient({
    getAll: () => request.cookies.getAll(),
    setAll: () => {
      // Route handlers are preceded by proxy.ts for auth refresh.
    },
  });
}
