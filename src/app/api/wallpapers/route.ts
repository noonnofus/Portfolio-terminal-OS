import { NextResponse } from "next/server";

import { listEnabledWallpapers } from "@/features/wallpapers/server/wallpaperRepository";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const wallpapers = await listEnabledWallpapers();
    return NextResponse.json(
      { wallpapers },
      {
        headers: {
          "Cache-Control": "public, max-age=300",
        },
      },
    );
  } catch {
    return NextResponse.json(
      { error: "wallpapers_unavailable" },
      {
        status: 503,
        headers: { "Cache-Control": "private, no-store" },
      },
    );
  }
}
