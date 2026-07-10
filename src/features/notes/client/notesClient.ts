import type {
  NoteSortDirection,
  PublicNote,
} from "@/features/notes/model/types";

type NotesResponse = { notes: PublicNote[] };

export async function listNotes(
  sortDirection: NoteSortDirection = "asc",
  signal?: AbortSignal,
): Promise<PublicNote[]> {
  const response = await fetch(`/api/notes?sort=${sortDirection}`, {
    cache: "no-store",
    signal,
  });
  if (!response.ok) {
    throw new Error(`notes_list_failed:${response.status}`);
  }

  const body = (await response.json()) as NotesResponse;
  return body.notes;
}
