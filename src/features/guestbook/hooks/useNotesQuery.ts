"use client";

import { useQuery } from "@tanstack/react-query";

import { listNotes } from "@/features/guestbook/api/notesClient";
import { noteQueryKeys } from "@/features/guestbook/api/noteQueryKeys";
import type { NoteSortDirection } from "@/features/guestbook/types/noteTypes";

export function useNotesQuery(
  sortDirection: NoteSortDirection = "asc",
) {
  return useQuery({
    queryKey: noteQueryKeys.list(sortDirection),
    queryFn: ({ signal }) => listNotes(sortDirection, signal),
  });
}
