"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { getWallpaperPreviewStyle } from "@/features/gui/appearance/wallpaperPresentation";
import {
    isWallpaperId,
    orderedWallpapers,
    type WallpaperId,
} from "@/features/gui/appearance/wallpaperCatalog";
import { useGuiNavigation } from "@/features/gui/navigation/GuiNavigationProvider";
import type { GuiAppComponentProps } from "@/features/gui/registry/appTypes";
import { useGuiStore } from "@/features/gui/store/GuiStoreProvider";
import { useSaveUserPreferencesMutation } from "@/features/user-preferences/client/useUserPreferenceMutation";
import { useUserPreferencesQuery } from "@/features/user-preferences/client/useUserPreferencesQuery";
import type { UserPreferencesInput } from "@/features/user-preferences/model/preferenceSchemas";
import { useWallpapersQuery } from "@/features/wallpapers/client/useWallpapersQuery";
import { useColorMode } from "@/shared/ui/color-mode";

export default function SettingsApp({
    language,
}: GuiAppComponentProps<"settings">) {
    const { t } = useTranslation(["Settings"]);
    const dispatch = useGuiStore((state) => state.dispatch);
    const { navigate, navigationBusy } = useGuiNavigation();
    const wallpaper = useGuiStore((state) => state.wallpaper);
    const dockAutoHide = useGuiStore((state) => state.dockAutoHide);
    const viewer = useGuiStore((state) => state.viewer);
    const viewerKey =
        viewer.status === "authenticated" ? viewer.accountId : null;
    const wallpapersQuery = useWallpapersQuery();
    const preferencesQuery = useUserPreferencesQuery(viewerKey);
    const savePreferencesMutation = useSaveUserPreferencesMutation();
    const { colorMode, setColorMode } = useColorMode();
    const [settingsView, setSettingsView] = useState<"main" | "account">(
        "main",
    );
    const [accountMessage, setAccountMessage] = useState<string | null>(null);

    const wallpaperOptions = useMemo(() => {
        const serverWallpapers = wallpapersQuery.data ?? [];
        const enabledIds = serverWallpapers
            .map((entry) => entry.wallpaperId)
            .filter(isWallpaperId);

        if (enabledIds.length === 0) return orderedWallpapers;

        return enabledIds.map((id) => ({
            id,
            labels: {
                ko:
                    serverWallpapers.find(
                        (entry) => entry.wallpaperId === id,
                    )?.wallpaperName ?? id,
                en:
                    serverWallpapers.find(
                        (entry) => entry.wallpaperId === id,
                    )?.wallpaperName ?? id,
            },
        }));
    }, [wallpapersQuery.data]);

    useEffect(() => {
        const preferences = preferencesQuery.data;
        if (preferences === undefined) return;

        if (preferences.language !== language) {
            navigate({
                type: "change-language",
                language: preferences.language,
            });
        }

        if (preferences.dockAutoHide !== dockAutoHide) {
            dispatch({
                type: "change-dock-auto-hide",
                enabled: preferences.dockAutoHide,
            });
        }

        if (
            isWallpaperId(preferences.wallpaperId) &&
            preferences.wallpaperId !== wallpaper
        ) {
            dispatch({
                type: "change-wallpaper",
                wallpaper: preferences.wallpaperId,
            });
        }

        if (
            preferences.theme !== "system" &&
            preferences.theme !== colorMode
        ) {
            setColorMode(preferences.theme);
        }
    }, [
        colorMode,
        dispatch,
        dockAutoHide,
        language,
        navigate,
        preferencesQuery.data,
        setColorMode,
        wallpaper,
    ]);

    function saveServerPreferences(next: {
        language?: "ko" | "en";
        theme?: "light" | "dark" | "system";
        dockAutoHide?: boolean;
        wallpaper?: WallpaperId;
    }) {
        if (viewer.status !== "authenticated") return;

        const input: UserPreferencesInput = {
            language: next.language ?? language,
            theme: next.theme ?? colorMode,
            dockAutoHide: next.dockAutoHide ?? dockAutoHide,
            wallpaperId: next.wallpaper ?? wallpaper,
        };

        savePreferencesMutation.mutate(input);
    }

    async function deleteAccount() {
        const confirmText = window.prompt(t("confirmDeleteAccount"));
        if (confirmText !== "DELETE") return;

        setAccountMessage(null);
        const response = await fetch("/api/account", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ confirmText }),
        });

        if (!response.ok) {
            setAccountMessage(`${t("accountError")}: ${response.status}`);
            return;
        }

        window.location.assign("/gui");
    }

    return (
        <div className="gui-settings-surface min-h-full w-full select-none p-6 transition-colors duration-200">
            <h3 className="text-xl font-bold border-b pb-3 mb-6 border-slate-200 dark:border-slate-700">
                {t("title")}
            </h3>

            {settingsView === "account" ? (
                <section className="space-y-4">
                    <button
                        type="button"
                        className="gui-system-auth-link"
                        onClick={() => {
                            setAccountMessage(null);
                            setSettingsView("main");
                        }}
                    >
                        ‹ {t("back")}
                    </button>

                    <div className="gui-settings-panel rounded-2xl border p-5">
                        <div className="flex items-center gap-4">
                            {viewer.status === "authenticated" &&
                            viewer.avatarUrl !== null ? (
                                <Image
                                    src={viewer.avatarUrl}
                                    alt=""
                                    width={64}
                                    height={64}
                                    className="h-16 w-16 rounded-full object-cover"
                                    referrerPolicy="no-referrer"
                                />
                            ) : (
                                <div
                                    aria-hidden="true"
                                    className="grid h-16 w-16 place-items-center rounded-full bg-slate-200 text-lg font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                                >
                                    {viewer.status === "authenticated"
                                        ? viewer.displayName.slice(0, 1)
                                        : "G"}
                                </div>
                            )}

                            <div className="min-w-0">
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    {viewer.status === "authenticated"
                                        ? t("accountSignedIn")
                                        : t("accountGuest")}
                                </p>
                                <h4 className="truncate text-lg font-bold">
                                    {viewer.status === "authenticated"
                                        ? viewer.displayName
                                        : "Guest"}
                                </h4>
                                {viewer.status === "authenticated" ? (
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        {viewer.role === "admin"
                                            ? t("accountAdmin")
                                            : t("accountUser")}
                                    </p>
                                ) : null}
                            </div>
                        </div>

                        <div className="mt-5 flex flex-wrap gap-2">
                            {viewer.status === "authenticated" ? (
                                <>
                                    <a
                                        href="/auth/logout"
                                        className="gui-system-auth-link"
                                    >
                                        {t("logout")}
                                    </a>
                                    <button
                                        type="button"
                                        className="gui-system-auth-link"
                                        onClick={() => void deleteAccount()}
                                    >
                                        {t("deleteAccount")}
                                    </button>
                                </>
                            ) : (
                                <a
                                    href="/auth/github"
                                    className="gui-system-auth-link"
                                >
                                    {t("login")}
                                </a>
                            )}
                        </div>

                        {accountMessage ? (
                            <p className="mt-4 rounded-xl bg-red-100 p-3 text-sm text-red-700">
                                {accountMessage}
                            </p>
                        ) : null}
                    </div>
                </section>
            ) : (
                <div className="space-y-8">
                    <section className="space-y-2">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                            {t("general")}
                        </h4>
                        <button
                            type="button"
                            className="gui-settings-panel flex w-full items-center justify-between gap-4 rounded-xl border p-4 text-left"
                            onClick={() => setSettingsView("account")}
                        >
                            <div className="flex min-w-0 items-center gap-3">
                                {viewer.status === "authenticated" &&
                                viewer.avatarUrl !== null ? (
                                    <Image
                                        src={viewer.avatarUrl}
                                        alt=""
                                        width={44}
                                        height={44}
                                        className="h-11 w-11 rounded-full object-cover"
                                        referrerPolicy="no-referrer"
                                    />
                                ) : (
                                    <div
                                        aria-hidden="true"
                                        className="grid h-11 w-11 place-items-center rounded-full bg-slate-200 text-sm font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                                    >
                                        {viewer.status === "authenticated"
                                            ? viewer.displayName.slice(0, 1)
                                            : "G"}
                                    </div>
                                )}
                                <div className="min-w-0">
                                    <p className="font-semibold text-sm">
                                        {t("accountLabel")}
                                    </p>
                                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                                        {viewer.status === "authenticated"
                                            ? viewer.displayName
                                            : t("accountGuest")}
                                    </p>
                                </div>
                            </div>
                            <span
                                aria-hidden="true"
                                className="text-2xl leading-none text-slate-400"
                            >
                                ›
                            </span>
                        </button>
                        <div className="gui-settings-panel flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-xl gap-4">
                            <div>
                                <p className="font-semibold text-sm">
                                    {t("languageLabel")}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    {t("languageDesc")}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        navigate({
                                            type: "change-language",
                                            language: "ko",
                                        });
                                        saveServerPreferences({
                                            language: "ko",
                                        });
                                    }}
                                    disabled={navigationBusy}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                                        language === "ko"
                                            ? "bg-blue-600 text-white shadow-sm"
                                            : "bg-slate-200/70 hover:bg-slate-300/80 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-300"
                                    }`}
                                >
                                    한국어
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        navigate({
                                            type: "change-language",
                                            language: "en",
                                        });
                                        saveServerPreferences({
                                            language: "en",
                                        });
                                    }}
                                    disabled={navigationBusy}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                                        language === "en"
                                            ? "bg-blue-600 text-white shadow-sm"
                                            : "bg-slate-200/70 hover:bg-slate-300/80 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-300"
                                    }`}
                                >
                                    English
                                </button>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-2">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                            {t("appearance")}
                        </h4>
                        <div className="gui-settings-panel flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-xl gap-4">
                            <div>
                                <p className="font-semibold text-sm">
                                    {t("themeLabel")}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    {t("themeDesc")}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setColorMode("light");
                                        saveServerPreferences({
                                            theme: "light",
                                        });
                                    }}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                                        colorMode === "light"
                                            ? "bg-blue-600 text-white shadow-sm"
                                            : "bg-slate-200/70 hover:bg-slate-300/80 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-300"
                                    }`}
                                >
                                    {t("themeLight")}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setColorMode("dark");
                                        saveServerPreferences({
                                            theme: "dark",
                                        });
                                    }}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                                        colorMode === "dark"
                                            ? "bg-blue-600 text-white shadow-sm"
                                            : "bg-slate-200/70 hover:bg-slate-300/80 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-300"
                                    }`}
                                >
                                    {t("themeDark")}
                                </button>
                            </div>
                        </div>
                        <div className="gui-settings-panel flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-xl gap-4">
                            <div>
                                <p className="font-semibold text-sm">
                                    {t("dockLabel")}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    {t("dockDesc")}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    aria-pressed={dockAutoHide}
                                    onClick={() => {
                                        dispatch({
                                            type: "change-dock-auto-hide",
                                            enabled: true,
                                        });
                                        saveServerPreferences({
                                            dockAutoHide: true,
                                        });
                                    }}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                                        dockAutoHide
                                            ? "bg-blue-600 text-white shadow-sm"
                                            : "bg-slate-200/70 hover:bg-slate-300/80 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-300"
                                    }`}
                                >
                                    {t("dockAuto")}
                                </button>
                                <button
                                    type="button"
                                    aria-pressed={!dockAutoHide}
                                    onClick={() => {
                                        dispatch({
                                            type: "change-dock-auto-hide",
                                            enabled: false,
                                        });
                                        saveServerPreferences({
                                            dockAutoHide: false,
                                        });
                                    }}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                                        !dockAutoHide
                                            ? "bg-blue-600 text-white shadow-sm"
                                            : "bg-slate-200/70 hover:bg-slate-300/80 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-300"
                                    }`}
                                >
                                    {t("dockAlways")}
                                </button>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-2">
                        <div>
                            <p className="font-semibold text-sm">
                                {t("wallpaperLabel")}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                {t("wallpaperDesc")}
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mt-3 sm:grid-cols-4">
                            {wallpaperOptions.map(({ id, labels }) => (
                                <button
                                    key={id}
                                    type="button"
                                    aria-pressed={wallpaper === id}
                                    onClick={() => {
                                        dispatch({
                                            type: "change-wallpaper",
                                            wallpaper: id,
                                        });
                                        saveServerPreferences({
                                            wallpaper: id,
                                        });
                                    }}
                                    className={`gui-wallpaper-option group relative flex flex-col items-center p-2 rounded-xl border-2 transition-all duration-200 ${
                                        wallpaper === id
                                            ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/20"
                                            : "border-transparent bg-slate-50 dark:bg-[#272730] hover:border-slate-300 dark:hover:border-slate-700"
                                    }`}
                                >
                                    <div
                                        className="gui-wallpaper-preview"
                                        style={getWallpaperPreviewStyle(id)}
                                    />
                                    <span className="text-[11px] font-medium mt-2 text-slate-700 dark:text-slate-300">
                                        {labels[language]}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
}
