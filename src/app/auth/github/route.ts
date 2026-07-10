import { NextRequest, NextResponse } from "next/server";

import { getApplicationOrigin } from "@/shared/lib/supabase/env";
import { createResponseSupabaseClient } from "@/shared/lib/supabase/nextResponse";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const origin = getApplicationOrigin();
  const response = NextResponse.redirect(new URL("/gui", origin));
  const supabase = createResponseSupabaseClient(request, response);
  const redirectTo = new URL("/auth/callback", origin);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: redirectTo.toString(),
      scopes: "",
      skipBrowserRedirect: true,
    },
  });

  if (error || !data.url) {
    return NextResponse.redirect(new URL("/auth/auth-error", origin));
  }

  response.headers.set("location", data.url);
  return response;
}
