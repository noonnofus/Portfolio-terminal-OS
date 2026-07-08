import { NextRequest, NextResponse } from "next/server";

import { getViewerForUser } from "@/features/auth/server/getViewer";
import { createSupabaseRequestClient } from "@/shared/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const supabase = createSupabaseRequestClient(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const viewer = await getViewerForUser(user);

  return NextResponse.json(viewer, {
    headers: {
      "Cache-Control": "private, no-store",
    },
  });
}
