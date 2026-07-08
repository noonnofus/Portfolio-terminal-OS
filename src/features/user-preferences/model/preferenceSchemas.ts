export type UserTheme = "light" | "dark" | "system";

export type UserPreferencesInput = {
  language: "ko" | "en";
  theme: UserTheme;
  dockAutoHide: boolean;
  wallpaperId: string;
};

export function parseUserPreferencesInput(
  value: unknown,
): UserPreferencesInput | null {
  if (
    typeof value !== "object" ||
    value === null ||
    Array.isArray(value)
  ) {
    return null;
  }

  const record = value as Record<string, unknown>;
  const keys = Object.keys(record);
  if (
    keys.length !== 4 ||
    !keys.every((key) =>
      ["language", "theme", "dockAutoHide", "wallpaperId"].includes(key),
    )
  ) {
    return null;
  }

  const { dockAutoHide, language, theme, wallpaperId } = record;
  if (language !== "ko" && language !== "en") return null;
  if (theme !== "light" && theme !== "dark" && theme !== "system") {
    return null;
  }
  if (typeof dockAutoHide !== "boolean") return null;
  if (
    typeof wallpaperId !== "string" ||
    wallpaperId.length < 1 ||
    wallpaperId.length > 80
  ) {
    return null;
  }

  return { dockAutoHide, language, theme, wallpaperId };
}
