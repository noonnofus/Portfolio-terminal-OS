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

export function DesktopShell() {
  usePageVisibilitySync();
  const urlReady = useDesktopStore((state) => state.urlReady);
  const wallpaper = useDesktopStore((state) => state.wallpaper);
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
        data-theme={themeMounted ? resolvedColorMode : undefined}
        style={getWallpaperStyle(wallpaper)}
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
        <DesktopShortcuts />
        {urlReady ? <DesktopWindowLayer /> : null}
        <DesktopDock />
      </div>
    </MotionConfig>
  );
}
