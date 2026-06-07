"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTerminal } from "./hooks/useTerminal";
import { useTerminalBootSequence } from "./hooks/useTerminalBootSequence";
import { executeCommand } from "./lib/commandParser";
import useIsTouchDevice from "@/features/Desktop/hooks/useIsTouchDevice";
import DefaultModal from "@/features/Desktop/components/defaultModal";
import { useDesktopStore } from "@/features/Desktop/store/useDesktopStore";
import { TERMINAL_PROMPT } from "./lib/bootSequence";

export default function TerminalPage() {
  const router = useRouter();
  const pathname = usePathname();
  const isTouchDevice = useIsTouchDevice();
  const isModalOpen = useDesktopStore((state) => state.showModal);

  const inputRef = useRef("");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bootSequence = useTerminalBootSequence(isTouchDevice);

  const clearPendingCommandTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const { terminalRef } = useTerminal({
    fontSize: isTouchDevice ? 12 : 14,
    onReady: bootSequence.start,
    onInput: (data, term) => {
      if (bootSequence.consumeInput(data)) return;

      const char = data.charCodeAt(0);

      if (char === 13) {
        const cmd = inputRef.current;
        const result = executeCommand(cmd, pathname);

        term.writeln("");

        if (result.action === "clear") {
          term.clear();
        } else if (result.action === "startx") {
          router.push("/gui");
          return;
        } else if (result.action === "shutdown" || result.action === "reboot") {
          term.clear();
          term.writeln(" Restarting system...");
          clearPendingCommandTimeout();
          timeoutRef.current = setTimeout(() => {
            term.clear();
            timeoutRef.current = null;
          }, 1000);
        } else if (result.lines) {
          result.lines.forEach((line) => term.writeln(line));
        } else if (result.output) {
          term.writeln(result.output);
        }

        inputRef.current = "";
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

  useEffect(() => {
    return () => {
      clearPendingCommandTimeout();
    };
  }, []);

  return (
    <div className="h-full w-full p-4 bg-black box-border">
      <div ref={terminalRef} className="h-full w-full" />
      {isModalOpen && pathname !== "/gui" && <DefaultModal />}
    </div>
  );
}
