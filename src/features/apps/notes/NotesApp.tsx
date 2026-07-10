"use client";

import { useEffect, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { Markdown } from "@tiptap/markdown";
import StarterKit from "@tiptap/starter-kit";
import ReactMarkdown, { type Components } from "react-markdown";
import { useTranslation } from "react-i18next";
import remarkGfm from "remark-gfm";

import type { GuiAppComponentProps } from "@/features/gui/registry/appTypes";
import { useGuiStore } from "@/features/gui/store/GuiStoreProvider";
import {
  useCreateNoteMutation,
  useDeleteNoteMutation,
  useUpdateNoteMutation,
} from "@/features/notes/client/useNoteMutations";
import { useNotesQuery } from "@/features/notes/client/useNotesQuery";
import { getNotePermissions } from "@/features/notes/model/notePermissions";
import type { PublicNote } from "@/features/notes/model/types";

const AUTOSAVE_DELAY_MS = 700;
const MAX_NOTE_MARKDOWN_LENGTH = 1000;

const tiptapExtensions = [StarterKit, Markdown];

type SaveStatus = "idle" | "dirty" | "saving" | "saved" | "error";

type SaveFlight = {
  inFlight: boolean;
  currentPromise: Promise<boolean> | null;
  pendingLatestContent: string | null;
  lastSavedContent: string;
};

type NoteEditorProps = {
  initialNoteId: string | null;
  initialContent: string;
  label: string;
  placeholder?: string;
  autoFocus?: boolean;
  createNote: (content: string) => Promise<PublicNote>;
  updateNote: (noteId: string, content: string) => Promise<PublicNote>;
  deleteNote: (noteId: string) => Promise<unknown>;
  onCreated?: (note: PublicNote) => void;
  onDeleted?: (noteId: string) => void;
  onFinished?: () => void;
  onError: (message: string) => void;
  t: (key: string) => string;
};

function getClientErrorStatus(error: unknown): string {
  if (!(error instanceof Error)) return "unknown";
  const status = error.message.split(":").at(1);
  return status ?? "unknown";
}

function formatNoteDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function getDisplayedNoteDate(note: PublicNote) {
  return note.updatedAt === note.createdAt ? note.createdAt : note.updatedAt;
}

function isSafeMarkdownHref(href: string) {
  try {
    const url = new URL(href, "https://portfolio.local");
    return ["http:", "https:", "mailto:"].includes(url.protocol);
  } catch {
    return false;
  }
}

function validateMarkdownLength(content: string) {
  const trimmed = content.trim();
  if (trimmed.length === 0) return "empty";
  if (trimmed.length > MAX_NOTE_MARKDOWN_LENGTH) return "too_long";
  return "valid";
}

const markdownComponents = {
  h1: ({ children }) => (
    <h1 className="mt-5 mb-3 text-[24px] font-bold tracking-[-0.02em] first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-5 mb-2 text-[20px] font-semibold tracking-[-0.015em] first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-4 mb-2 text-[17px] font-semibold first:mt-0">
      {children}
    </h3>
  ),
  p: ({ children }) => <p className="my-2 first:mt-0 last:mb-0">{children}</p>,
  ul: ({ children }) => <ul className="my-2 list-disc pl-5">{children}</ul>,
  ol: ({ children }) => <ol className="my-2 list-decimal pl-5">{children}</ol>,
  li: ({ children }) => <li className="my-1 pl-1">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="my-3 border-l-2 border-[var(--notes-quote-border)] pl-3 text-[var(--notes-muted-strong)]">
      {children}
    </blockquote>
  ),
  code: ({ children }) => (
    <code className="rounded-md bg-[var(--notes-code-bg)] px-1.5 py-0.5 text-[0.92em]">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="my-3 overflow-x-auto rounded-xl bg-[var(--notes-code-bg)] p-3 text-[13px]">
      {children}
    </pre>
  ),
  a: ({ href, children }) => {
    if (!href || !isSafeMarkdownHref(href)) {
      return <span>{children}</span>;
    }

    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="text-[var(--notes-link)] underline decoration-[var(--notes-link-decoration)] underline-offset-2"
      >
        {children}
      </a>
    );
  },
} satisfies Components;

