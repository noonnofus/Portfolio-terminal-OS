"use client";

import Settings from "@/features/settings/components/Settings";
import type { SettingsViewer } from "@/features/settings/types/settingsTypes";
import type { Viewer } from "@/features/auth/types/viewer";
import { useColorMode } from "@/components/providers/color-mode";
import { useGuiNavigation } from "@/app/gui/hooks/useGuiNavigation";
import { useGuiStore } from "@/app/gui/store/GuiStoreProvider";
import type { Language } from "@/lib/i18n/language";

function toSettingsViewer(viewer: Viewer): SettingsViewer {
  return viewer.status === "authenticated"
    ? {
        status: "authenticated",
        displayName: viewer.displayName,
        email: viewer.email,
        avatarUrl: viewer.avatarUrl,
        role: viewer.role,
      }
    : { status: "guest" };
}

export default function SettingsGuiAdapter({ language }: { language: Language }) {
  const { colorMode, setColorMode } = useColorMode();
  const { navigate, navigationBusy } = useGuiNavigation();
  const dispatch = useGuiStore((state) => state.dispatch);
  const dockAutoHide = useGuiStore((state) => state.dockAutoHide);
  const viewer = useGuiStore((state) => state.viewer);
  const wallpaper = useGuiStore((state) => state.wallpaper);

  return (
    <Settings
      dockAutoHide={dockAutoHide}
      language={language}
      languagePending={navigationBusy}
      loginHref="/auth/github"
      logoutHref="/auth/logout"
      onAccountDeleted={() => {
        // Account deletion must reload so authentication and the GUI viewer are re-read.
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.assign("/gui");
      }}
      onDeleteAccount={async (confirmText) => {
        const response = await fetch("/api/account", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ confirmText }),
        });
        return { status: response.status };
      }}
      onDockAutoHideChange={(enabled) =>
        dispatch({ type: "change-dock-auto-hide", enabled })
      }
      onLanguageChange={(nextLanguage) =>
        navigate({ type: "change-language", language: nextLanguage })
      }
      onThemeChange={setColorMode}
      onWallpaperChange={(nextWallpaper) =>
        dispatch({ type: "change-wallpaper", wallpaper: nextWallpaper })
      }
      theme={colorMode}
      viewer={toSettingsViewer(viewer)}
      wallpaper={wallpaper}
    />
  );
}
