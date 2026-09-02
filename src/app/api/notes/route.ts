import { NextRequest, NextResponse } from "next/server";

import type { NoteSortDirection } from "@/features/guestbook/types/noteTypes";
import { listNotes } from "@/features/guestbook/server/noteRepository";

export const dynamic = "force-dynamic";

function parseSortDirection(request: NextRequest): NoteSortDirection {
  return request.nextUrl.searchParams.get("sort") === "asc" ? "asc" : "desc";
}

export async function GET(request: NextRequest) {
  try {
    const notes = await listNotes({
      cursor: null,
      limit: 50,
      sortDirection: parseSortDirection(request),
    });

    return NextResponse.json(
      { notes },
      {
        headers: {
          "Cache-Control": "private, no-store",
        },
      },
    );
  } catch {
    return NextResponse.json(
      { error: "notes_unavailable" },
      {
        status: 503,
        headers: { "Cache-Control": "private, no-store" },
      },
    );
  }
}
