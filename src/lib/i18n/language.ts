export const languages = ["ko", "en"] as const;

export type Language = (typeof languages)[number];

export const DEFAULT_LANGUAGE: Language = "ko";
export const REQUEST_LANGUAGE_HEADER = "x-portfolio-language";
