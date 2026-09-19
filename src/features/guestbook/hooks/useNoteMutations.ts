"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { ActionResult } from "@/features/guestbook/types/actionResult";
import type { GuestbookActions } from "@/features/guestbook/types/guestbookTypes";
import type { PublicNote } from "@/features/guestbook/types/noteTypes";
import {
  addNoteToNotesListCache,
  cancelNotesListQueries,
  getNotesListMutationContext,
  refetchNotesListWhenMissing,
  removeNoteFromNotesListCache,
  replaceNoteInNotesListCache,
} from "@/features/guestbook/api/noteListCache";
function unwrapActionResult<T>(result: ActionResult<T>, prefix: string): T {
  if (!result.ok) {
    throw new Error(`${prefix}:${result.status}`);
  }

  return result.data;
}

export function useCreateNoteMutation(actions: GuestbookActions) {
  const queryClient = useQueryClient();

  return useMutation({
    onMutate: async () => {
      const context = getNotesListMutationContext(queryClient);
      await cancelNotesListQueries(queryClient);
      return context;
    },
    mutationFn: async ({ content }: { content: string }) => {
      const result = await actions.createNote({ content });
      return unwrapActionResult<PublicNote>(result, "notes_create_failed");
    },
    onSuccess: (note) => addNoteToNotesListCache(queryClient, note),
    onSettled: (_data, _error, _variables, context) =>
      refetchNotesListWhenMissing(queryClient, context),
  });
}

export function useUpdateNoteMutation(actions: GuestbookActions) {
  const queryClient = useQueryClient();

  return useMutation({
    onMutate: async () => {
      const context = getNotesListMutationContext(queryClient);
      await cancelNotesListQueries(queryClient);
      return context;
    },
    mutationFn: async ({
      noteId,
      content,
    }: {
      noteId: string;
      content: string;
    }) => {
      const result = await actions.updateNote({ noteId, content });
      return unwrapActionResult<PublicNote>(result, "notes_update_failed");
    },
    onSuccess: (note) => replaceNoteInNotesListCache(queryClient, note),
    onSettled: (_data, _error, _variables, context) =>
      refetchNotesListWhenMissing(queryClient, context),
  });
}

export function useDeleteNoteMutation(actions: GuestbookActions) {
  const queryClient = useQueryClient();

  return useMutation({
    onMutate: async () => {
      const context = getNotesListMutationContext(queryClient);
      await cancelNotesListQueries(queryClient);
      return context;
    },
    mutationFn: async ({ noteId }: { noteId: string }) => {
      const result = await actions.deleteNote({ noteId });
      return unwrapActionResult(result, "notes_delete_failed");
    },
    onSuccess: (_data, { noteId }) =>
      removeNoteFromNotesListCache(queryClient, noteId),
    onSettled: (_data, _error, _variables, context) =>
      refetchNotesListWhenMissing(queryClient, context),
  });
}
