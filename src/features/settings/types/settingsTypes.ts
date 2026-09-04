import type { ColorModePreference } from "@/components/providers/color-mode";
import type { Language } from "@/lib/i18n/language";
import type { WallpaperId } from "@/features/settings/config/wallpaperCatalog";

export type SettingsViewer =
  | { status: "guest" }
  | {
      status: "authenticated";
      displayName: string;
      email: string | null;
      avatarUrl: string | null;
      role: "user" | "admin";
    };

export type SettingsProps = {
  viewer: SettingsViewer;
  language: Language;
  languagePending: boolean;
  theme: ColorModePreference;
  wallpaper: WallpaperId;
  dockAutoHide: boolean;
  loginHref: string;
  logoutHref: string;
  onLanguageChange: (language: Language) => void;
  onThemeChange: (theme: ColorModePreference) => void;
  onWallpaperChange: (wallpaper: WallpaperId) => void;
  onDockAutoHideChange: (enabled: boolean) => void;
  onDeleteAccount: (confirmText: string) => Promise<{ status: number }>;
  onAccountDeleted: () => void;
};
