import "server-only";

import type { NextRequest } from "next/server";

import type { Viewer } from "@/features/auth/model/viewer";
import { ensureUserAccount } from "@/features/auth/server/getViewer";
import { createSupabaseRequestClient } from "@/shared/lib/supabase/server";

export async function requireViewer(
  request: NextRequest,
): Promise<Extract<Viewer, { status: "authenticated" }> | null> {
  const supabase = createSupabaseRequestClient(request);
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || user === null || user.is_anonymous) {
    return null;
  }

  const account = await ensureUserAccount(user);

  return {
    status: "authenticated",
    accountId: account.id,
    displayName: account.display_name,
    avatarUrl: null,
    role: account.role,
  };
}
