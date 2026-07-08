import { NextRequest, NextResponse } from "next/server";

import { requireViewer } from "@/features/auth/server/requireUser";
import { listNotes } from "@/features/notes/server/noteRepository";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const viewer = await requireViewer(request);
  const notes = await listNotes({
    actor: viewer,
    cursor: null,
    limit: 50,
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
