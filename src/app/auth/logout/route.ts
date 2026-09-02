import { NextRequest, NextResponse } from "next/server";

import { getApplicationOrigin } from "@/lib/supabase/env";
import { createResponseSupabaseClient } from "@/lib/supabase/nextResponse";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const origin = getApplicationOrigin();
  const response = NextResponse.redirect(new URL("/gui", origin));
  const supabase = createResponseSupabaseClient(request, response);

  await supabase.auth.signOut();
  return response;
}
