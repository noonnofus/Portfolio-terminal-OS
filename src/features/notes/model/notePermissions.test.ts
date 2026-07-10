import { describe, expect, it } from "vitest";

import type { Viewer } from "@/features/auth/model/viewer";
import { getNotePermissions } from "@/features/notes/model/notePermissions";
import type { PublicNote } from "@/features/notes/model/types";

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
      email: null,
      avatarUrl: null,
      role: "user",
    } satisfies Viewer;

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
      email: null,
      avatarUrl: null,
      role: "admin",
    } satisfies Viewer;

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
      email: null,
      avatarUrl: null,
      role: "user",
    } satisfies Viewer;

    expect(getNotePermissions(viewer, note)).toEqual({
      canEdit: false,
      canDelete: false,
    });
  });
});
