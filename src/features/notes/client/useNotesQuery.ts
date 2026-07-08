"use client";

import { useQuery } from "@tanstack/react-query";

import { listNotes } from "@/features/notes/client/notesClient";
import { noteQueryKeys } from "@/features/notes/client/noteQueryKeys";

export function useNotesQuery(viewerKey: string) {
  return useQuery({
    queryKey: noteQueryKeys.list(viewerKey),
    queryFn: listNotes,
  });
}
