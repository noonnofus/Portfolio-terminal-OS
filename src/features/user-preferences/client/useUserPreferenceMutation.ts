"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { ActionResult } from "@/features/user-preferences/model/actionResult";
import type { UserPreferencesInput } from "@/features/user-preferences/model/preferenceSchemas";
import { saveUserPreferencesAction } from "@/features/user-preferences/server/actions/userPreferenceActions";
import { userPreferenceQueryKeys } from "@/features/user-preferences/client/userPreferenceQueryKeys";

function unwrapActionResult<T>(result: ActionResult<T>, prefix: string): T {
  if (!result.ok) {
    throw new Error(`${prefix}:${result.status}`);
  }

  return result.data;
}

export function useSaveUserPreferencesMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UserPreferencesInput) => {
      const result = await saveUserPreferencesAction(input);
      return unwrapActionResult<UserPreferencesInput>(
        result,
        "user_preferences_save_failed",
      );
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: userPreferenceQueryKeys.all,
      }),
  });
}
