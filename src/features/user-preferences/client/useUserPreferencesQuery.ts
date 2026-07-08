"use client";

import { useQuery } from "@tanstack/react-query";

import { getUserPreferences } from "@/features/user-preferences/client/userPreferencesClient";
import { userPreferenceQueryKeys } from "@/features/user-preferences/client/userPreferenceQueryKeys";

export function useUserPreferencesQuery(viewerKey: string | null) {
  return useQuery({
    queryKey: userPreferenceQueryKeys.detail(viewerKey ?? "guest"),
    queryFn: getUserPreferences,
    enabled: viewerKey !== null,
  });
}
