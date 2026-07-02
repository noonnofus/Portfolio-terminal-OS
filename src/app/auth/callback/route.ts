import { NextRequest, NextResponse } from "next/server";

import { parseAuthCallbackQuery } from "@/features/auth/callbackQuery";
import { getApplicationOrigin } from "@/shared/lib/supabase/env";
import { createResponseSupabaseClient } from "@/shared/lib/supabase/nextResponse";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const origin = getApplicationOrigin();
  const callback = parseAuthCallbackQuery(request.nextUrl);

  if (callback.type === "error") {
    return NextResponse.redirect(new URL("/auth/auth-error", origin));
  }

  const response = NextResponse.redirect(new URL("/gui", origin));
  const supabase = createResponseSupabaseClient(request, response);
  const { error: exchangeError } =
    await supabase.auth.exchangeCodeForSession(callback.code);

  if (exchangeError) {
    return NextResponse.redirect(new URL("/auth/auth-error", origin));
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user || user.is_anonymous) {
    await supabase.auth.signOut();
    response.headers.set(
      "location",
      new URL("/auth/auth-error", origin).toString(),
    );
    return response;
  }

  return response;
}
