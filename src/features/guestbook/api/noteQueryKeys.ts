import type { NoteSortDirection } from "@/features/guestbook/types/noteTypes";

export const noteQueryKeys = {
  all: ["notes"] as const,
  listPrefix: ["notes", "list"] as const,
  list: (sortDirection: NoteSortDirection) =>
    ["notes", "list", sortDirection] as const,
};
