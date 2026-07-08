import "server-only";

import { cookies } from "next/headers";

import type { Viewer } from "@/features/auth/model/viewer";
import { ensureUserAccount } from "@/features/auth/server/getViewer";
import { createSupabaseServerClient } from "@/shared/lib/supabase/server";

export async function requireCurrentViewer(): Promise<
  Extract<Viewer, { status: "authenticated" }> | null
> {
  const cookieStore = await cookies();
  const supabase = createSupabaseServerClient({
    getAll: () => cookieStore.getAll(),
    setAll: () => {
      // proxy.ts owns Supabase auth cookie refresh for /gui and actions.
    },
  });
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

export async function requireCurrentUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const supabase = createSupabaseServerClient({
    getAll: () => cookieStore.getAll(),
    setAll: () => {
      // proxy.ts owns Supabase auth cookie refresh for /gui and actions.
    },
  });
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || user === null || user.is_anonymous) {
    return null;
  }

  return user.id;
}
