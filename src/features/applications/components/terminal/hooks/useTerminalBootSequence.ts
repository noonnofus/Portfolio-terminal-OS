import { useCallback, useRef } from "react";
import type { Terminal } from "@xterm/xterm";
import chooseASCII from "../lib/ascii";
import {
  TERMINAL_BOOT_TIMING,
  TERMINAL_PROMPT,
} from "../lib/bootSequence";
import type { Language } from "@/shared/lib/i18n/useLanguageStore";
import {
  getTerminalContent,
  type TerminalSegment,
} from "../lib/terminalContent";
import { formatTerminalLink } from "../lib/terminalFormatting";
import { toTerminalActionUri } from "../lib/terminalActions";
import type {
  TerminalSequenceController,
  TerminalSequenceStep,
} from "../lib/terminalSequence";

interface UseTerminalBootSequenceOptions {
  isTouchDevice: boolean;
  language: Language;
  sequence: TerminalSequenceController;
}

export function useTerminalBootSequence({
  isTouchDevice,
  language,
  sequence,
}: UseTerminalBootSequenceOptions) {
  const isAnimatingRef = useRef(false);
  const terminalRef = useRef<Terminal | null>(null);
  const animationGenerationRef = useRef(0);

  const writeCompleteBoot = useCallback(
    (terminal: Terminal) => {
      const content = getTerminalContent(language);
      animationGenerationRef.current += 1;
      sequence.cancel();
      terminal.reset();
      terminal.clear();
      terminal.writeln("");
      terminal.writeln("");
      chooseASCII(isTouchDevice).forEach((line) => terminal.writeln(line));
      content.bootLines.forEach((line) => {
        line.forEach((segment) => {
          if (segment.type === "link") {
            terminal.write(
              formatTerminalLink(
                segment.label,
                toTerminalActionUri(segment.action),
              ),
            );
          } else {
            terminal.write(segment.value);
          }
        });
        terminal.write("\r\n");
      });
      terminal.write(TERMINAL_PROMPT);
      isAnimatingRef.current = false;
    },
    [isTouchDevice, language, sequence],
  );

  const start = useCallback(
    (terminal: Terminal) => {
      const content = getTerminalContent(language);
      const runGeneration = animationGenerationRef.current + 1;
      animationGenerationRef.current = runGeneration;
      terminalRef.current = terminal;
      isAnimatingRef.current = true;
      terminal.reset();
      terminal.clear();
      terminal.writeln("");
      terminal.writeln("");

      const ascii = chooseASCII(isTouchDevice);
      const steps: TerminalSequenceStep[] = [];

      ascii.forEach((line) => {
        steps.push({ type: "write", value: line });
        steps.push({ type: "line-break" });
        steps.push({ type: "wait", delayMs: TERMINAL_BOOT_TIMING.asciiLine });
      });

      content.bootLines.forEach((line) => {
        line.forEach((segment: TerminalSegment) => {
          if (segment.type === "link") {
            steps.push({
              type: "write",
              value: formatTerminalLink(
                segment.label,
                toTerminalActionUri(segment.action),
              ),
            });
            return;
          }

          steps.push({
            type: "type",
            value: segment.value,
            delayMs: TERMINAL_BOOT_TIMING.character,
          });
        });

        steps.push({ type: "line-break" });
      });

      void sequence.run(terminal, steps).then((completed) => {
        if (animationGenerationRef.current !== runGeneration) return;
        if (!completed) return;

        terminal.write(TERMINAL_PROMPT);
        isAnimatingRef.current = false;
      });
    },
    [isTouchDevice, language, sequence],
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

  const cancel = useCallback(() => {
    animationGenerationRef.current += 1;
    sequence.cancel();
    terminalRef.current = null;
    isAnimatingRef.current = false;
  }, [sequence]);

  return { start, consumeInput, cancel };
}
