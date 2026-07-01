import {
  publicAssetPath,
  type PublicAssetPath,
} from "@/features/gui/registry/appTypes";
import type { Language } from "@/shared/lib/i18n/useLanguageStore";

type WallpaperDefinition = {
  labels: Record<Language, string>;
  image: PublicAssetPath;
  preview: PublicAssetPath;
  tone: "light" | "dark";
  positionPreset: "center";
  overlayPreset: "soft-light" | "soft-dark";
  order: number;
};

export const wallpaperCatalog = {
  golden_gate_light: {
    labels: { ko: "Golden Gate Light", en: "Golden Gate Light" },
    image: publicAssetPath("/wallpapers/golden_gate_light.jpg"),
    preview: publicAssetPath("/wallpapers/golden_gate_light.jpg"),
    tone: "light",
    positionPreset: "center",
    overlayPreset: "soft-light",
    order: 10,
  },
  golden_gate_dark: {
    labels: { ko: "Golden Gate Dark", en: "Golden Gate Dark" },
    image: publicAssetPath("/wallpapers/golden_gate_dark.jpg"),
    preview: publicAssetPath("/wallpapers/golden_gate_dark.jpg"),
    tone: "dark",
    positionPreset: "center",
    overlayPreset: "soft-dark",
    order: 20,
  },
  tahoe_light: {
    labels: { ko: "Tahoe Light", en: "Tahoe Light" },
    image: publicAssetPath("/wallpapers/tahoe_light.jpg"),
    preview: publicAssetPath("/wallpapers/tahoe_light.jpg"),
    tone: "light",
    positionPreset: "center",
    overlayPreset: "soft-light",
    order: 30,
  },
  tahoe_dark: {
    labels: { ko: "Tahoe Dark", en: "Tahoe Dark" },
    image: publicAssetPath("/wallpapers/tahoe_dark.jpg"),
    preview: publicAssetPath("/wallpapers/tahoe_dark.jpg"),
    tone: "dark",
    positionPreset: "center",
    overlayPreset: "soft-dark",
    order: 40,
  },
  tahoe_beach_dawn: {
    labels: { ko: "Tahoe Beach - Dawn", en: "Tahoe Beach - Dawn" },
    image: publicAssetPath("/wallpapers/tahoe_beach_dawn.jpg"),
    preview: publicAssetPath("/wallpapers/tahoe_beach_dawn.jpg"),
    tone: "light",
    positionPreset: "center",
    overlayPreset: "soft-light",
    order: 50,
  },
  tahoe_beach_day: {
    labels: { ko: "Tahoe Beach - Day", en: "Tahoe Beach - Day" },
    image: publicAssetPath("/wallpapers/tahoe_beach_day.jpg"),
    preview: publicAssetPath("/wallpapers/tahoe_beach_day.jpg"),
    tone: "light",
    positionPreset: "center",
    overlayPreset: "soft-light",
    order: 60,
  },
  tahoe_beach_dusk: {
    labels: { ko: "Tahoe Beach - Dusk", en: "Tahoe Beach - Dusk" },
    image: publicAssetPath("/wallpapers/tahoe_beach_dusk.jpg"),
    preview: publicAssetPath("/wallpapers/tahoe_beach_dusk.jpg"),
    tone: "light",
    positionPreset: "center",
    overlayPreset: "soft-light",
    order: 70,
  },
  tahoe_beach_night: {
    labels: { ko: "Tahoe Beach - Night", en: "Tahoe Beach - Night" },
    image: publicAssetPath("/wallpapers/tahoe_beach_night.jpg"),
    preview: publicAssetPath("/wallpapers/tahoe_beach_night.jpg"),
    tone: "dark",
    positionPreset: "center",
    overlayPreset: "soft-dark",
    order: 80,
  },
} as const satisfies Record<string, WallpaperDefinition>;

export type WallpaperId = keyof typeof wallpaperCatalog;

export const wallpaperIds = Object.keys(
  wallpaperCatalog,
) as WallpaperId[];

export const orderedWallpapers = wallpaperIds
  .map((id) => ({ id, ...wallpaperCatalog[id] }))
  .toSorted((left, right) => left.order - right.order);

export function isWallpaperId(value: unknown): value is WallpaperId {
  return typeof value === "string" && value in wallpaperCatalog;
}
