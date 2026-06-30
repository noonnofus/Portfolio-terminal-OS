import { useEffect, useRef } from "react";
import type { Terminal, IDisposable } from "@xterm/xterm";
import type { FitAddon } from "@xterm/addon-fit";
import {
  parseTerminalActionUri,
  type TerminalAction,
} from "../lib/terminalActions";

interface UseTerminalProps {
  active?: boolean;
  fitSignal?: number;
  fontSize?: number;
  onInput?: (data: string, term: Terminal) => void;
  onReady?: (term: Terminal) => void;
  onAction?: (action: TerminalAction) => void;
}

export function useTerminal({
  active = true,
  fitSignal = 0,
  fontSize = 14,
  onInput,
  onReady,
  onAction,
}: UseTerminalProps = {}) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const termInstance = useRef<Terminal | null>(null);
  const fitAddonInstance = useRef<FitAddon | null>(null);
  const resizeObserver = useRef<ResizeObserver | null>(null);
  const fitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeRef = useRef(active);
  const onInputRef = useRef(onInput);
  const onReadyRef = useRef(onReady);
  const onActionRef = useRef(onAction);

  useEffect(() => {
    activeRef.current = active;
    onInputRef.current = onInput;
    onReadyRef.current = onReady;
    onActionRef.current = onAction;
  }, [active, onAction, onInput, onReady]);

  useEffect(() => {
    if (!terminalRef.current) return;
    const targetElement = terminalRef.current;
    let isDisposed = false;
    let term: Terminal | null = null;
    let fitAddon: FitAddon | null = null;
    let onDataDisposable: IDisposable | null = null;

    const init = async () => {
      const { Terminal: XTerm } = await import("@xterm/xterm");
      const { FitAddon: XFit } = await import("@xterm/addon-fit");

      if (isDisposed || !terminalRef.current) return;

      // Initialize xterm
      const nextTerm = new XTerm({
        cursorBlink: true,
        fontSize,
        fontFamily: 'Menlo, Monaco, "Courier New", monospace',
        lineHeight: 1.2,
        theme: {
          background: "#000000",
          foreground: "#3CD607",
        },
        linkHandler: {
          allowNonHttpProtocols: true,
          activate: (_event, uri) => {
            const action = parseTerminalActionUri(uri);
            if (action) onActionRef.current?.(action);
          },
        },
      });

      term = nextTerm;
      const nextFitAddon = new XFit();
      fitAddon = nextFitAddon;
      nextTerm.loadAddon(nextFitAddon);

      termInstance.current = nextTerm;
      fitAddonInstance.current = nextFitAddon;

      nextTerm.open(targetElement);
      onReadyRef.current?.(nextTerm);

      // 조정
      fitTimeoutRef.current = setTimeout(() => {
        if (targetElement && targetElement.clientWidth > 0) {
          try {
            fitAddon?.fit();
          } catch {
            // FitAddon may race the first layout pass; ResizeObserver retries.
          }
        }
        fitTimeoutRef.current = null;
      }, 50);

      // Handle Input
      onDataDisposable = nextTerm.onData((data) => {
        onInputRef.current?.(data, nextTerm);
      });

      // Resize observer for dynamic container sizing
      resizeObserver.current = new ResizeObserver(() => {
        if (targetElement.clientWidth > 0 && targetElement.clientHeight > 0) {
          try {
            nextFitAddon.fit();
          } catch {
            // Ignore transient layout races during resize.
          }
        }
      });
      if (activeRef.current) {
        resizeObserver.current.observe(targetElement);
      }
    };

    init();

    // Cleanup
    return () => {
      isDisposed = true;
      if (fitTimeoutRef.current) {
        clearTimeout(fitTimeoutRef.current);
        fitTimeoutRef.current = null;
      }
      onDataDisposable?.dispose();
      resizeObserver.current?.disconnect();
      term?.dispose();
      termInstance.current = null;
      fitAddonInstance.current = null;
    };
  }, [fontSize]);

  useEffect(() => {
    const targetElement = terminalRef.current;
    const observer = resizeObserver.current;

    if (!active) {
      observer?.disconnect();
      return;
    }

    if (targetElement && observer) {
      observer.observe(targetElement);
    }

    const fitTimer = setTimeout(() => {
      if (
        targetElement &&
        targetElement.clientWidth > 0 &&
        targetElement.clientHeight > 0
      ) {
        try {
          fitAddonInstance.current?.fit();
        } catch {
          // Layout may still be settling after a hidden window is restored.
        }
      }
    }, 0);

    return () => clearTimeout(fitTimer);
  }, [active, fitSignal]);

  const write = (text: string) => {
    termInstance.current?.write(text);
  };

  const writeln = (text: string) => {
    termInstance.current?.writeln(text);
  };

  const clear = () => {
    termInstance.current?.clear();
  };

  return {
    terminalRef,
    write,
    writeln,
    clear,
  };
}
