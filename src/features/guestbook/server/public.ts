import "server-only";

import type { ActionResult } from "@/features/guestbook/types/actionResult";
import type { PublicNote } from "@/features/guestbook/types/noteTypes";
import type { NoteActor } from "@/features/guestbook/server/noteRepository";
import {
  assertCreateRateLimit,
  createNote,
  deleteNote,
  updateNote,
} from "@/features/guestbook/server/noteRepository";
import { parseNoteContentInput } from "@/features/guestbook/utils/noteSchemas";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function writesEnabled() {
  return process.env.NOTES_WRITE_ENABLED === "true";
}

function parseNoteId(noteId: string) {
  return UUID_PATTERN.test(noteId) ? noteId : null;
}

export async function createGuestbookNote(
  actor: NoteActor,
  input: { content: string },
): Promise<ActionResult<PublicNote>> {
  if (!writesEnabled()) return { ok: false, status: 503, error: "writes_disabled" };

  const content = parseNoteContentInput(input);
  if (content === null) return { ok: false, status: 400, error: "invalid_input" };
  if (!(await assertCreateRateLimit(actor.accountId))) {
    return { ok: false, status: 429, error: "rate_limited" };
  }

  return { ok: true, data: await createNote(actor, content) };
}

export async function updateGuestbookNote(
  actor: NoteActor,
  input: { noteId: string; content: string },
): Promise<ActionResult<PublicNote>> {
  if (!writesEnabled()) return { ok: false, status: 503, error: "writes_disabled" };

  const noteId = parseNoteId(input.noteId);
  const content = parseNoteContentInput({ content: input.content });
  if (noteId === null || content === null) {
    return { ok: false, status: 400, error: "invalid_input" };
  }

  const result = await updateNote(actor, noteId, content);
  if (result.status === "not_found") return { ok: false, status: 404, error: "not_found" };
  if (result.status === "forbidden") return { ok: false, status: 403, error: "forbidden" };
  return { ok: true, data: result.note };
}

export async function deleteGuestbookNote(
  actor: NoteActor,
  input: { noteId: string },
): Promise<ActionResult> {
  if (!writesEnabled()) return { ok: false, status: 503, error: "writes_disabled" };

  const noteId = parseNoteId(input.noteId);
  if (noteId === null) return { ok: false, status: 400, error: "invalid_input" };

  const result = await deleteNote(actor, noteId);
  if (result.status === "not_found") return { ok: false, status: 404, error: "not_found" };
  if (result.status === "forbidden") return { ok: false, status: 403, error: "forbidden" };
  return { ok: true, data: undefined };
}