function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="notes-markdown-content max-w-none whitespace-normal break-words text-[15px] leading-7 tracking-[-0.005em] text-[var(--notes-text)]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={markdownComponents}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

function statusLabel(status: SaveStatus, t: (key: string) => string) {
  switch (status) {
    case "dirty":
    case "saving":
      return t("saving");
    case "saved":
      return t("saved");
    case "error":
      return t("saveError");
    default:
      return "";
  }
}

function NoteEditor({
  initialNoteId,
  initialContent,
  label,
  placeholder,
  autoFocus = false,
  createNote,
  updateNote,
  deleteNote,
  onCreated,
  onDeleted,
  onFinished,
  onError,
  t,
}: NoteEditorProps) {
  const [draft, setDraft] = useState(initialContent);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [lengthError, setLengthError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const noteIdRef = useRef<string | null>(initialNoteId);
  const deletedRef = useRef(false);
  const flightRef = useRef<SaveFlight>({
    inFlight: false,
    currentPromise: null,
    pendingLatestContent: null,
    lastSavedContent: initialContent.trim(),
  });

  async function persistContent(content: string): Promise<PublicNote | null> {
    const trimmed = content.trim();
    const currentNoteId = noteIdRef.current;

    if (currentNoteId === null) {
      const created = await createNote(trimmed);
      noteIdRef.current = created.id;
      onCreated?.(created);
      return created;
    }

    return updateNote(currentNoteId, trimmed);
  }

  function consumePendingContent(): string | null {
    const pendingContent = flightRef.current.pendingLatestContent;
    flightRef.current.pendingLatestContent = null;
    return pendingContent;
  }

  async function saveContent(content: string): Promise<boolean> {
    const validation = validateMarkdownLength(content);

    if (validation === "empty") {
      setStatus("idle");
      setLengthError(null);
      return true;
    }

    if (validation === "too_long") {
      setStatus("error");
      setLengthError(t("tooLong"));
      return false;
    }

    const trimmed = content.trim();
    setLengthError(null);

    if (trimmed === flightRef.current.lastSavedContent) {
      setStatus("saved");
      return true;
    }

    if (flightRef.current.inFlight) {
      flightRef.current.pendingLatestContent = trimmed;
      setStatus("dirty");
      return flightRef.current.currentPromise ?? true;
    }

    flightRef.current.inFlight = true;
    flightRef.current.pendingLatestContent = null;
    setStatus("saving");

    const savePromise = (async () => {
      try {
        const saved = await persistContent(trimmed);
        if (deletedRef.current) return false;
        flightRef.current.lastSavedContent = saved?.content ?? trimmed;
        setStatus("saved");
      } catch (error) {
        if (!deletedRef.current) {
          setStatus("error");
          onError(`${t("error")}: ${getClientErrorStatus(error)}`);
        }
        return false;
      } finally {
        flightRef.current.inFlight = false;
        flightRef.current.currentPromise = null;
      }

      const pendingContent = consumePendingContent();

      if (
        pendingContent !== null &&
        pendingContent.trim() !== flightRef.current.lastSavedContent
      ) {
        return saveContent(pendingContent);
      }

      return true;
    })();

    flightRef.current.currentPromise = savePromise;
    return savePromise;
  }

  function scheduleSave(content: string) {
    setDraft(content);

    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
    }

    const validation = validateMarkdownLength(content);
    if (validation === "empty") {
      setStatus("idle");
      setLengthError(null);
      return;
    }

    if (validation === "too_long") {
      setStatus("error");
      setLengthError(t("tooLong"));
      return;
    }

    setLengthError(null);
    setStatus("dirty");
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      void saveContent(content);
    }, AUTOSAVE_DELAY_MS);
  }

  async function handleBlur(content: string) {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (content.trim().length === 0) {
      const currentNoteId = noteIdRef.current;
      if (currentNoteId !== null) {
        deletedRef.current = true;
        try {
          await deleteNote(currentNoteId);
          onDeleted?.(currentNoteId);
        } catch (error) {
          deletedRef.current = false;
          setStatus("error");
          onError(`${t("error")}: ${getClientErrorStatus(error)}`);
          return;
        }
      }
      onFinished?.();
      return;
    }

    const saved = await saveContent(content);
    if (saved) {
      onFinished?.();
    }
  }

  const editor = useEditor({
    extensions: tiptapExtensions,
    content: initialContent,
    contentType: "markdown",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        "aria-label": label,
      },
    },
    onUpdate: ({ editor }) => {
      scheduleSave(editor.getMarkdown());
    },
    onBlur: ({ editor }) => {
      void handleBlur(editor.getMarkdown());
    },
  });

  useEffect(() => {
    if (!autoFocus || editor === null) return;
    editor.commands.focus("end");
  }, [autoFocus, editor]);

  useEffect(
    () => () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    },
    [],
  );

  if (editor === null) {
    return null;
  }

  return (
    <div className="notes-tiptap-editor">
      <EditorContent editor={editor} />
      {placeholder && draft.trim().length === 0 ? (
        <p className="pointer-events-none mt-[-1.75rem] text-[15px] leading-7 tracking-[-0.005em] text-[var(--notes-muted-placeholder)]">
          {placeholder}
        </p>
      ) : null}
      <div className="mt-1 flex min-h-4 items-center justify-between gap-3 text-[11px] text-[var(--notes-muted)]">
        <p aria-live="polite">{lengthError ?? statusLabel(status, t)}</p>
        <span aria-label={t("characterCount")}>
          {draft.trim().length}/{MAX_NOTE_MARKDOWN_LENGTH}
        </span>
      </div>
    </div>
  );
}

