import type { Viewer } from "@/features/auth/model/viewer";
import type { PublicNote } from "@/features/notes/model/types";

export function getNotePermissions(viewer: Viewer, note: PublicNote) {
  const canEdit =
    viewer.status === "authenticated" &&
    note.authorAccountId !== null &&
    note.authorAccountId === viewer.accountId;

  return {
    canEdit,
    canDelete:
      canEdit ||
      (viewer.status === "authenticated" && viewer.role === "admin"),
  };
}
