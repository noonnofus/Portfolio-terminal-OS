"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { ActionResult } from "@/features/notes/model/actionResult";
import type { PublicNote } from "@/features/notes/model/types";
import {
  addNoteToNotesListCache,
  cancelNotesListQueries,
  getNotesListMutationContext,
  refetchNotesListWhenMissing,
  removeNoteFromNotesListCache,
  replaceNoteInNotesListCache,
} from "@/features/notes/client/noteListCache";
import {
  createNoteAction,
  deleteNoteAction,
  updateNoteAction,
} from "@/features/notes/server/actions/noteActions";

function unwrapActionResult<T>(result: ActionResult<T>, prefix: string): T {
  if (!result.ok) {
    throw new Error(`${prefix}:${result.status}`);
  }

  return result.data;
}

export function useCreateNoteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    onMutate: async () => {
      const context = getNotesListMutationContext(queryClient);
      await cancelNotesListQueries(queryClient);
      return context;
    },
    mutationFn: async ({ content }: { content: string }) => {
      const result = await createNoteAction({ content });
      return unwrapActionResult<PublicNote>(result, "notes_create_failed");
    },
    onSuccess: (note) => addNoteToNotesListCache(queryClient, note),
    onSettled: (_data, _error, _variables, context) =>
      refetchNotesListWhenMissing(queryClient, context),
  });
}

export function useUpdateNoteMutation() {
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
      const result = await updateNoteAction({ noteId, content });
      return unwrapActionResult<PublicNote>(result, "notes_update_failed");
    },
    onSuccess: (note) => replaceNoteInNotesListCache(queryClient, note),
    onSettled: (_data, _error, _variables, context) =>
      refetchNotesListWhenMissing(queryClient, context),
  });
}

export function useDeleteNoteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    onMutate: async () => {
      const context = getNotesListMutationContext(queryClient);
      await cancelNotesListQueries(queryClient);
      return context;
    },
    mutationFn: async ({ noteId }: { noteId: string }) => {
      const result = await deleteNoteAction({ noteId });
      return unwrapActionResult(result, "notes_delete_failed");
    },
    onSuccess: (_data, { noteId }) =>
      removeNoteFromNotesListCache(queryClient, noteId),
    onSettled: (_data, _error, _variables, context) =>
      refetchNotesListWhenMissing(queryClient, context),
  });
}
