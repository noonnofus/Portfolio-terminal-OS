import { NextRequest, NextResponse } from "next/server";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const responseHeaders = {
  "Cache-Control": "private, no-store",
};

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (
    !cronSecret ||
    request.headers.get("authorization") !== `Bearer ${cronSecret}`
  ) {
    return NextResponse.json(
      { error: "unauthorized" },
      { status: 401, headers: responseHeaders },
    );
  }

  try {
    const supabase = createSupabaseAdminClient();
    const { error } = await supabase.from("wallpapers").select("id").limit(1);

    if (error) {
      return NextResponse.json(
        { error: "supabase_unavailable" },
        { status: 503, headers: responseHeaders },
      );
    }

    return NextResponse.json(
      { ok: true },
      { headers: responseHeaders },
    );
  } catch {
    return NextResponse.json(
      { error: "supabase_unavailable" },
      { status: 503, headers: responseHeaders },
    );
  }
}
