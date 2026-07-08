import { NextRequest, NextResponse } from "next/server";

import { requireViewer } from "@/features/auth/server/requireUser";
import { getUserPreferences } from "@/features/user-preferences/server/preferenceRepository";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const viewer = await requireViewer(request);
  if (viewer === null) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const preferences = await getUserPreferences(viewer.accountId);
  return NextResponse.json(
    { preferences },
    {
      headers: {
        "Cache-Control": "private, no-store",
      },
    },
  );
}
