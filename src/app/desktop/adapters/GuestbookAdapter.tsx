"use client";

import {
  createGuestbookNoteAction,
  deleteGuestbookNoteAction,
  updateGuestbookNoteAction,
} from "@/app/desktop/actions/guestbookActions";
import Guestbook from "@/features/guestbook/components/Guestbook";
import { useDesktopStore } from "@/app/desktop/store/DesktopStoreProvider";
import { toGuestbookViewer } from "@/app/desktop/lib/toGuestbookViewer";
import type { Language } from "@/lib/i18n/language";

export default function GuestbookAdapter({ language }: { language: Language }) {
  const viewer = useDesktopStore((state) => state.viewer);

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
