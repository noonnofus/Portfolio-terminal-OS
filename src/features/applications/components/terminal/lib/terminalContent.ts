import type { Language } from "@/shared/lib/i18n/useLanguageStore";
import { TERMINAL_COMMANDS } from "../command";
import type { TerminalAction } from "./terminalActions";
import i18n from "../../../../../shared/lib/i18n";

export type TerminalSegment =
  | { type: "text"; value: string }
  | { type: "link"; label: string; action: TerminalAction };

export type TerminalBootLine = TerminalSegment[];

export interface TerminalContent {
  bootLines: TerminalBootLine[];
  helpLines: string[];
  messages: {
    alreadyInPortfolio: string;
    restarting: string;
    shuttingDown: string;
    goodbye: string;
    welcomeBack: string;
    shutdown: string[];
    commandNotFound: (command: string) => string;
  };
}

export function getTerminalContent(language: Language): TerminalContent {
  const t = i18n.getFixedT(language, "Terminal");

  return {
    bootLines: [
      [{ type: "text", value: t("boot.introduction") }],
      [{ type: "text", value: t("boot.experience") }],
      [{ type: "text", value: t("boot.aiApproach") }],
      [{ type: "text", value: "    . " }],
      [{ type: "text", value: "    . " }],
      [{ type: "text", value: "    . " }],
      [{ type: "text", value: t("boot.helpHint") }],
      [
        { type: "text", value: t("boot.portfolioPrefix") },
        {
          type: "link",
          label: t("boot.portfolioLink"),
          action: { type: "open-portfolio" },
        },
        { type: "text", value: t("boot.portfolioSuffix") },
      ],
      [
        { type: "text", value: t("boot.languagePrefix") },
        {
          type: "link",
          label: t("boot.languageLink"),
          action: {
            type: "change-language",
            language: language === "ko" ? "en" : "ko",
          },
        },
        { type: "text", value: t("boot.languageSuffix") },
      ],
    ],
    helpLines: [
      t("help.title"),
      ...TERMINAL_COMMANDS.map(
        (command) =>
          `   ${command.name.padEnd(15)} ${t(command.descriptionKey)}`,
      ),
    ],
    messages: {
      alreadyInPortfolio: t("messages.alreadyInPortfolio"),
      restarting: t("messages.restarting"),
      shuttingDown: t("messages.shuttingDown"),
      goodbye: t("messages.goodbye"),
      welcomeBack: t("messages.welcomeBack"),
      shutdown: [t("messages.shuttingDown"), t("messages.goodbye")],
      commandNotFound: (command) =>
        t("messages.commandNotFound", { command }),
    },
  };
}
