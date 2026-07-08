import "server-only";

import { isEnabledWallpaper } from "@/features/wallpapers/server/wallpaperRepository";
import { createSupabaseAdminClient } from "@/shared/lib/supabase/admin";
import type {
  UserPreferencesInput,
  UserTheme,
} from "@/features/user-preferences/model/preferenceSchemas";

export type UserPreferences = UserPreferencesInput;

type UserPreferencesRow = {
  language: "ko" | "en";
  theme: UserTheme;
  dock_auto_hide: boolean;
  wallpaper_id: string;
};

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  language: "ko",
  theme: "light",
  dockAutoHide: false,
  wallpaperId: "golden_gate_light",
};

function toPreferences(row: UserPreferencesRow): UserPreferences {
  return {
    language: row.language,
    theme: row.theme,
    dockAutoHide: row.dock_auto_hide,
    wallpaperId: row.wallpaper_id,
  };
}

export async function getUserPreferences(
  accountId: string,
): Promise<UserPreferences> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("user_preferences")
    .select("language, theme, dock_auto_hide, wallpaper_id")
    .eq("account_id", accountId)
    .maybeSingle();

  if (error) throw new Error("Failed to read user preferences");
  return data === null
    ? DEFAULT_USER_PREFERENCES
    : toPreferences(data as UserPreferencesRow);
}

export async function saveUserPreferences(
  accountId: string,
  preferences: UserPreferencesInput,
): Promise<UserPreferences | null> {
  if (!(await isEnabledWallpaper(preferences.wallpaperId))) {
    return null;
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("user_preferences")
    .upsert(
      {
        account_id: accountId,
        language: preferences.language,
        theme: preferences.theme,
        dock_auto_hide: preferences.dockAutoHide,
        wallpaper_id: preferences.wallpaperId,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "account_id" },
    )
    .select("language, theme, dock_auto_hide, wallpaper_id")
    .single();

  if (error || data === null) {
    throw new Error("Failed to save user preferences");
  }

  return toPreferences(data as UserPreferencesRow);
}
