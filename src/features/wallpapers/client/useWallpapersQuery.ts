"use client";

import { useQuery } from "@tanstack/react-query";

import { wallpaperQueryKeys } from "@/features/wallpapers/client/wallpaperQueryKeys";
import { listWallpapers } from "@/features/wallpapers/client/wallpapersClient";

export function useWallpapersQuery() {
  return useQuery({
    queryKey: wallpaperQueryKeys.enabled,
    queryFn: listWallpapers,
  });
}
