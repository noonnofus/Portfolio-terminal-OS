import "server-only";

import { createSupabaseAdminClient } from "@/shared/lib/supabase/admin";
import type {
  Wallpaper,
  WallpaperRow,
} from "@/features/wallpapers/model/wallpaperTypes";

function toWallpaper(row: WallpaperRow): Wallpaper {
  return {
    wallpaperId: row.id,
    wallpaperName: row.name,
    wallpaperUrl: row.url,
  };
}

export async function listEnabledWallpapers(): Promise<Wallpaper[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("wallpapers")
    .select("id, name, url")
    .eq("is_enabled", true)
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });

  if (error) throw new Error("Failed to list wallpapers");
  return (data as WallpaperRow[]).map(toWallpaper);
}

export async function isEnabledWallpaper(id: string): Promise<boolean> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("wallpapers")
    .select("id")
    .eq("id", id)
    .eq("is_enabled", true)
    .maybeSingle();

  if (error) throw new Error("Failed to verify wallpaper");
  return data !== null;
}
