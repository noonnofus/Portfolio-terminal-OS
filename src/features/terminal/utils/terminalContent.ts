import type { Language } from "@/lib/i18n/language";
import { TERMINAL_COMMANDS } from "./terminalCommands";
import type { TerminalAction } from "./terminalActions";
import enTerminal from "@/features/terminal/i18n/en/Terminal.json";
import koTerminal from "@/features/terminal/i18n/ko/Terminal.json";

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
  const resource = language === "ko" ? koTerminal : enTerminal;

  return {
    bootLines: [
      [{ type: "text", value: resource.boot.introduction }],
      [{ type: "text", value: resource.boot.experience }],
      [{ type: "text", value: resource.boot.aiApproach }],
      [{ type: "text", value: "    . " }],
      [{ type: "text", value: "    . " }],
      [{ type: "text", value: "    . " }],
      [{ type: "text", value: resource.boot.helpHint }],
      [
        { type: "text", value: resource.boot.portfolioPrefix },
        {
          type: "link",
          label: resource.boot.portfolioLink,
          action: { type: "open-portfolio" },
        },
        { type: "text", value: resource.boot.portfolioSuffix },
      ],
      [
        { type: "text", value: resource.boot.languagePrefix },
        {
          type: "link",
          label: resource.boot.languageLink,
          action: {
            type: "change-language",
            language: language === "ko" ? "en" : "ko",
          },
        },
        { type: "text", value: resource.boot.languageSuffix },
      ],
    ],
    helpLines: [
      resource.help.title,
      ...TERMINAL_COMMANDS.map(
        (command) =>
          `   ${command.name.padEnd(15)} ${resource.commands[command.name]}`,
      ),
    ],
    messages: {
      alreadyInPortfolio: resource.messages.alreadyInPortfolio,
      restarting: resource.messages.restarting,
      shuttingDown: resource.messages.shuttingDown,
      goodbye: resource.messages.goodbye,
      welcomeBack: resource.messages.welcomeBack,
      shutdown: [resource.messages.shuttingDown, resource.messages.goodbye],
      commandNotFound: (command) =>
        resource.messages.commandNotFound.replace("{{command}}", command),
    },
  };
}
