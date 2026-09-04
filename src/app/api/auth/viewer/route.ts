import { NextRequest, NextResponse } from "next/server";

import { getViewerForUser } from "@/features/auth/server/getViewer";
import { createSupabaseRequestClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseRequestClient(request);
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      return NextResponse.json(
        { error: "viewer_unavailable" },
        {
          status: 503,
          headers: { "Cache-Control": "private, no-store" },
        },
      );
    }

    const viewer = await getViewerForUser(user);
    return NextResponse.json(viewer, {
      headers: {
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "viewer_unavailable" },
      {
        status: 503,
        headers: { "Cache-Control": "private, no-store" },
      },
    );
  }
}
