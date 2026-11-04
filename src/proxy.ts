import { type NextRequest, NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { REQUEST_LANGUAGE_HEADER } from "@/lib/i18n/language";
import { parseDesktopUrl } from "@/app/desktop/lib/parseDesktopAppTarget";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const defaultLanguage = pathname === "/en" || pathname.startsWith("/en/") ? "en" : "ko";
  const language = pathname === "/desktop" || pathname === "/en/desktop"
    ? parseDesktopUrl(request.nextUrl.searchParams, defaultLanguage).lang
    : defaultLanguage;
  // Always derive this internal header from the URL, overriding client input.
  request.headers.set(REQUEST_LANGUAGE_HEADER, language);
  const isPublicDesktopRead =
    (pathname === "/" || pathname === "/en" ||
      request.nextUrl.pathname.startsWith("/desktop") ||
      request.nextUrl.pathname.startsWith("/en/desktop")) &&
    (request.method === "GET" || request.method === "HEAD");

  if (isPublicDesktopRead) {
    return NextResponse.next({ request: { headers: request.headers } });
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });
  const supabase = createSupabaseServerClient({
    getAll: () => request.cookies.getAll(),
    setAll: (cookiesToSet, headersToSet) => {
      for (const { name, value } of cookiesToSet) {
        request.cookies.set(name, value);
      }

      response = NextResponse.next({
        request: {
          headers: request.headers,
        },
      });

      for (const { name, options, value } of cookiesToSet) {
        response.cookies.set(name, value, options);
      }

      for (const [name, value] of Object.entries(headersToSet)) {
        response.headers.set(name, value);
      }
    },
  });

  await supabase.auth.getClaims();
  return response;
}

export const config = {
  matcher: [
    "/",
    "/en",
    "/desktop/:path*",
    "/en/desktop/:path*",
    "/api/auth/viewer",
    "/api/account",
  ],
};
