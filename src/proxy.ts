import { type NextRequest, NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function proxy(request: NextRequest) {
  const isPublicDesktopRead =
    (request.nextUrl.pathname.startsWith("/desktop") ||
      request.nextUrl.pathname.startsWith("/en/desktop")) &&
    (request.method === "GET" || request.method === "HEAD");

  if (isPublicDesktopRead) {
    return NextResponse.next();
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
    "/desktop/:path*",
    "/en/desktop/:path*",
    "/api/auth/viewer",
    "/api/account",
  ],
};
