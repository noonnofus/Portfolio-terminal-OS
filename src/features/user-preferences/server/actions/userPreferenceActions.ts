"use server";

import { requireCurrentViewer } from "@/features/auth/server/requireCurrentViewer";
import type { ActionResult } from "@/features/user-preferences/model/actionResult";
import {
  parseUserPreferencesInput,
  type UserPreferencesInput,
} from "@/features/user-preferences/model/preferenceSchemas";
import { saveUserPreferences } from "@/features/user-preferences/server/preferenceRepository";

export async function saveUserPreferencesAction(
  input: UserPreferencesInput,
): Promise<ActionResult<UserPreferencesInput>> {
  const parsedInput = parseUserPreferencesInput(input);
  if (parsedInput === null) {
    return { ok: false, status: 400, error: "invalid_input" };
  }

  const viewer = await requireCurrentViewer();
  if (viewer === null) {
    return { ok: false, status: 401, error: "unauthorized" };
  }

  const preferences = await saveUserPreferences(
    viewer.accountId,
    parsedInput,
  );
  if (preferences === null) {
    return { ok: false, status: 400, error: "invalid_wallpaper" };
  }

  return { ok: true, data: preferences };
}
