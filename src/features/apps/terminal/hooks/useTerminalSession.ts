"use client";

import { useEffect, useRef } from "react";
import type { Terminal } from "@xterm/xterm";
import type { Language } from "@/shared/lib/i18n/useLanguageStore";
import { TERMINAL_BOOT_TIMING, TERMINAL_WAKE_TIMING } from "../lib/bootSequence";
import type {
  TerminalSequenceController,
  TerminalSequenceStep,
} from "../lib/terminalSequence";
import { getTerminalContent } from "../lib/terminalContent";

/** 이 시간동안 대기. ms 단위 */
const TERMINAL_HOLD = 3_000;

type TerminalSessionMode =
  | "running"
  | "rebooting"
  | "shutting-down"
  | "off"
  | "waking";

interface UseTerminalSessionOptions {
  language: Language;
  sequence: TerminalSequenceController;
  startBoot: (terminal: Terminal) => void;
}

interface TerminalSession {
  onReady: (terminal: Terminal) => void;
  consumeInput: (data: string, terminal: Terminal) => boolean;
  reboot: (terminal: Terminal, message: string) => void;
  shutdown: (terminal: Terminal, lines: string[]) => void;
}

export function useTerminalSession({
  language,
  sequence,
  startBoot,
}: UseTerminalSessionOptions): TerminalSession {
  const modeRef = useRef<TerminalSessionMode>("running");
  const terminalRef = useRef<Terminal | null>(null);
  const previousLanguageRef = useRef<Language | null>(null);
  const startBootRef = useRef(startBoot);
  const transitionGenerationRef = useRef(0);

  useEffect(() => {
    startBootRef.current = startBoot;
  }, [startBoot]);

  const onReady = (terminal: Terminal) => {
    terminalRef.current = terminal;
    previousLanguageRef.current = language;
    modeRef.current = "running";
    transitionGenerationRef.current += 1;
    startBootRef.current(terminal);
  };

  const reboot = (terminal: Terminal, message: string) => {
    const transitionGeneration = transitionGenerationRef.current + 1;
    transitionGenerationRef.current = transitionGeneration;
    modeRef.current = "rebooting";
    terminalRef.current = terminal;
    sequence.cancel();
    terminal.reset();
    terminal.clear();

    const steps: TerminalSequenceStep[] = [
      {
        type: "type",
        value: message,
        delayMs: TERMINAL_BOOT_TIMING.character,
      },
      { type: "line-break" },
      { type: "wait", delayMs: TERMINAL_HOLD },
    ];

    void sequence.run(terminal, steps).then((completed) => {
      if (transitionGenerationRef.current !== transitionGeneration) return;
      if (!completed || modeRef.current !== "rebooting") return;

      modeRef.current = "running";
      startBootRef.current(terminal);
    });
  };

  const shutdown = (terminal: Terminal, lines: string[]) => {
    const transitionGeneration = transitionGenerationRef.current + 1;
    transitionGenerationRef.current = transitionGeneration;
    modeRef.current = "shutting-down";
    terminalRef.current = terminal;
    sequence.cancel();
    terminal.reset();
    terminal.clear();

    const steps: TerminalSequenceStep[] = [];

    lines.forEach((line) => {
      steps.push({
        type: "type",
        value: line,
        delayMs: 35,
      });
      steps.push({ type: "line-break" });
    });
    steps.push({ type: "wait", delayMs: TERMINAL_HOLD });

    void sequence.run(terminal, steps).then((completed) => {
      if (transitionGenerationRef.current !== transitionGeneration) return;
      if (!completed || modeRef.current !== "shutting-down") return;

      terminal.clear();
      modeRef.current = "off";
    });
  };

  const startWake = (terminal: Terminal) => {
    const transitionGeneration = transitionGenerationRef.current + 1;
    transitionGenerationRef.current = transitionGeneration;
    modeRef.current = "waking";
    terminalRef.current = terminal;

    const content = getTerminalContent(language);
    const steps: TerminalSequenceStep[] = [
      { type: "write", value: " ." },
      { type: "wait", delayMs: TERMINAL_WAKE_TIMING.dot },
      { type: "write", value: " ." },
      { type: "wait", delayMs: TERMINAL_WAKE_TIMING.dot },
      { type: "write", value: " ." },
      { type: "wait", delayMs: TERMINAL_HOLD },
      { type: "line-break" },
      { type: "type", value: content.messages.welcomeBack, delayMs: 35 },
      { type: "wait", delayMs: TERMINAL_HOLD },
    ];

    void sequence.run(terminal, steps).then((completed) => {
      if (transitionGenerationRef.current !== transitionGeneration) return;
      if (!completed || modeRef.current !== "waking") return;

      modeRef.current = "running";
      startBootRef.current(terminal);
    });
  };

  const consumeInput = (data: string, terminal: Terminal) => {
    if (modeRef.current === "rebooting") {
      return true;
    }

    if (modeRef.current === "shutting-down") {
      return true;
    }

    if (modeRef.current === "off") {
      startWake(terminal);
      return true;
    }

    if (modeRef.current === "waking") {
      if (data === " ") {
        transitionGenerationRef.current += 1;
        sequence.cancel();
        modeRef.current = "running";
        startBootRef.current(terminal);
      }
      return true;
    }

    return false;
  };

  useEffect(() => {
    if (previousLanguageRef.current === null) {
      previousLanguageRef.current = language;
      return;
    }

    if (previousLanguageRef.current === language) return;

    previousLanguageRef.current = language;

    if (modeRef.current !== "running" || !terminalRef.current) return;

    transitionGenerationRef.current += 1;
    startBootRef.current(terminalRef.current);
  }, [language]);

  useEffect(() => {
    return () => {
      transitionGenerationRef.current += 1;
      sequence.cancel();
      terminalRef.current = null;
      previousLanguageRef.current = null;
      modeRef.current = "running";
    };
  }, [sequence]);

  return { onReady, consumeInput, reboot, shutdown };
}
