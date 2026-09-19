export type NoteSortDirection = "asc" | "desc";

export type PublicNote = {
  id: string;
  authorAccountId: string | null;
  authorName: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export type NoteRow = {
  id: string;
  author_account_id: string | null;
  author_name_snapshot: string;
  content: string;
  created_at: string;
  updated_at: string;
};
