"use client";

import type { QueryClient } from "@tanstack/react-query";

import { noteQueryKeys } from "@/features/notes/client/noteQueryKeys";
import type {
  NoteSortDirection,
  PublicNote,
} from "@/features/notes/model/types";

export type NotesListMutationContext = {
  hadListData: boolean;
};

function getSortDirection(queryKey: readonly unknown[]): NoteSortDirection {
  return queryKey[2] === "desc" ? "desc" : "asc";
}

function replaceNote(notes: PublicNote[], note: PublicNote) {
  return notes.map((current) => (current.id === note.id ? note : current));
}

export function getNotesListMutationContext(
  queryClient: QueryClient,
): NotesListMutationContext {
  const hadListData = queryClient
    .getQueriesData<PublicNote[]>({ queryKey: noteQueryKeys.listPrefix })
    .some(([, data]) => data !== undefined);

  return { hadListData };
}

export async function cancelNotesListQueries(queryClient: QueryClient) {
  await queryClient.cancelQueries(
    { queryKey: noteQueryKeys.listPrefix },
    { silent: true },
  );
}

export function addNoteToNotesListCache(
  queryClient: QueryClient,
  note: PublicNote,
) {
  for (const [queryKey, notes] of queryClient.getQueriesData<PublicNote[]>({
    queryKey: noteQueryKeys.listPrefix,
  })) {
    if (notes === undefined || notes.some((current) => current.id === note.id)) {
      continue;
    }

    const nextNotes =
      getSortDirection(queryKey) === "desc" ? [note, ...notes] : [...notes, note];

    queryClient.setQueryData<PublicNote[]>(queryKey, nextNotes);
  }
}

export function replaceNoteInNotesListCache(
  queryClient: QueryClient,
  note: PublicNote,
) {
  queryClient.setQueriesData<PublicNote[]>(
    { queryKey: noteQueryKeys.listPrefix },
    (notes) => (notes === undefined ? notes : replaceNote(notes, note)),
  );
}

export function removeNoteFromNotesListCache(
  queryClient: QueryClient,
  noteId: string,
) {
  queryClient.setQueriesData<PublicNote[]>(
    { queryKey: noteQueryKeys.listPrefix },
    (notes) => {
      if (notes === undefined) return notes;

      const nextNotes = notes.filter((note) => note.id !== noteId);
      return nextNotes.length === notes.length ? notes : nextNotes;
    },
  );
}

export function refetchNotesListWhenMissing(
  queryClient: QueryClient,
  context: NotesListMutationContext | undefined,
) {
  if (context?.hadListData === true) return;

  void queryClient.refetchQueries({
    queryKey: noteQueryKeys.listPrefix,
    type: "active",
  });
}
