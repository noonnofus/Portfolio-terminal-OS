import { NextRequest, NextResponse } from "next/server";

import { requireViewer } from "@/features/auth/server/requireUser";
import {
  rejectInvalidJsonRequest,
  rejectInvalidOrigin,
} from "@/shared/lib/http/requestGuards";
import { createSupabaseAdminClient } from "@/shared/lib/supabase/admin";

export const dynamic = "force-dynamic";

function parseDeleteAccountInput(value: unknown): boolean {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.keys(value).length === 1 &&
    (value as Record<string, unknown>).confirmText === "DELETE"
  );
}

export async function DELETE(request: NextRequest) {
  const originError = rejectInvalidOrigin(request);
  if (originError !== null) return originError;

  const jsonError = rejectInvalidJsonRequest(request);
  if (jsonError !== null) return jsonError;

  const viewer = await requireViewer(request);
  if (viewer === null) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  if (!parseDeleteAccountInput(await request.json())) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.auth.admin.deleteUser(viewer.accountId);

  if (error) {
    return NextResponse.json(
      { error: "account_delete_failed" },
      { status: 500 },
    );
  }

  return new NextResponse(null, { status: 204 });
}
