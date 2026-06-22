"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTerminal } from "./hooks/useTerminal";
import { useTerminalBootSequence } from "./hooks/useTerminalBootSequence";
import { useTerminalSequenceController } from "./hooks/useTerminalSequenceController";
import { useTerminalSession } from "./hooks/useTerminalSession";
import { executeCommand } from "./lib/commandParser";
import useIsTouchDevice from "@/features/Desktop/hooks/useIsTouchDevice";
import { TERMINAL_PROMPT } from "./lib/bootSequence";
import { useLanguageStore } from "@/shared/lib/i18n/useLanguageStore";
import type { TerminalAction } from "./lib/terminalActions";

export default function TerminalPage({
  active = true,
  resumeSignal = 0,
}: {
  active?: boolean;
  resumeSignal?: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isTouchDevice = useIsTouchDevice();
  const currentLanguage = useLanguageStore((state) => state.currentLanguage);
  const setLanguage = useLanguageStore((state) => state.setLanguage);

  const inputRef = useRef("");
  const sequence = useTerminalSequenceController();
  const bootSequence = useTerminalBootSequence({
    isTouchDevice,
    language: currentLanguage,
    sequence,
  });
  const session = useTerminalSession({
    language: currentLanguage,
    sequence,
    startBoot: bootSequence.start,
  });

  useEffect(() => {
    if (active) {
      sequence.resume();
      return;
    }

    sequence.pause();
  }, [active, resumeSignal, sequence]);

  const handleTerminalAction = (action: TerminalAction) => {
    inputRef.current = "";

    if (action.type === "open-portfolio") {
      router.push("/gui");
      return;
    }

    setLanguage(action.language);
  };

  const { terminalRef } = useTerminal({
    active,
    fitSignal: resumeSignal,
    fontSize: isTouchDevice ? 12 : 14,
    onReady: session.onReady,
    onAction: handleTerminalAction,
    onInput: (data, term) => {
      if (session.consumeInput(data, term)) return;
      if (bootSequence.consumeInput(data)) return;

      const char = data.charCodeAt(0);

      if (char === 13) {
        const cmd = inputRef.current;
        const result = executeCommand(cmd, {
          pathname,
          language: currentLanguage,
        });

        term.writeln("");
        inputRef.current = "";

        if (result.type === "open-portfolio") {
          handleTerminalAction(result);
          return;
        }

        if (result.type === "change-language") {
          handleTerminalAction(result);
          if (result.language === currentLanguage) {
            term.write(TERMINAL_PROMPT);
          }
          return;
        }

        switch (result.type) {
          case "clear":
            term.clear();
            break;
          case "reboot":
            session.reboot(term, result.message);
            return;
          case "shutdown":
            session.shutdown(term, result.lines);
            return;
          case "write-lines":
            result.lines.forEach((line) => term.writeln(line));
            break;
          case "noop":
            break;
        }

        term.write(TERMINAL_PROMPT);
      } else if (char === 127) {
        if (inputRef.current.length > 0) {
          inputRef.current = inputRef.current.slice(0, -1);
          term.write("\b \b");
        }
      } else {
        inputRef.current += data;
        term.write(data);
      }
    },
  });

  return (
    <div className="h-full w-full p-4 bg-black box-border">
      <div ref={terminalRef} className="h-full w-full" />
    </div>
  );
}
