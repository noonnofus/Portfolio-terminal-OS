"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { ActionResult } from "@/features/notes/model/actionResult";
import type { PublicNote } from "@/features/notes/model/types";
import {
  createNoteAction,
  deleteNoteAction,
  updateNoteAction,
} from "@/features/notes/server/actions/noteActions";
import { noteQueryKeys } from "@/features/notes/client/noteQueryKeys";

function unwrapActionResult<T>(result: ActionResult<T>, prefix: string): T {
  if (!result.ok) {
    throw new Error(`${prefix}:${result.status}`);
  }

  return result.data;
}

export function useCreateNoteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ content }: { content: string }) => {
      const result = await createNoteAction({ content });
      return unwrapActionResult<PublicNote>(result, "notes_create_failed");
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: noteQueryKeys.all }),
  });
}

export function useUpdateNoteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
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
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: noteQueryKeys.all }),
  });
}

export function useDeleteNoteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ noteId }: { noteId: string }) => {
      const result = await deleteNoteAction({ noteId });
      return unwrapActionResult(result, "notes_delete_failed");
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: noteQueryKeys.all }),
  });
}
