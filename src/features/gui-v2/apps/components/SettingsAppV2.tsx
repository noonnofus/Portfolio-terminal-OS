"use client";

import { useColorMode } from "@/shared/ui/color-mode";
import { useGuiV2Store } from "@/features/gui-v2/store/GuiV2StoreProvider";
import type { GuiAppComponentProps } from "@/features/gui-v2/apps/appTypes";
import { useGuiNavigation } from "@/features/gui-v2/navigation/GuiNavigationProvider";

export default function SettingsAppV2({
    language,
}: GuiAppComponentProps<"settings">) {
    const dispatch = useGuiV2Store((state) => state.dispatch);
    const { navigate, navigationBusy } = useGuiNavigation();
    const wallpaper = useGuiV2Store((state) => state.wallpaper);
    const { colorMode, setColorMode } = useColorMode();

    const t = {
        ko: {
            title: "시스템 설정",
            general: "일반",
            appearance: "화면 스타일",
            languageLabel: "언어 설정",
            languageDesc: "시스템 언어를 변경합니다.",
            themeLabel: "테마 설정",
            themeDesc: "시스템 테마를 다크 모드 또는 라이트 모드로 전환합니다.",
            themeLight: "라이트 모드",
            themeDark: "다크 모드",
            wallpaperLabel: "배경화면 선택",
            wallpaperDesc: "데스크톱 배경 무드를 선택하세요.",
            wallpapers: {
                aurora: "알파인 트와일라잇 (기본)",
                sunset: "소프트 스펙트럼",
                forest: "포레스트 레이크",
                dark: "레드 랜드스케이프",
            },
        },
        en: {
            title: "System Settings",
            general: "General",
            appearance: "Appearance",
            languageLabel: "Language Settings",
            languageDesc: "Change the system language.",
            themeLabel: "Theme Settings",
            themeDesc: "Toggle system theme between light and dark mode.",
            themeLight: "Light Mode",
            themeDark: "Dark Mode",
            wallpaperLabel: "Choose Wallpaper",
            wallpaperDesc: "Choose a mood for your desktop background.",
            wallpapers: {
                aurora: "Alpine Twilight (Default)",
                sunset: "Soft Spectrum",
                forest: "Forest Lake",
                dark: "Red Landscape",
            },
        },
    }[language];

    return (
        <div className="gui-v2-settings-surface min-h-full w-full select-none p-6 transition-colors duration-200">
            <h3 className="text-xl font-bold border-b pb-3 mb-6 border-slate-200 dark:border-slate-700">
                {t.title}
            </h3>

            <div className="space-y-8">
                {/* ── Language settings ── */}
                <section className="space-y-2">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                        {t.general}
                    </h4>
                    <div className="gui-v2-settings-panel flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-xl gap-4">
                        <div>
                            <p className="font-semibold text-sm">{t.languageLabel}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                {t.languageDesc}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() =>
                                    navigate({
                                        type: "change-language",
                                        language: "ko",
                                    })
                                }
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
                                onClick={() =>
                                    navigate({
                                        type: "change-language",
                                        language: "en",
                                    })
                                }
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

                {/* ── Theme settings (Dark mode) ── */}
                <section className="space-y-2">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                        {t.appearance}
                    </h4>
                    <div className="gui-v2-settings-panel flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-xl gap-4">
                        <div>
                            <p className="font-semibold text-sm">{t.themeLabel}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                {t.themeDesc}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setColorMode("light")}
                                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                                    colorMode === "light"
                                        ? "bg-blue-600 text-white shadow-sm"
                                        : "bg-slate-200/70 hover:bg-slate-300/80 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-300"
                                }`}
                            >
                                {t.themeLight}
                            </button>
                            <button
                                type="button"
                                onClick={() => setColorMode("dark")}
                                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                                    colorMode === "dark"
                                        ? "bg-blue-600 text-white shadow-sm"
                                        : "bg-slate-200/70 hover:bg-slate-300/80 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-300"
                                }`}
                            >
                                {t.themeDark}
                            </button>
                        </div>
                    </div>
                </section>

                {/* ── Wallpaper settings ── */}
                <section className="space-y-2">
                    <div>
                        <p className="font-semibold text-sm">{t.wallpaperLabel}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {t.wallpaperDesc}
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-3 sm:grid-cols-4">
                        {(["aurora", "sunset", "forest", "dark"] as const).map(
                            (type) => {
                                return (
                                    <button
                                        key={type}
                                        type="button"
                                        aria-pressed={wallpaper === type}
                                        onClick={() =>
                                            dispatch({
                                                type: "change-wallpaper",
                                                wallpaper: type,
                                            })
                                        }
                                        className={`gui-v2-wallpaper-option group relative flex flex-col items-center p-2 rounded-xl border-2 transition-all duration-200 ${
                                            wallpaper === type
                                                ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/20"
                                                : "border-transparent bg-slate-50 dark:bg-[#272730] hover:border-slate-300 dark:hover:border-slate-700"
                                        }`}
                                    >
                                        <div
                                            className="gui-v2-wallpaper-preview"
                                            data-wallpaper={type}
                                        />
                                        <span className="text-[11px] font-medium mt-2 text-slate-700 dark:text-slate-300">
                                            {t.wallpapers[type]}
                                        </span>
                                    </button>
                                );
                            },
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}
