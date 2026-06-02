import { useEffect, useRef } from 'react';
import type { Terminal, IDisposable } from '@xterm/xterm';
import type { FitAddon } from '@xterm/addon-fit';

interface UseTerminalProps {
    fontSize?: number;
    onInput?: (data: string, term: Terminal) => void;
}

export function useTerminal({ fontSize = 14, onInput }: UseTerminalProps = {}) {
    const terminalRef = useRef<HTMLDivElement>(null);
    const termInstance = useRef<Terminal | null>(null);
    const fitAddonInstance = useRef<FitAddon | null>(null);
    const resizeObserver = useRef<ResizeObserver | null>(null);
    const fitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (!terminalRef.current) return;
        const targetElement = terminalRef.current;
        let isDisposed = false;
        let term: Terminal | null = null;
        let fitAddon: FitAddon | null = null;
        let onDataDisposable: IDisposable | null = null;

        const init = async () => {
            const { Terminal: XTerm } = await import('@xterm/xterm');
            const { FitAddon: XFit } = await import('@xterm/addon-fit');

            if (isDisposed || !terminalRef.current) return;

            // Initialize xterm
            const nextTerm = new XTerm({
                cursorBlink: true,
                fontSize,
                fontFamily: 'Menlo, Monaco, "Courier New", monospace',
                theme: {
                    background: '#000000',
                    foreground: '#3CD607',
                },
            });

            term = nextTerm;
            const nextFitAddon = new XFit();
            fitAddon = nextFitAddon;
            nextTerm.loadAddon(nextFitAddon);
            
            termInstance.current = nextTerm;
            fitAddonInstance.current = nextFitAddon;

            nextTerm.open(targetElement);

            // Safely fit once opened
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
                if (onInput) onInput(data, nextTerm);
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
            resizeObserver.current.observe(targetElement);
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
    }, [fontSize, onInput]);

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
