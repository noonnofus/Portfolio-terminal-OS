import { NextRequest, NextResponse } from "next/server";

import type { NoteSortDirection } from "@/features/notes/model/types";
import { listNotes } from "@/features/notes/server/noteRepository";

export const dynamic = "force-dynamic";

function parseSortDirection(request: NextRequest): NoteSortDirection {
  return request.nextUrl.searchParams.get("sort") === "asc" ? "asc" : "desc";
}

export async function GET(request: NextRequest) {
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
}
