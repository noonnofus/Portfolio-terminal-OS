import "server-only";
import { cookies } from "next/headers";
import { DEFAULT_UI_PREFERENCES, UI_PREFERENCES_COOKIE, decodeUiPreferences } from "./uiPreferences";

export async function readUiPreferences() {
  return decodeUiPreferences((await cookies()).get(UI_PREFERENCES_COOKIE)?.value) ?? DEFAULT_UI_PREFERENCES;
}
