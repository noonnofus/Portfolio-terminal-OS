import type { CSSProperties } from "react";
import {
  wallpaperCatalog,
  type WallpaperId,
} from "@/features/settings/config/wallpaperCatalog";

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
  "--application-wallpaper-overlay": string;
  "--application-wallpaper-position": string;
};

export function getWallpaperStyle(
  wallpaperId: WallpaperId,
): WallpaperCSSProperties {
  const wallpaper = wallpaperCatalog[wallpaperId];
  return {
    "--application-wallpaper-overlay": overlayPresets[wallpaper.overlayPreset],
    "--application-wallpaper-position": positionPresets[wallpaper.positionPreset],
  };
}
