import { describe, expect, it } from "vitest";
import {
  getDesktopEntryUrl,
  parseTerminalActionUri,
  TERMINAL_ACTION_URI,
  toTerminalActionUri,
} from "./terminalActions";

describe("terminal actions", () => {
  it.each([
    ["ko", "/desktop"],
    ["en", "/en/desktop"],
  ] as const)("uses the %s Desktop entry URL", (language, expectedUrl) => {
    expect(getDesktopEntryUrl(language)).toBe(expectedUrl);
  });

  it("converts actions to exact internal URIs", () => {
    expect(toTerminalActionUri({ type: "open-portfolio" })).toBe(
      TERMINAL_ACTION_URI.openPortfolio,
    );
    expect(
      toTerminalActionUri({ type: "change-language", language: "ko" }),
    ).toBe(TERMINAL_ACTION_URI.korean);
    expect(
      toTerminalActionUri({ type: "change-language", language: "en" }),
    ).toBe(TERMINAL_ACTION_URI.english);
  });

  it("parses only allowed internal URIs", () => {
    expect(parseTerminalActionUri(TERMINAL_ACTION_URI.openPortfolio)).toEqual({
      type: "open-portfolio",
    });
    expect(parseTerminalActionUri(TERMINAL_ACTION_URI.korean)).toEqual({
      type: "change-language",
      language: "ko",
    });
    expect(parseTerminalActionUri(TERMINAL_ACTION_URI.english)).toEqual({
      type: "change-language",
      language: "en",
    });
  });

  it.each([
    "portfolio://open/extra",
    "portfolio://language/ja",
    "javascript:alert(1)",
    "https://example.com",
  ])("rejects non-allowlisted URI %s", (uri) => {
    expect(parseTerminalActionUri(uri)).toBeNull();
  });
});
