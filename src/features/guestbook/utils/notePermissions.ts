import type { GuestbookViewer } from "@/features/guestbook/types/guestbookTypes";
import type { PublicNote } from "@/features/guestbook/types/noteTypes";

export function getNotePermissions(viewer: GuestbookViewer, note: PublicNote) {
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
