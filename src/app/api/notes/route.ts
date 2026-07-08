import { NextRequest, NextResponse } from "next/server";

import { requireViewer } from "@/features/auth/server/requireUser";
import { listNotes } from "@/features/notes/server/noteRepository";

export const dynamic = "force-dynamic";

function hasSupabaseAuthCookie(request: NextRequest): boolean {
  return request.cookies
    .getAll()
    .some(
      ({ name }) => name.startsWith("sb-") && name.includes("-auth-token"),
    );
}

export async function GET(request: NextRequest) {
  const viewer = hasSupabaseAuthCookie(request)
    ? await requireViewer(request)
    : null;
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
