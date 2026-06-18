import type { Language } from "@/shared/lib/i18n/useLanguageStore";

export type TerminalAction =
  | { type: "open-portfolio" }
  | { type: "change-language"; language: Language };

export const TERMINAL_ACTION_URI = {
  openPortfolio: "portfolio://open",
  korean: "portfolio://language/ko",
  english: "portfolio://language/en",
} as const;

export type TerminalActionUri =
  (typeof TERMINAL_ACTION_URI)[keyof typeof TERMINAL_ACTION_URI];

export function toTerminalActionUri(action: TerminalAction): TerminalActionUri {
  if (action.type === "open-portfolio") {
    return TERMINAL_ACTION_URI.openPortfolio;
  }

  return action.language === "ko"
    ? TERMINAL_ACTION_URI.korean
    : TERMINAL_ACTION_URI.english;
}

export function parseTerminalActionUri(uri: string): TerminalAction | null {
  switch (uri) {
    case TERMINAL_ACTION_URI.openPortfolio:
      return { type: "open-portfolio" };
    case TERMINAL_ACTION_URI.korean:
      return { type: "change-language", language: "ko" };
    case TERMINAL_ACTION_URI.english:
      return { type: "change-language", language: "en" };
    default:
      return null;
  }
}
