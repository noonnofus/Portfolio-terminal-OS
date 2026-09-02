"use client";

import {
  createGuestbookNoteAction,
  deleteGuestbookNoteAction,
  updateGuestbookNoteAction,
} from "@/app/gui/actions/guestbookActions";
import Guestbook from "@/features/guestbook/components/Guestbook";
import type { GuestbookViewer } from "@/features/guestbook/types/guestbookTypes";
import type { Viewer } from "@/features/auth/types/viewer";
import { useGuiStore } from "@/app/gui/store/GuiStoreProvider";
import type { Language } from "@/lib/i18n/language";

function toGuestbookViewer(
  viewer: Viewer,
): GuestbookViewer {
  return viewer.status === "authenticated"
    ? {
        status: "authenticated",
        accountId: viewer.accountId,
        displayName: viewer.displayName,
        role: viewer.role,
      }
    : { status: "guest" };
}

export default function GuestbookGuiAdapter({ language }: { language: Language }) {
  const viewer = useGuiStore((state) => state.viewer);

  return (
    <Guestbook
      actions={{
        createNote: createGuestbookNoteAction,
        updateNote: updateGuestbookNoteAction,
        deleteNote: deleteGuestbookNoteAction,
      }}
      language={language}
      loginHref="/auth/github"
      viewer={toGuestbookViewer(viewer)}
    />
  );
}
