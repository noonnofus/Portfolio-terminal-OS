import type { Language } from "@/shared/lib/i18n/useLanguageStore";
import { getTerminalContent } from "./terminalContent";

export type TerminalCommandResult =
  | { type: "noop" }
  | { type: "write-lines"; lines: string[] }
  | { type: "clear" }
  | { type: "open-portfolio" }
  | { type: "change-language"; language: Language }
  | { type: "reboot"; message: string }
  | { type: "shutdown"; lines: string[] };

export interface CommandContext {
  pathname: string;
  language: Language;
}

export const executeCommand = (
  cmd: string,
  context: CommandContext,
): TerminalCommandResult => {
  const trimmed = cmd.trim().toLowerCase();
  const content = getTerminalContent(context.language);

  if (trimmed === "help") {
    return { type: "write-lines", lines: content.helpLines };
  }

  if (trimmed === "clear") return { type: "clear" };
  if (trimmed === "reboot") {
    return { type: "reboot", message: content.messages.restarting };
  }
  if (trimmed === "shutdown") {
    return { type: "shutdown", lines: content.messages.shutdown };
  }
  if (trimmed === "ko" || trimmed === "en") {
    return { type: "change-language", language: trimmed };
  }

  if (trimmed === "startx") {
    if (context.pathname.includes("gui")) {
      return {
        type: "write-lines",
        lines: [content.messages.alreadyInPortfolio],
      };
    }
    return { type: "open-portfolio" };
  }

  if (trimmed === "") return { type: "noop" };

  return {
    type: "write-lines",
    lines: [content.messages.commandNotFound(trimmed)],
  };
};
