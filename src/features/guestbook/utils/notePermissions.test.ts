import { describe, expect, it } from "vitest";

import { getNotePermissions } from "@/features/guestbook/utils/notePermissions";
import type { GuestbookViewer } from "@/features/guestbook/types/guestbookTypes";
import type { PublicNote } from "@/features/guestbook/types/noteTypes";

const note = {
  id: "note-1",
  authorAccountId: "author-1",
  authorName: "Kevin",
  content: "Hello",
  createdAt: "2026-07-07T08:14:01.013789+00:00",
  updatedAt: "2026-07-07T13:18:15.921+00:00",
} satisfies PublicNote;

describe("getNotePermissions", () => {
  it("does not allow guests to edit or delete", () => {
    expect(getNotePermissions({ status: "guest" }, note)).toEqual({
      canEdit: false,
      canDelete: false,
    });
  });

  it("allows authors to edit and delete their own note", () => {
    const viewer = {
      status: "authenticated",
      accountId: "author-1",
      displayName: "Kevin",
      role: "user",
    } satisfies GuestbookViewer;

    expect(getNotePermissions(viewer, note)).toEqual({
      canEdit: true,
      canDelete: true,
    });
  });

  it("allows admins to delete other users' notes without edit access", () => {
    const viewer = {
      status: "authenticated",
      accountId: "admin-1",
      displayName: "Admin",
      role: "admin",
    } satisfies GuestbookViewer;

    expect(getNotePermissions(viewer, note)).toEqual({
      canEdit: false,
      canDelete: true,
    });
  });

  it("does not allow other users to edit or delete", () => {
    const viewer = {
      status: "authenticated",
      accountId: "user-2",
      displayName: "Other",
      role: "user",
    } satisfies GuestbookViewer;

    expect(getNotePermissions(viewer, note)).toEqual({
      canEdit: false,
      canDelete: false,
    });
  });
});
