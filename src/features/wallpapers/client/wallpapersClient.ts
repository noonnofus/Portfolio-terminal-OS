import type { Wallpaper } from "@/features/wallpapers/model/wallpaperTypes";

type WallpapersResponse = {
  wallpapers: Wallpaper[];
};

export async function listWallpapers(): Promise<Wallpaper[]> {
  const response = await fetch("/api/wallpapers");

  if (!response.ok) {
    throw new Error(`wallpapers_read_failed:${response.status}`);
  }

  const body = (await response.json()) as WallpapersResponse;
  return body.wallpapers;
}
