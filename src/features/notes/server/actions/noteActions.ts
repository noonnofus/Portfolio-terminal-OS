"use server";

import type { ActionResult } from "@/features/notes/model/actionResult";
import { parseNoteContentInput } from "@/features/notes/model/noteSchemas";
import type { PublicNote } from "@/features/notes/model/types";
import { requireCurrentViewer } from "@/features/auth/server/requireCurrentViewer";
import {
  assertCreateRateLimit,
  createNote,
  deleteNote,
  updateNote,
} from "@/features/notes/server/noteRepository";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function writesEnabled() {
  return process.env.NOTES_WRITE_ENABLED === "true";
}

function validateContent(content: string) {
  return parseNoteContentInput({ content });
}

function validateNoteId(noteId: string) {
  return UUID_PATTERN.test(noteId) ? noteId : null;
}

export async function createNoteAction({
  content,
}: {
  content: string;
}): Promise<ActionResult<PublicNote>> {
  if (!writesEnabled()) {
    return { ok: false, status: 503, error: "writes_disabled" };
  }

  const viewer = await requireCurrentViewer();
  if (viewer === null) {
    return { ok: false, status: 401, error: "unauthorized" };
  }

  const parsedContent = validateContent(content);
  if (parsedContent === null) {
    return { ok: false, status: 400, error: "invalid_input" };
  }

  if (!(await assertCreateRateLimit(viewer.accountId))) {
    return { ok: false, status: 429, error: "rate_limited" };
  }

  const note = await createNote(viewer, parsedContent);
  return { ok: true, data: note };
}

export async function updateNoteAction({
  noteId,
  content,
}: {
  noteId: string;
  content: string;
}): Promise<ActionResult<PublicNote>> {
  if (!writesEnabled()) {
    return { ok: false, status: 503, error: "writes_disabled" };
  }

  const parsedNoteId = validateNoteId(noteId);
  const parsedContent = validateContent(content);
  if (parsedNoteId === null || parsedContent === null) {
    return { ok: false, status: 400, error: "invalid_input" };
  }

  const viewer = await requireCurrentViewer();
  if (viewer === null) {
    return { ok: false, status: 401, error: "unauthorized" };
  }

  const result = await updateNote(viewer, parsedNoteId, parsedContent);
  if (result.status === "not_found") {
    return { ok: false, status: 404, error: "not_found" };
  }
  if (result.status === "forbidden") {
    return { ok: false, status: 403, error: "forbidden" };
  }

  return { ok: true, data: result.note };
}

export async function deleteNoteAction({
  noteId,
}: {
  noteId: string;
}): Promise<ActionResult> {
  if (!writesEnabled()) {
    return { ok: false, status: 503, error: "writes_disabled" };
  }

  const parsedNoteId = validateNoteId(noteId);
  if (parsedNoteId === null) {
    return { ok: false, status: 400, error: "invalid_input" };
  }

  const viewer = await requireCurrentViewer();
  if (viewer === null) {
    return { ok: false, status: 401, error: "unauthorized" };
  }

  const result = await deleteNote(viewer, parsedNoteId);
  if (result.status === "not_found") {
    return { ok: false, status: 404, error: "not_found" };
  }
  if (result.status === "forbidden") {
    return { ok: false, status: 403, error: "forbidden" };
  }

  return { ok: true, data: undefined };
}
