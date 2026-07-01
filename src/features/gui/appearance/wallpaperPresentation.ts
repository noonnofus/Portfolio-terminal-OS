import type { CSSProperties } from "react";
import {
  wallpaperCatalog,
  type WallpaperId,
} from "@/features/gui/appearance/wallpaperCatalog";

const overlayPresets = {
  "soft-light":
    "linear-gradient(rgb(15 23 42 / 4%), rgb(15 23 42 / 12%))",
  "soft-dark":
    "linear-gradient(rgb(0 0 0 / 15%), rgb(0 0 0 / 30%))",
} as const;

const positionPresets = {
  center: "center",
} as const;

export type WallpaperCSSProperties = CSSProperties & {
  "--gui-wallpaper-image": string;
  "--gui-wallpaper-overlay": string;
  "--gui-wallpaper-position": string;
};

export function getWallpaperStyle(
  wallpaperId: WallpaperId,
): WallpaperCSSProperties {
  const wallpaper = wallpaperCatalog[wallpaperId];
  return {
    "--gui-wallpaper-image": `url("${wallpaper.image}")`,
    "--gui-wallpaper-overlay": overlayPresets[wallpaper.overlayPreset],
    "--gui-wallpaper-position": positionPresets[wallpaper.positionPreset],
  };
}

export function getWallpaperPreviewStyle(
  wallpaperId: WallpaperId,
): CSSProperties {
  return {
    backgroundImage: `url("${wallpaperCatalog[wallpaperId].preview}")`,
  };
}
