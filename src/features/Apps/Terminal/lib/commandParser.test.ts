import { describe, expect, it } from "vitest";
import { executeCommand } from "./commandParser";

describe("executeCommand", () => {
    it("returns help lines for help command", () => {
        const result = executeCommand("help", "/");

        expect(result.action).toBe("none");
        expect(result.lines).toBeDefined();
        expect(result.lines?.[0]).toBe(" Available commands:");
        expect(result.lines?.some((line) => line.includes("startx"))).toBe(true);
    });

    it("returns startx action outside gui route", () => {
        expect(executeCommand("startx", "/").action).toBe("startx");
    });

    it("returns already accessed message inside gui route", () => {
        const result = executeCommand("startx", "/gui");

        expect(result.action).toBe("none");
        expect(result.output).toBe(" You are already accessed to gui");
    });

    it("normalizes casing and trims whitespace", () => {
        expect(executeCommand("  ReBoot  ", "/").action).toBe("reboot");
    });

    it("returns not found output for unknown command", () => {
        expect(executeCommand("unknown", "/")).toEqual({
            action: "none",
            output: " command not found: unknown",
        });
    });
});
