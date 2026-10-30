"use client";

import { useSyncExternalStore } from "react";
import { MotionConfig } from "framer-motion";
import Image from "next/image";
import { DesktopShortcuts } from "@/app/desktop/components/DesktopShortcuts";
import { DesktopDock } from "@/app/desktop/components/DesktopDock";
import { DesktopSystemBar } from "@/app/desktop/components/DesktopSystemBar";
import { DesktopWindowLayer } from "@/app/desktop/components/DesktopWindowLayer";
import { usePageVisibilitySync } from "@/app/desktop/hooks/usePageVisibilitySync";
import { useDesktopStore } from "@/app/desktop/store/DesktopStoreProvider";
import { useColorMode } from "@/components/providers/color-mode";
import "@/app/desktop/styles/application.css";
import { getWallpaperStyle } from "@/app/desktop/lib/wallpaperPresentation";
import { wallpaperCatalog } from "@/features/settings/config/wallpaperCatalog";
import { selectFullscreenWindowId } from "@/app/desktop/store/desktopStore";

export function DesktopShell() {
  usePageVisibilitySync();
  const urlReady = useDesktopStore((state) => state.urlReady);
  const wallpaper = useDesktopStore((state) => state.wallpaper);
  const fullscreenWindowId = useDesktopStore(selectFullscreenWindowId);
  const setFullscreenWindow = useDesktopStore((state) => state.setFullscreenWindow);
  const wallpaperDefinition = wallpaperCatalog[wallpaper];
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
        data-fullscreen={fullscreenWindowId !== null}
        data-theme={themeMounted ? resolvedColorMode : undefined}
        style={getWallpaperStyle(wallpaper)}
        onKeyDown={(event) => {
          if (event.key === "Escape" && !event.defaultPrevented && fullscreenWindowId !== null) {
            event.preventDefault();
            setFullscreenWindow(null);
          }
        }}
      >
        <div aria-hidden="true" className="application-wallpaper-media">
          <Image
            alt=""
            className="object-cover"
            fill
            preload
            sizes="100vw"
            src={wallpaperDefinition.image}
          />
        </div>
        <div aria-hidden="true" className="application-wallpaper-overlay" />
        <div aria-hidden="true" className="application-wallpaper-art">
          <span />
          <span />
          <span />
        </div>
        <DesktopSystemBar />
        <div inert={fullscreenWindowId !== null ? true : undefined}>
          <DesktopShortcuts />
        </div>
        {urlReady ? <DesktopWindowLayer /> : null}
        <DesktopDock />
        <div aria-hidden="true" className="application-dock-bottom-edge" />
      </div>
    </MotionConfig>
  );
}
