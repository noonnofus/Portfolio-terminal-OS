import type { NoteSortDirection } from "@/features/notes/model/types";

export const noteQueryKeys = {
  all: ["notes"] as const,
  list: (sortDirection: NoteSortDirection) =>
    ["notes", "list", sortDirection] as const,
};
