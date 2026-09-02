"use client";

import { useSyncExternalStore } from "react";
import { MotionConfig } from "framer-motion";
import { DesktopApps } from "@/app/gui/components/DesktopApps";
import { GuiDock } from "@/app/gui/components/GuiDock";
import { GuiSystemBar } from "@/app/gui/components/GuiSystemBar";
import { GuiWindowLayer } from "@/app/gui/components/GuiWindowLayer";
import { usePageVisibilitySync } from "@/app/gui/hooks/usePageVisibilitySync";
import { useGuiStore } from "@/app/gui/store/GuiStoreProvider";
import { useColorMode } from "@/components/providers/color-mode";
import "@/app/gui/styles/application.css";
import { getWallpaperStyle } from "@/app/gui/lib/wallpaperPresentation";

export function GuiShell() {
  usePageVisibilitySync();
  const urlReady = useGuiStore((state) => state.urlReady);
  const wallpaper = useGuiStore((state) => state.wallpaper);
  const { resolvedColorMode } = useColorMode();
  const themeMounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );

  return (
    <MotionConfig reducedMotion="user">
      <div
        className="application-shell"
        data-wallpaper={wallpaper}
        data-theme={themeMounted ? resolvedColorMode : undefined}
        style={getWallpaperStyle(wallpaper)}
      >
        <div aria-hidden="true" className="application-wallpaper-art">
          <span />
          <span />
          <span />
        </div>
        <GuiSystemBar />
        <DesktopApps />
        {urlReady ? <GuiWindowLayer /> : null}
        <GuiDock />
      </div>
    </MotionConfig>
  );
}
