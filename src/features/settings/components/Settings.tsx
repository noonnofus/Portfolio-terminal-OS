"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  isWallpaperId,
  orderedWallpapers,
  wallpaperCatalog,
} from "@/features/settings/config/wallpaperCatalog";
import { useWallpapersQuery } from "@/features/settings/hooks/useWallpapersQuery";
import type { SettingsProps } from "@/features/settings/types/settingsTypes";

type SettingsSection = "account" | "general" | "appearance";

// border border-[var(--application-border)] bg-[var(--application-settings-group-bg)]

function getActiveClass(active: boolean) {
  return [
    "rounded-[var(--application-border-radius)] border px-4 py-1.5 text-[length:var(--application-text-label)] font-semibold transition-colors duration-150",
    active
      ? "border-[var(--application-accent)] bg-transparent text-[var(--application-text)]"
      : "border border-[var(--application-border)] bg-[var(--application-settings-group-bg)]",
  ].join(" ");
}

export default function Settings({
  dockAutoHide,
  language,
  languagePending,
  loginHref,
  logoutHref,
  onAccountDeleted,
  onDeleteAccount,
  onDockAutoHideChange,
  onLanguageChange,
  onThemeChange,
  onWallpaperChange,
  theme,
  viewer,
  wallpaper,
}: SettingsProps) {
  const { t } = useTranslation(["Settings"]);

  const wallpapersQuery = useWallpapersQuery();
  const [activeSection, setActiveSection] =
    useState<SettingsSection>("account");
  const [accountMessage, setAccountMessage] = useState<string | null>(null);

  const wallpaperOptions = useMemo(() => {
    const serverWallpapers = wallpapersQuery.data ?? [];
    const enabledIds = serverWallpapers
      .map((entry) => entry.wallpaperId)
      .filter(isWallpaperId);

    if (enabledIds.length === 0) return orderedWallpapers;

    return enabledIds.map((id) => {
      const serverWallpaper = serverWallpapers.find(
        (entry) => entry.wallpaperId === id,
      );

      return {
        id,
        labels: {
          ko: serverWallpaper?.wallpaperName ?? id,
          en: serverWallpaper?.wallpaperName ?? id,
        },
        preview: wallpaperCatalog[id].preview,
      };
    });
  }, [wallpapersQuery.data]);
  const selectedWallpaper =
    wallpaperOptions.find((option) => option.id === wallpaper) ??
    wallpaperOptions[0];
  const settingsSections: Array<{
    id: SettingsSection;
    label: string;
  }> = [
    { id: "account", label: t("accountInfo") },
    { id: "general", label: t("general") },
    { id: "appearance", label: t("screenMode") },
  ];
  const activeSectionTitle =
    settingsSections.find((section) => section.id === activeSection)?.label ??
    t("title");

  async function deleteAccount() {
    const confirmText = window.prompt(t("confirmDeleteAccount"));
    if (confirmText !== "DELETE") return;

    setAccountMessage(null);
    const response = await onDeleteAccount(confirmText);

    if (response.status < 200 || response.status >= 300) {
      setAccountMessage(`${t("accountError")}: ${response.status}`);
      return;
    }

    onAccountDeleted();
  }

  return (
    <div className="application-settings-surface">
      <aside className="application-settings-sidebar">
        <h3 className="px-2 text-[length:var(--application-text-control)] font-bold text-slate-500 dark:text-slate-400">
          {t("title")}
        </h3>
        <nav
          aria-label={t("settingsNavigation")}
          className="mt-3 flex gap-1 sm:block sm:space-y-1"
        >
          {settingsSections.map((section) => (
            <button
              key={section.id}
              type="button"
              aria-current={activeSection === section.id ? "page" : undefined}
              data-active={activeSection === section.id}
              className="application-settings-sidebar-item"
              onClick={() => {
                setAccountMessage(null);
                setActiveSection(section.id);
              }}
            >
              {section.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="application-settings-detail">
        <h3 className="application-settings-section-title">{activeSectionTitle}</h3>

        {activeSection === "account" ? (
          <section className="space-y-4">
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              {viewer.status === "authenticated" &&
              viewer.avatarUrl !== null ? (
                <Image
                  src={viewer.avatarUrl}
                  alt=""
                  width={112}
                  height={112}
                  className="h-24 w-24 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div
                  aria-hidden="true"
                  className="grid h-28 w-28 place-items-center rounded-full bg-slate-200 text-3xl font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                >
                  {viewer.status === "authenticated"
                    ? viewer.displayName.slice(0, 1)
                    : "G"}
                </div>
              )}

              <div className="min-w-0">
                <h4 className="text-xl font-bold leading-tight tracking-[-0.03em]">
                  {viewer.status === "authenticated"
                    ? viewer.displayName
                    : "Guest"}
                </h4>

                {viewer.status === "authenticated" &&
                viewer.email !== null ? (
                  <p className="mt-1 text-base leading-tight text-slate-500 dark:text-slate-300">
                    {viewer.email}
                  </p>
                ) : null}

                <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {viewer.status === "authenticated"
                    ? viewer.role === "admin"
                      ? t("accountAdmin")
                      : t("accountUser")
                    : t("accountGuest")}
                </p>
              </div>
            </div>

            {viewer.status === "authenticated" ? (
              <div className="application-settings-card">
                <div className="application-settings-row">
                  <div>
                    <p className="text-[length:var(--application-text-control)] font-semibold">
                      {t("deleteAccount")}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="rounded-[var(--application-radius-panel)] border border-[var(--application-border)] bg-[var(--application-settings-group-bg)] px-2 py-0.5 text-[length:var(--application-text-control)] font-semibold text-[var(--application-text)] shadow-[inset_0_1px_0_rgb(0_0_0/6%)] transition-colors"
                    onClick={() => void deleteAccount()}
                  >
                    {t("deleteAccount")}
                  </button>
                </div>
              </div>
            ) : null}
            <div className="mt-6 flex flex-wrap gap-2">
              {viewer.status === "authenticated" ? (
                <a
                  href={logoutHref}
                  className="rounded-[var(--application-radius-panel)] border border-[var(--application-border)] bg-[var(--application-settings-group-bg)] px-2 py-0.5 text-[length:var(--application-text-control)] font-semibold text-[var(--application-text)] shadow-[inset_0_1px_0_rgb(0_0_0/6%)] transition-colors"
                >
                  {t("logout")}
                </a>
              ) : (
                <a href={loginHref}
                  className="rounded-[var(--application-radius-panel)] border border-[var(--application-border)] bg-[var(--application-settings-group-bg)] px-2 py-0.5 text-[length:var(--application-text-control)] font-semibold text-[var(--application-text)] shadow-[inset_0_1px_0_rgb(0_0_0/6%)] transition-colors"
                >
                  {t("login")}
                </a>
              )}
            </div>

            {accountMessage ? (
              <p className="rounded-xl bg-red-100 p-3 text-sm text-red-700">
                {accountMessage}
              </p>
            ) : null}
          </section>
        ) : null}

        {activeSection === "general" ? (
          <section className="space-y-3">
            <div className="application-settings-card">
              <div className="application-settings-row">
                <div>
                  <p className="text-[length:var(--application-text-control)] font-semibold">{t("languageLabel")}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onLanguageChange("ko");
                    }}
                    disabled={languagePending}
                    className={getActiveClass(language === "ko")}
                  >
                    한국어
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onLanguageChange("en");
                    }}
                    disabled={languagePending}
                    className={getActiveClass(language === "en")}
                  >
                    English
                  </button>
                </div>
              </div>
            </div>

            <div className="application-settings-card">
              <div className="application-settings-row">
                <div>
                  <p className="text-[length:var(--application-text-control)] font-semibold">{t("dockLabel")}</p>
                  <p className="application-settings-dock-mobile-note mt-1 text-[length:var(--application-text-footnote)] leading-4 text-[var(--application-text-secondary)]">
                    {t("dockMobileDescription")}
                  </p>
                </div>
                <div className="application-settings-dock-controls flex gap-2">
                  <button
                    type="button"
                    aria-pressed={dockAutoHide}
                    onClick={() => {
                      onDockAutoHideChange(true);
                    }}
                    className={getActiveClass(dockAutoHide)}
                  >
                    {t("dockAuto")}
                  </button>
                  <button
                    type="button"
                    aria-pressed={!dockAutoHide}
                    onClick={() => {
                      onDockAutoHideChange(false);
                    }}
                    className={getActiveClass(!dockAutoHide)}
                  >
                    {t("dockAlways")}
                  </button>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {activeSection === "appearance" ? (
          <section className="space-y-4">
            <div className="application-settings-card">
              <div className="application-settings-row">
                <div>
                  <p className="text-[length:var(--application-text-control)] font-semibold">{t("themeLabel")}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onThemeChange("light");
                    }}
                    className={getActiveClass(theme === "light")}
                  >
                    {t("themeLight")}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onThemeChange("dark");
                    }}
                    className={getActiveClass(theme === "dark")}
                  >
                    {t("themeDark")}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onThemeChange("auto");
                    }}
                    className={getActiveClass(theme === "auto")}
                  >
                    {t("themeAuto")}
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 items-center gap-4.5 pb-7 sm:grid-cols-[196px_minmax(0,1fr)]">
              {selectedWallpaper ? (
                <Image
                  src={selectedWallpaper.preview}
                  alt="선택된 배경화면"
                  width={196}
                  height={105}
                  className="application-wallpaper-preview h-26.25! w-49! max-w-full! aspect-auto!"
                  sizes="196px"
                />
              ) : null}
              <div className="flex min-h-12 w-full items-center rounded-[var(--application-radius-panel)] border border-[var(--application-border)] bg-[var(--application-settings-group-bg)] px-4.5">
                <div className="application-wallpaper-name">
                  {selectedWallpaper?.labels[language] ?? t("wallpaperLabel")}
                </div>
              </div>
            </div>

            <div className="border-t border-[var(--application-border)] pt-6.5">
              <div className="mb-3">
                <p className="text-[length:var(--application-text-title-3)] font-bold">
                  {t("wallpaperLabel")}
                </p>
              </div>

              <div className="grid grid-cols-[repeat(auto-fill,minmax(136px,1fr))] gap-x-5 gap-y-4">
                {wallpaperOptions.map(({ id, labels, preview }) => (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={wallpaper === id}
                    onClick={() => {
                      onWallpaperChange(id);
                    }}
                    className="application-wallpaper-option"
                  >
                    <Image
                      src={preview}
                      alt=""
                      width={180}
                      height={102}
                      className="application-wallpaper-preview"
                      sizes="180px"
                    />
                    <span className="application-wallpaper-name">
                      {labels[language]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
}
