"use client";

import {
  createGuestbookNoteAction,
  deleteGuestbookNoteAction,
  updateGuestbookNoteAction,
} from "@/app/gui/actions/guestbookActions";
import Guestbook from "@/features/guestbook/components/Guestbook";
import { useGuiStore } from "@/app/gui/store/GuiStoreProvider";
import { toGuestbookViewer } from "@/app/gui/lib/toGuestbookViewer";
import type { Language } from "@/lib/i18n/language";

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
