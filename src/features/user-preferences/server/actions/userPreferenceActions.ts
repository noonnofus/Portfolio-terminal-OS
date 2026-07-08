"use server";

import { requireCurrentUserId } from "@/features/auth/server/requireCurrentViewer";
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

  const accountId = await requireCurrentUserId();
  if (accountId === null) {
    return { ok: false, status: 401, error: "unauthorized" };
  }

  const preferences = await saveUserPreferences(
    accountId,
    parsedInput,
  );
  if (preferences === null) {
    return { ok: false, status: 400, error: "invalid_wallpaper" };
  }

  return { ok: true, data: preferences };
}
