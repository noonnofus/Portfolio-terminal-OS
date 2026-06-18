import { describe, expect, it } from "vitest";
import { TERMINAL_COMMANDS } from "../command";
import { getTerminalContent } from "./terminalContent";
import koTerminal from "../../../../../../public/locales/ko/Terminal.json";
import enTerminal from "../../../../../../public/locales/en/Terminal.json";

describe("getTerminalContent", () => {
  it("creates Korean boot content with an English language link", () => {
    const content = getTerminalContent("ko");
    const segments = content.bootLines.flat();

    expect(segments).toContainEqual({
      type: "text",
      value: "사용 가능한 명령어를 확인하려면 \"help\"를 입력하세요.",
    });
    expect(segments).toContainEqual({
      type: "link",
      label: "English",
      action: { type: "change-language", language: "en" },
    });
    expect(segments).toContainEqual({
      type: "link",
      label: "여기",
      action: { type: "open-portfolio" },
    });
  });

  it("creates English boot content with a Korean language link", () => {
    expect(getTerminalContent("en").bootLines.flat()).toContainEqual({
      type: "link",
      label: "한국어",
      action: { type: "change-language", language: "ko" },
    });
  });

  it("keeps Korean and English terminal translation keys aligned", () => {
    expect(Object.keys(enTerminal.boot).sort()).toEqual(
      Object.keys(koTerminal.boot).sort(),
    );
    expect(Object.keys(enTerminal.help).sort()).toEqual(
      Object.keys(koTerminal.help).sort(),
    );
    expect(Object.keys(enTerminal.commands).sort()).toEqual(
      Object.keys(koTerminal.commands).sort(),
    );
    expect(Object.keys(enTerminal.messages).sort()).toEqual(
      Object.keys(koTerminal.messages).sort(),
    );
  });

  it("uses the same command registry for both languages", () => {
    const commandNames = TERMINAL_COMMANDS.map((command) => command.name);

    for (const language of ["ko", "en"] as const) {
      const help = getTerminalContent(language).helpLines.join("\n");
      commandNames.forEach((command) => expect(help).toContain(command));
    }
  });

  it("builds the portfolio CTA from prefix, link, and suffix segments in both languages", () => {
    const koreanCta = getTerminalContent("ko").bootLines[7];
    const englishCta = getTerminalContent("en").bootLines[7];

    expect(koreanCta).toEqual([
      { type: "text", value: "포트폴리오를 둘러보려면 " },
      {
        type: "link",
        label: "여기",
        action: { type: "open-portfolio" },
      },
      { type: "text", value: "를 클릭하세요. 또는 \"startx\"를 입력하세요." },
    ]);
    expect(englishCta).toEqual([
      { type: "text", value: "" },
      {
        type: "link",
        label: "Click here",
        action: { type: "open-portfolio" },
      },
      { type: "text", value: " to explore my portfolio. Or type \"startx\"." },
    ]);
  });

  it("points portfolio CTAs at the open portfolio action", () => {
    for (const language of ["ko", "en"] as const) {
      expect(getTerminalContent(language).bootLines.flat()).toContainEqual(
        expect.objectContaining({
          type: "link",
          action: { type: "open-portfolio" },
        }),
      );
    }
  });

  it("limits the portfolio link label to the short CTA token in each language", () => {
    expect(getTerminalContent("ko").bootLines.flat()).toContainEqual({
      type: "link",
      label: "여기",
      action: { type: "open-portfolio" },
    });
    expect(getTerminalContent("en").bootLines.flat()).toContainEqual({
      type: "link",
      label: "Click here",
      action: { type: "open-portfolio" },
    });
  });

  it("interpolates unknown commands", () => {
    expect(getTerminalContent("en").messages.commandNotFound("wat")).toContain(
      "wat",
    );
  });

  it("provides dedicated shutdown lines in both languages", () => {
    expect(getTerminalContent("ko").messages.shutdown).toEqual([
      "시스템을 종료합니다.",
      "안녕히 가세요.",
    ]);
    expect(getTerminalContent("en").messages.shutdown).toEqual([
      "Shutting down the system.",
      "Goodbye.",
    ]);
  });

  it("provides wake greeting lines in both languages", () => {
    expect(getTerminalContent("ko").messages.welcomeBack).toBe(
      "다시 만나 반갑습니다.",
    );
    expect(getTerminalContent("en").messages.welcomeBack).toBe(
      "Welcome back. It's good to see you again.",
    );
  });
});
