import type { PublicNote } from "@/features/notes/model/types";

type NotesResponse = { notes: PublicNote[] };

export async function listNotes(): Promise<PublicNote[]> {
  const response = await fetch("/api/notes", { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`notes_list_failed:${response.status}`);
  }

  const body = (await response.json()) as NotesResponse;
  return body.notes;
}
