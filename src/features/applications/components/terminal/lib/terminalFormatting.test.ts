import { describe, expect, it } from "vitest";
import { TERMINAL_ACTION_URI } from "./terminalActions";
import { formatTerminalLink } from "./terminalFormatting";

describe("formatTerminalLink", () => {
  it("wraps a label in OSC 8 and persistent underline codes", () => {
    const label = "Open portfolio";
    const result = formatTerminalLink(label, TERMINAL_ACTION_URI.openPortfolio);

    expect(result).toContain(`\x1b]8;;${TERMINAL_ACTION_URI.openPortfolio}\x1b\\`);
    expect(result).toContain("\x1b[4m");
    expect(result).toContain("\x1b[24m");
    expect(result).toContain("\x1b]8;;\x1b\\");
    expect(result.split(label)).toHaveLength(2);
    expect(result.indexOf("\x1b[24m")).toBeGreaterThan(result.indexOf(label));
  });
});
