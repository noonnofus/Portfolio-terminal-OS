import { describe, expect, it } from "vitest";
import { executeCommand } from "./commandParser";

describe("executeCommand", () => {
    it("returns help lines for help command", () => {
        const result = executeCommand("help", { pathname: "/", language: "ko" });

        expect(result.type).toBe("write-lines");
        if (result.type !== "write-lines") return;
        expect(result.lines[0]).toBe("사용 가능한 명령어:");
        expect(result.lines.some((line) => line.includes("startx"))).toBe(true);
        expect(result.lines.some((line) => line.includes("포트폴리오"))).toBe(true);
    });

    it("returns startx action outside gui route", () => {
        expect(executeCommand("startx", { pathname: "/", language: "ko" })).toEqual({
            type: "open-portfolio",
        });
    });

    it("returns already accessed message inside gui route", () => {
        const result = executeCommand("startx", { pathname: "/gui", language: "en" });

        expect(result).toEqual({
            type: "write-lines",
            lines: ["You are already viewing the portfolio."],
        });
    });

    it("normalizes casing and trims whitespace", () => {
        expect(executeCommand("  ReBoot  ", { pathname: "/", language: "en" })).toEqual({
            type: "reboot",
            message: "Restarting the system...",
        });
    });

    it("returns a shutdown result with dedicated lines", () => {
        expect(executeCommand("shutdown", { pathname: "/", language: "en" })).toEqual({
            type: "shutdown",
            lines: ["Shutting down the system.", "Goodbye."],
        });
    });

    it.each(["ko", "en"] as const)("returns a language action for %s", (language) => {
        expect(executeCommand(language.toUpperCase(), { pathname: "/", language: "ko" })).toEqual({
            type: "change-language",
            language,
        });
    });

    it("returns not found output for unknown command", () => {
        expect(executeCommand("unknown", { pathname: "/", language: "ko" })).toEqual({
            type: "write-lines",
            lines: ["명령어를 찾을 수 없습니다: unknown"],
        });
    });
});
