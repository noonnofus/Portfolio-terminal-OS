import { useCallback, useEffect, useRef } from "react";
import type { Terminal } from "@xterm/xterm";
import chooseASCII from "../lib/ascii";
import {
  TERMINAL_BOOT_LINES,
  TERMINAL_BOOT_TIMING,
  TERMINAL_PROMPT,
} from "../lib/bootSequence";

export function useTerminalBootSequence(isTouchDevice: boolean) {
  const isAnimatingRef = useRef(false);
  const terminalRef = useRef<Terminal | null>(null);
  const timersRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current.clear();
  }, []);

  const schedule = useCallback((callback: () => void, delay: number) => {
    const timer = setTimeout(() => {
      timersRef.current.delete(timer);
      callback();
    }, delay);
    timersRef.current.add(timer);
  }, []);

  const writeCompleteBoot = useCallback(
    (terminal: Terminal) => {
      clearTimers();
      terminal.reset();
      terminal.clear();
      terminal.writeln("");
      terminal.writeln("");
      chooseASCII(isTouchDevice).forEach((line) => terminal.writeln(line));
      TERMINAL_BOOT_LINES.forEach((line) => terminal.writeln(line));
      terminal.write(TERMINAL_PROMPT);
      isAnimatingRef.current = false;
    },
    [clearTimers, isTouchDevice],
  );

  const start = useCallback(
    (terminal: Terminal) => {
      clearTimers();
      terminalRef.current = terminal;
      isAnimatingRef.current = true;
      terminal.reset();
      terminal.clear();
      terminal.writeln("");
      terminal.writeln("");

      const ascii = chooseASCII(isTouchDevice);
      let asciiIndex = 0;
      let lineIndex = 0;

      const writeLine = () => {
        if (!isAnimatingRef.current) return;

        if (lineIndex >= TERMINAL_BOOT_LINES.length) {
          terminal.write(TERMINAL_PROMPT);
          isAnimatingRef.current = false;
          return;
        }

        const line = TERMINAL_BOOT_LINES[lineIndex];
        let characterIndex = 0;

        const writeCharacter = () => {
          if (!isAnimatingRef.current) return;

          if (characterIndex >= line.length) {
            terminal.write("\r\n");
            lineIndex += 1;
            writeLine();
            return;
          }

          terminal.write(line[characterIndex]);
          characterIndex += 1;
          schedule(writeCharacter, TERMINAL_BOOT_TIMING.character);
        };

        writeCharacter();
      };

      const writeAsciiLine = () => {
        if (!isAnimatingRef.current) return;

        if (asciiIndex >= ascii.length) {
          writeLine();
          return;
        }

        terminal.writeln(ascii[asciiIndex]);
        asciiIndex += 1;
        schedule(writeAsciiLine, TERMINAL_BOOT_TIMING.asciiLine);
      };

      writeAsciiLine();
    },
    [clearTimers, isTouchDevice, schedule],
  );

  const consumeInput = useCallback(
    (data: string) => {
      if (!isAnimatingRef.current) return false;

      if (data === " " && terminalRef.current) {
        writeCompleteBoot(terminalRef.current);
      }

      return true;
    },
    [writeCompleteBoot],
  );

  useEffect(() => {
    return () => {
      clearTimers();
      terminalRef.current = null;
      isAnimatingRef.current = false;
    };
  }, [clearTimers]);

  return { start, consumeInput };
}
