import type { UserPreferencesInput } from "@/features/user-preferences/model/preferenceSchemas";

type UserPreferencesResponse = {
  preferences: UserPreferencesInput;
};

export async function getUserPreferences(): Promise<UserPreferencesInput> {
  const response = await fetch("/api/user/preferences", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`user_preferences_read_failed:${response.status}`);
  }

  const body = (await response.json()) as UserPreferencesResponse;
  return body.preferences;
}
