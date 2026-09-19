import type { ActionResult } from "@/features/guestbook/types/actionResult";
import type { PublicNote } from "@/features/guestbook/types/noteTypes";

export type GuestbookViewer =
  | { status: "guest" }
  | {
      status: "authenticated";
      accountId: string;
      displayName: string;
      role: "user" | "admin";
    };

export type GuestbookActions = {
  createNote: (input: { content: string }) => Promise<ActionResult<PublicNote>>;
  updateNote: (input: { noteId: string; content: string }) => Promise<ActionResult<PublicNote>>;
  deleteNote: (input: { noteId: string }) => Promise<ActionResult>;
};
