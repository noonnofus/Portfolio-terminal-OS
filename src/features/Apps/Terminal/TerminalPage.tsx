"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTerminal } from "./hooks/useTerminal";
import { executeCommand } from "./lib/commandParser";
import useIsTouchDevice from "@/features/Desktop/hooks/useIsTouchDevice";
import DefaultModal from "@/features/Desktop/components/defaultModal";
import { useDesktopStore } from "@/features/Desktop/store/useDesktopStore";

export default function TerminalPage() {
  const router = useRouter();
  const pathname = usePathname();
  const isTouchDevice = useIsTouchDevice();
  const isModalOpen = useDesktopStore((state) => state.showModal);

  const inputRef = useRef("");

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearPendingCommandTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const { terminalRef, write, writeln, clear } = useTerminal({
    fontSize: isTouchDevice ? 12 : 14,
    onInput: (data) => {
      const char = data.charCodeAt(0);

      if (char === 13) {
        // Enter
        const cmd = inputRef.current;
        const result = executeCommand(cmd, pathname);

        writeln(""); // New line after enter

        if (result.action === "clear") {
          clear();
        } else if (result.action === "startx") {
          router.push("/gui");
          return;
        } else if (result.action === "shutdown" || result.action === "reboot") {
          // For reboot/shutdown, clear and simulate boot
          clear();
          writeln(" Restarting system...");
          clearPendingCommandTimeout();
          timeoutRef.current = setTimeout(() => {
            clear();
            timeoutRef.current = null;
          }, 1000);
        } else if (result.lines) {
          result.lines.forEach((line) => writeln(line));
        } else if (result.output) {
          writeln(result.output);
        }

        inputRef.current = "";
        write(" guest@noonnofus.com ~ % ");
      } else if (char === 127) {
        // Backspace
        if (inputRef.current.length > 0) {
          inputRef.current = inputRef.current.slice(0, -1);
          write("\b \b");
        }
      } else {
        // Typing
        inputRef.current += data;
        write(data);
      }
    },
  });

  useEffect(() => {
    // Initial boot message
    writeln(" Hello, I'm Kevin, Kim.");
    writeln(" I'm a full stack web developer.");
    writeln(" Welcome to my portfolio.");
    writeln("");
    write(" guest@noonnofus.com ~ % ");

    return () => {
      clearPendingCommandTimeout();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  return (
    <div className="h-full w-full p-4 bg-black box-border">
      <div ref={terminalRef} className="h-full w-full" />
      {isModalOpen && pathname !== "/gui" && <DefaultModal />}
    </div>
  );
}
