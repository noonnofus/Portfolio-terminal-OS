"use client";

import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import styles from "./Guestbook.module.css";

import type { GuestbookViewer } from "@/features/guestbook/types/guestbookTypes";
import type { Language } from "@/lib/i18n/language";

type GuestbookShellProps = {
  children: ReactNode;
  language: Language;
  loginHref: string;
  viewer: GuestbookViewer;
};

export function GuestbookShell({
  children,
  language,
  loginHref,
  viewer,
}: GuestbookShellProps) {
  const { t } = useTranslation("Notes", { lng: language });

  return (
    <div className={`${styles.root} flex min-h-full w-full flex-col overflow-hidden bg-(--application-app-surface-bg) text-(--application-app-surface-text)`}>
      <div className={`${styles.content} flex min-h-0 flex-1 flex-col overflow-y-auto`}>
        <header className={`${styles.entry} mb-7`}>
          <div className="hidden sm:block" aria-hidden="true" />
          <div className="flex min-w-0 items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className={`${styles.title} font-bold leading-tight`}>
                {t("title")}
              </h1>
              {viewer.status === "guest" ? (
                <p className="mt-2 max-w-xl text-[length:var(--application-text-body)] leading-5 text-[var(--app-notes-color-muted-soft)]">
                  {t("description")}
                </p>
              ) : (
                <p className="mt-2 text-[length:var(--application-text-callout)] leading-5 text-[var(--app-notes-color-muted-soft)]">
                  {t("editHint")}
                </p>
              )}
            </div>
            {viewer.status === "guest" ? (
              <a
                className="shrink-0 rounded-full bg-[var(--app-notes-color-accent)] px-3 py-1.5 text-[length:var(--application-text-callout)] font-semibold text-[var(--app-notes-color-text)] shadow-sm transition hover:bg-[var(--app-notes-color-accent-hover)]"
                href={loginHref}
              >
                {t("login")}
              </a>
            ) : null}
          </div>
        </header>

        {children}
      </div>
    </div>
  );
}
