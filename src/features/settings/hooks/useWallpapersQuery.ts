"use client";

import { useQuery } from "@tanstack/react-query";

import { wallpaperQueryKeys } from "@/features/settings/api/wallpaperQueryKeys";
import { listWallpapers } from "@/features/settings/api/wallpapersClient";

export function useWallpapersQuery() {
  return useQuery({
    queryKey: wallpaperQueryKeys.enabled,
    queryFn: listWallpapers,
  });
}
