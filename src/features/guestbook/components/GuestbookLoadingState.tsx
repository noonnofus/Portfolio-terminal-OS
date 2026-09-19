"use client";

import { useTranslation } from "react-i18next";

import type { Language } from "@/lib/i18n/language";
import { useLanguageStore } from "@/lib/i18n/useLanguageStore";
import type { GuestbookViewer } from "@/features/guestbook/types/guestbookTypes";
import { GuestbookShell } from "./GuestbookShell";

export function GuestbookLoadingState({
  language,
  phase = "notes",
}: {
  language?: Language;
  phase?: "app" | "notes";
}) {
  const currentLanguage = useLanguageStore((state) => state.currentLanguage);
  const { t } = useTranslation("Notes", {
    lng: language ?? currentLanguage,
  });

  return (
    <p
      role="status"
      data-loading-phase={phase}
      className="text-[length:var(--application-text-body)] text-[var(--app-notes-color-muted-soft)]"
    >
      {t("loading")}
    </p>
  );
}

export function GuestbookAppLoadingState({
  language,
  loginHref,
  viewer,
}: {
  language: Language;
  loginHref: string;
  viewer: GuestbookViewer;
}) {
  return (
    <GuestbookShell
      language={language}
      loginHref={loginHref}
      viewer={viewer}
    >
      <section className="flex flex-col gap-5">
        <GuestbookLoadingState language={language} phase="app" />
      </section>
    </GuestbookShell>
  );
}
