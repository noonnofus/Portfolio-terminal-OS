"use client";

import { useQuery } from "@tanstack/react-query";

import { listNotes } from "@/features/notes/client/notesClient";
import { noteQueryKeys } from "@/features/notes/client/noteQueryKeys";
import type { NoteSortDirection } from "@/features/notes/model/types";

export function useNotesQuery(
  sortDirection: NoteSortDirection = "asc",
) {
  return useQuery({
    queryKey: noteQueryKeys.list(sortDirection),
    queryFn: ({ signal }) => listNotes(sortDirection, signal),
  });
}
