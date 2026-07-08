import "server-only";

import type { User } from "@supabase/supabase-js";

import type { Viewer } from "@/features/auth/model/viewer";
import { createSupabaseAdminClient } from "@/shared/lib/supabase/admin";

type UserAccountRow = {
  id: string;
  role: "user" | "admin";
  display_name: string;
};

function stringFromMetadata(
  metadata: unknown,
  keys: readonly string[],
): string | null {
  if (typeof metadata !== "object" || metadata === null) return null;
  const record = metadata as Record<string, unknown>;

  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }

  return null;
}

export function getDisplayNameFromUser(user: User): string {
  return (
    stringFromMetadata(user.user_metadata, [
      "name",
      "full_name",
      "preferred_username",
      "user_name",
    ]) ??
    user.email?.split("@")[0] ??
    "GitHub User"
  );
}

function getAvatarUrlFromUser(user: User): string | null {
  const value = stringFromMetadata(user.user_metadata, ["avatar_url", "picture"]);
  if (value === null) return null;

  try {
    const url = new URL(value);
    return url.protocol === "https:" &&
      url.hostname === "avatars.githubusercontent.com"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

export async function ensureUserAccount(user: User): Promise<UserAccountRow> {
  const supabase = createSupabaseAdminClient();
  const displayName = getDisplayNameFromUser(user);
  const configuredAdminUserId =
    process.env.ADMIN_AUTH_USER_ID?.trim() || undefined;
  const { data: existing, error: readError } = await supabase
    .from("user_accounts")
    .select("id, role, display_name")
    .eq("id", user.id)
    .maybeSingle();

  if (readError) {
    throw new Error("Failed to read user account");
  }

  if (existing !== null) {
    const nextRole =
      configuredAdminUserId !== undefined && configuredAdminUserId === user.id
        ? "admin"
        : (existing.role as UserAccountRow["role"]);

    if (existing.display_name === displayName && existing.role === nextRole) {
      return existing as UserAccountRow;
    }

    const { data, error } = await supabase
      .from("user_accounts")
      .update({
        display_name: displayName,
        role: nextRole,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)
      .select("id, role, display_name")
      .single();

    if (error || data === null) {
      throw new Error("Failed to update user account");
    }

    return data as UserAccountRow;
  }

  const { data, error } = await supabase
    .from("user_accounts")
    .insert({
      id: user.id,
      display_name: displayName,
      role:
        configuredAdminUserId !== undefined && configuredAdminUserId === user.id
          ? "admin"
          : "user",
    })
    .select("id, role, display_name")
    .single();

  if (error || data === null) {
    throw new Error("Failed to upsert user account");
  }

  return data as UserAccountRow;
}

export async function getViewerForUser(user: User | null): Promise<Viewer> {
  if (user === null || user.is_anonymous) {
    return { status: "guest" };
  }

  const account = await ensureUserAccount(user);

  return {
    status: "authenticated",
    accountId: account.id,
    displayName: account.display_name,
    avatarUrl: getAvatarUrlFromUser(user),
    role: account.role,
  };
}
