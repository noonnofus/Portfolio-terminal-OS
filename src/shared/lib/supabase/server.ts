import "server-only";

import {
  createServerClient,
  type CookieMethodsServer,
} from "@supabase/ssr";

import { getSupabasePublicEnv } from "@/shared/lib/supabase/env";

export function createSupabaseServerClient(
  cookieMethods: CookieMethodsServer,
) {
  const { publishableKey, url } = getSupabasePublicEnv();

  return createServerClient(url, publishableKey, {
    cookies: cookieMethods,
  });
}
