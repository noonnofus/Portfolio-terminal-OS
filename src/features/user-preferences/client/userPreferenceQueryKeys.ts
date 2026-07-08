export const userPreferenceQueryKeys = {
  all: ["user-preferences"] as const,
  detail: (viewerKey: string) =>
    ["user-preferences", "detail", viewerKey] as const,
};
