import type {
  NoteSortDirection,
  PublicNote,
} from "@/features/notes/model/types";

type NotesResponse = { notes: PublicNote[] };

export async function listNotes(
  sortDirection: NoteSortDirection = "asc",
): Promise<PublicNote[]> {
  const response = await fetch(`/api/notes?sort=${sortDirection}`, {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`notes_list_failed:${response.status}`);
  }

  const body = (await response.json()) as NotesResponse;
  return body.notes;
}