function NoteBlock({
  note,
  canEdit,
  createNote,
  updateNote,
  deleteNote,
  onError,
  t,
}: {
  note: PublicNote;
  canEdit: boolean;
  createNote: (content: string) => Promise<PublicNote>;
  updateNote: (noteId: string, content: string) => Promise<PublicNote>;
  deleteNote: (noteId: string) => Promise<unknown>;
  onError: (message: string) => void;
  t: (key: string) => string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  if (isDeleted) return null;

  return (
    <article className="grid grid-cols-1 gap-2 sm:grid-cols-[150px_1fr] sm:gap-6">
      <aside className="text-left sm:pt-1">
        <strong className="block truncate text-[13px] font-semibold text-[var(--notes-muted-strong)]">
          {note.authorName}
        </strong>
        <time className="mt-1 block text-[11px] leading-4 text-[var(--notes-muted)]">
          {formatNoteDate(getDisplayedNoteDate(note))}
        </time>
      </aside>

      <div className="min-w-0">
        {isEditing ? (
          <NoteEditor
            initialNoteId={note.id}
            initialContent={note.content}
            label={t("editNoteLabel")}
            autoFocus
            createNote={createNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            onDeleted={() => setIsDeleted(true)}
            onFinished={() => setIsEditing(false)}
            onError={onError}
            t={t}
          />
        ) : (
          <div
            role={canEdit ? "button" : undefined}
            tabIndex={canEdit ? 0 : undefined}
            className={
              canEdit
                ? "cursor-text rounded-md outline-none focus-visible:bg-[var(--notes-focus-bg)] focus-visible:ring-2 focus-visible:ring-[var(--notes-accent)]/70"
                : undefined
            }
            onClick={() => {
              if (canEdit) setIsEditing(true);
            }}
            onKeyDown={(event) => {
              if (!canEdit) return;
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setIsEditing(true);
              }
            }}
          >
            <MarkdownContent content={note.content} />
          </div>
        )}
      </div>
    </article>
  );
}

export default function NotesApp({}: GuiAppComponentProps<"notes">) {
  const { t } = useTranslation(["Notes"]);
  const viewer = useGuiStore((state) => state.viewer);
  const notesQuery = useNotesQuery();
  const createNoteMutation = useCreateNoteMutation();
  const updateNoteMutation = useUpdateNoteMutation();
  const deleteNoteMutation = useDeleteNoteMutation();
  const [message, setMessage] = useState<string | null>(null);
  const [composerRevision, setComposerRevision] = useState(0);
  const [composerNoteId, setComposerNoteId] = useState<string | null>(null);

  const notes = (notesQuery.data ?? []).filter(
    (note) => note.id !== composerNoteId,
  );

  return (
    <div className="flex min-h-full w-full flex-col overflow-hidden bg-(--gui-app-surface-bg) text-(--gui-app-surface-text)">
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 py-6 sm:px-8">
        <header className="mb-7 grid grid-cols-1 gap-2 sm:grid-cols-[150px_1fr] sm:gap-6">
          <div className="hidden sm:block" aria-hidden="true" />
          <div className="flex min-w-0 items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-[28px] font-bold leading-tight tracking-[-0.03em]">
                {t("title")}
              </h1>
              {viewer.status === "guest" ? (
                <p className="mt-2 max-w-xl text-[13px] leading-5 text-[var(--notes-muted-soft)]">
                  {t("description")}
                </p>
              ) : null}
            </div>
            {viewer.status === "guest" ? (
              <a
                className="shrink-0 rounded-full bg-[var(--notes-accent)] px-3 py-1.5 text-[12px] font-semibold text-[var(--notes-text)] shadow-sm transition hover:bg-[var(--notes-accent-hover)]"
                href="/auth/github"
              >
                {t("login")}
              </a>
            ) : null}
          </div>
        </header>

        {message ? (
          <p className="mb-4 rounded-[12px] bg-red-50 px-4 py-3 text-[13px] text-red-700 dark:bg-red-950/30 dark:text-red-200">
            {message}
          </p>
        ) : null}

        <section className="flex flex-col gap-5">
          {notesQuery.isLoading ? (
            <p className="text-[13px] text-[var(--notes-muted-soft)]">
              {t("loading")}
            </p>
          ) : notesQuery.isError ? (
            <p className="text-[13px] text-[var(--notes-muted-soft)]">
              {t("loadError")}
            </p>
          ) : notes.length === 0 && composerNoteId === null ? (
            <p className="text-[13px] text-[var(--notes-muted-soft)]">
              {t("empty")}
            </p>
          ) : (
            notes.map((note) => {
              const { canEdit } = getNotePermissions(viewer, note);

              return (
                <NoteBlock
                  key={note.id}
                  note={note}
                  canEdit={canEdit}
                  createNote={(content) =>
                    createNoteMutation.mutateAsync({ content })
                  }
                  updateNote={(noteId, content) =>
                    updateNoteMutation.mutateAsync({ noteId, content })
                  }
                  deleteNote={(noteId) =>
                    deleteNoteMutation.mutateAsync({ noteId })
                  }
                  onError={setMessage}
                  t={t}
                />
              );
            })
          )}

          {viewer.status === "authenticated" ? (
            <article className="grid grid-cols-1 gap-2 pt-2 sm:grid-cols-[150px_1fr] sm:gap-6">
              <aside className="text-left sm:pt-1">
                <strong className="block truncate text-[13px] font-semibold text-[var(--notes-muted-strong)]">
                  {viewer.displayName}
                </strong>
                <span className="mt-1 block text-[11px] leading-4 text-[var(--notes-muted)]">
                  {t("newNote")}
                </span>
              </aside>
              <NoteEditor
                key={composerRevision}
                initialNoteId={null}
                initialContent=""
                label={t("composerLabel")}
                placeholder={t("placeholder")}
                createNote={(content) =>
                  createNoteMutation.mutateAsync({ content })
                }
                updateNote={(noteId, content) =>
                  updateNoteMutation.mutateAsync({ noteId, content })
                }
                deleteNote={(noteId) =>
                  deleteNoteMutation.mutateAsync({ noteId })
                }
                onCreated={(note) => setComposerNoteId(note.id)}
                onDeleted={() => setComposerNoteId(null)}
                onFinished={() => {
                  setComposerNoteId(null);
                  setComposerRevision((value) => value + 1);
                }}
                onError={setMessage}
                t={t}
              />
            </article>
          ) : (
            <p className="pt-2 text-[13px] text-[var(--notes-muted-soft)]">
              {t("guest")}
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
