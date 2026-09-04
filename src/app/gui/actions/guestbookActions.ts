"use server";

import { requireCurrentViewer } from "@/features/auth/server/public";
import {
  createGuestbookNote,
  deleteGuestbookNote,
  updateGuestbookNote,
} from "@/features/guestbook/server/public";

async function getActor() {
  const viewer = await requireCurrentViewer();
  if (viewer === null) return null;

  return {
    accountId: viewer.accountId,
    displayName: viewer.displayName,
    role: viewer.role,
  };
}

export async function createGuestbookNoteAction(input: { content: string }) {
  const actor = await getActor();
  return actor === null
    ? { ok: false as const, status: 401 as const, error: "unauthorized" }
    : createGuestbookNote(actor, input);
}

export async function updateGuestbookNoteAction(input: { noteId: string; content: string }) {
  const actor = await getActor();
  return actor === null
    ? { ok: false as const, status: 401 as const, error: "unauthorized" }
    : updateGuestbookNote(actor, input);
}

export async function deleteGuestbookNoteAction(input: { noteId: string }) {
  const actor = await getActor();
  return actor === null
    ? { ok: false as const, status: 401 as const, error: "unauthorized" }
    : deleteGuestbookNote(actor, input);
}
