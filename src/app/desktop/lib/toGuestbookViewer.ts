import type { Viewer } from "@/features/auth/types/viewer";
import type { GuestbookViewer } from "@/features/guestbook/types/guestbookTypes";

export function toGuestbookViewer(viewer: Viewer): GuestbookViewer {
  return viewer.status === "authenticated"
    ? {
        status: "authenticated",
        accountId: viewer.accountId,
        displayName: viewer.displayName,
        role: viewer.role,
      }
    : { status: "guest" };
}
