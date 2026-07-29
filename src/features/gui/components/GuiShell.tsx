"use client";

import { useSyncExternalStore } from "react";
import { MotionConfig } from "framer-motion";
import { DesktopApps } from "@/features/gui/components/DesktopApps";
import { GuiDock } from "@/features/gui/components/GuiDock";
import { GuiSystemBar } from "@/features/gui/components/GuiSystemBar";
import { GuiWindowLayer } from "@/features/gui/components/GuiWindowLayer";
import { PageVisibilityController } from "@/features/gui/runtime/PageVisibilityController";
import { useGuiStore } from "@/features/gui/store/GuiStoreProvider";
import { useColorMode } from "@/shared/ui/color-mode";
import "@/features/gui/styles/application.css";
import { getWallpaperStyle } from "@/features/gui/appearance/wallpaperPresentation";

export function GuiShell() {
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
        <PageVisibilityController />
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
