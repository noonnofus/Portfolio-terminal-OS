import "server-only";

import { createSupabaseAdminClient } from "@/shared/lib/supabase/admin";
import type { NoteRow, PublicNote } from "@/features/notes/model/types";

export type NoteActor = {
  accountId: string;
  displayName: string;
  role: "user" | "admin";
};

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_NOTES = 10;

function toPublicNote(row: NoteRow, actor: NoteActor | null): PublicNote {
  const isOwner =
    row.author_account_id !== null &&
    actor !== null &&
    row.author_account_id === actor.accountId;
  const isAdmin = actor?.role === "admin";

  return {
    id: row.id,
    authorName:
      row.author_account_id === null
        ? "[DELETED]"
        : row.author_name_snapshot,
    content: row.content,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    canEdit: isOwner,
    canDelete: isOwner || isAdmin,
  };
}

export async function listNotes({
  actor,
  cursor,
  limit,
}: {
  actor: NoteActor | null;
  cursor: string | null;
  limit: number;
}) {
  const supabase = createSupabaseAdminClient();
  const safeLimit = Math.min(Math.max(limit, 1), 50);
  let query = supabase
    .from("notes")
    .select(
      "id, author_account_id, author_name_snapshot, content, created_at, updated_at",
    )
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .limit(safeLimit);

  if (cursor !== null && cursor.length <= 64) {
    query = query.lt("created_at", cursor);
  }

  const { data, error } = await query;
  if (error) throw new Error("Failed to list notes");

  return (data as NoteRow[]).map((row) => toPublicNote(row, actor));
}

export async function assertCreateRateLimit(accountId: string) {
  const supabase = createSupabaseAdminClient();
  const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();
  const { count, error } = await supabase
    .from("notes")
    .select("id", { count: "exact", head: true })
    .eq("author_account_id", accountId)
    .gte("created_at", since);

  if (error) throw new Error("Failed to check note rate limit");
  return (count ?? 0) < RATE_LIMIT_MAX_NOTES;
}

export async function createNote(actor: NoteActor, content: string) {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("notes")
    .insert({
      author_account_id: actor.accountId,
      author_name_snapshot: actor.displayName,
      content,
    })
    .select(
      "id, author_account_id, author_name_snapshot, content, created_at, updated_at",
    )
    .single();

  if (error || data === null) throw new Error("Failed to create note");
  return toPublicNote(data as NoteRow, actor);
}

export async function updateNote(
  actor: NoteActor,
  noteId: string,
  content: string,
) {
  const supabase = createSupabaseAdminClient();
  const existing = await getNoteById(noteId);
  if (existing === null) return { status: "not_found" as const };
  if (
    actor.role !== "admin" &&
    existing.author_account_id !== actor.accountId
  ) {
    return { status: "forbidden" as const };
  }

  const { data, error } = await supabase
    .from("notes")
    .update({ content, updated_at: new Date().toISOString() })
    .eq("id", noteId)
    .select(
      "id, author_account_id, author_name_snapshot, content, created_at, updated_at",
    )
    .single();

  if (error || data === null) throw new Error("Failed to update note");
  return { status: "ok" as const, note: toPublicNote(data as NoteRow, actor) };
}

export async function deleteNote(actor: NoteActor, noteId: string) {
  const supabase = createSupabaseAdminClient();
  const existing = await getNoteById(noteId);
  if (existing === null) return { status: "not_found" as const };
  if (
    actor.role !== "admin" &&
    existing.author_account_id !== actor.accountId
  ) {
    return { status: "forbidden" as const };
  }

  const { error } = await supabase.from("notes").delete().eq("id", noteId);
  if (error) throw new Error("Failed to delete note");
  return { status: "ok" as const };
}

async function getNoteById(noteId: string): Promise<NoteRow | null> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("notes")
    .select(
      "id, author_account_id, author_name_snapshot, content, created_at, updated_at",
    )
    .eq("id", noteId)
    .maybeSingle();

  if (error) throw new Error("Failed to read note");
  return data as NoteRow | null;
}
