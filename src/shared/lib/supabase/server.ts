import "server-only";

import {
  createServerClient,
  type CookieOptions,
  type CookieMethodsServer,
} from "@supabase/ssr";

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

  return createServerClient(url, publishableKey, {
    cookieOptions: getSupabaseCookieOptions(),
    cookies: cookieMethods,
  });
}
