import "server-only";

import {
  createServerClient,
  type CookieOptions,
  type CookieMethodsServer,
} from "@supabase/ssr";

import type { Database } from "@/shared/lib/supabase/database.types";
import {
  getApplicationOrigin,
  getSupabasePublicEnv,
} from "@/shared/lib/supabase/env";

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
