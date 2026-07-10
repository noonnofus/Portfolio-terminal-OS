import { QueryClient } from "@tanstack/react-query";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  addNoteToNotesListCache,
  getNotesListMutationContext,
  refetchNotesListWhenMissing,
  removeNoteFromNotesListCache,
  replaceNoteInNotesListCache,
} from "@/features/notes/client/noteListCache";
import { noteQueryKeys } from "@/features/notes/client/noteQueryKeys";
import type { PublicNote } from "@/features/notes/model/types";

const firstNote = {
  id: "note-1",
  authorAccountId: "account-1",
  authorName: "Hyunho",
  content: "First note",
  createdAt: "2026-07-11T01:00:00.000Z",
  updatedAt: "2026-07-11T01:00:00.000Z",
} satisfies PublicNote;

const secondNote = {
  ...firstNote,
  id: "note-2",
  content: "Second note",
  createdAt: "2026-07-11T02:00:00.000Z",
  updatedAt: "2026-07-11T02:00:00.000Z",
} satisfies PublicNote;

const updatedFirstNote = {
  ...firstNote,
  content: "Updated first note",
  updatedAt: "2026-07-11T03:00:00.000Z",
} satisfies PublicNote;

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("note list cache", () => {
  it("updates only finite note list caches", () => {
    const queryClient = makeQueryClient();
    const detail = { id: firstNote.id, extra: "detail" };
    queryClient.setQueryData(noteQueryKeys.list("asc"), [firstNote]);
    queryClient.setQueryData(["notes", "detail", firstNote.id], detail);

    replaceNoteInNotesListCache(queryClient, updatedFirstNote);

    expect(queryClient.getQueryData(noteQueryKeys.list("asc"))).toEqual([
      updatedFirstNote,
    ]);
    expect(
      queryClient.getQueryData(["notes", "detail", firstNote.id]),
    ).toBe(detail);
  });

  it("adds a created note at the correct end for each list sort", () => {
    const queryClient = makeQueryClient();
    queryClient.setQueryData(noteQueryKeys.list("asc"), [firstNote]);
    queryClient.setQueryData(noteQueryKeys.list("desc"), [firstNote]);

    addNoteToNotesListCache(queryClient, secondNote);

    expect(queryClient.getQueryData(noteQueryKeys.list("asc"))).toEqual([
      firstNote,
      secondNote,
    ]);
    expect(queryClient.getQueryData(noteQueryKeys.list("desc"))).toEqual([
      secondNote,
      firstNote,
    ]);
  });

  it("removes a deleted note without changing unrelated caches", () => {
    const queryClient = makeQueryClient();
    const detail = { id: firstNote.id, extra: "detail" };
    queryClient.setQueryData(noteQueryKeys.list("asc"), [firstNote, secondNote]);
    queryClient.setQueryData(["notes", "detail", firstNote.id], detail);

    removeNoteFromNotesListCache(queryClient, firstNote.id);

    expect(queryClient.getQueryData(noteQueryKeys.list("asc"))).toEqual([
      secondNote,
    ]);
    expect(
      queryClient.getQueryData(["notes", "detail", firstNote.id]),
    ).toBe(detail);
  });

  it("distinguishes an empty loaded list from an absent list cache", () => {
    const queryClient = makeQueryClient();
    expect(getNotesListMutationContext(queryClient)).toEqual({
      hadListData: false,
    });

    queryClient.setQueryData(noteQueryKeys.list("asc"), []);
    expect(getNotesListMutationContext(queryClient)).toEqual({
      hadListData: true,
    });
  });

  it("refetches active lists only when a mutation cancelled an absent cache", () => {
    const queryClient = makeQueryClient();
    const refetchQueries = vi
      .spyOn(queryClient, "refetchQueries")
      .mockResolvedValue();

    refetchNotesListWhenMissing(queryClient, { hadListData: true });
    expect(refetchQueries).not.toHaveBeenCalled();

    refetchNotesListWhenMissing(queryClient, { hadListData: false });
    expect(refetchQueries).toHaveBeenCalledWith({
      queryKey: noteQueryKeys.listPrefix,
      type: "active",
    });
  });
});
