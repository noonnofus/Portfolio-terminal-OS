import { describe, expect, it } from "vitest";

import { formatTerminalPrompt } from "./terminalPrompt";

describe("formatTerminalPrompt", () => {
  it("formats guest prompt", () => {
    expect(formatTerminalPrompt({ status: "guest" })).toBe(
      "guest@noonnofus.com ~ % ",
    );
  });

  it("formats authenticated prompt with simple display lowercase", () => {
    expect(
      formatTerminalPrompt({
        status: "authenticated",
        displayName: "Kevin",
      }),
    ).toBe("kevin@noonnofus.com ~ % ");
  });
});
