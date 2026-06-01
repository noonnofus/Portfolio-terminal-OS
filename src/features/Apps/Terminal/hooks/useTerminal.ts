import { useEffect, useRef } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';

interface UseTerminalProps {
    fontSize?: number;
    onInput?: (data: string, term: Terminal) => void;
}

export function useTerminal({ fontSize = 14, onInput }: UseTerminalProps = {}) {
    const terminalRef = useRef<HTMLDivElement>(null);
    const termInstance = useRef<Terminal | null>(null);
    const fitAddonInstance = useRef<FitAddon | null>(null);
    const resizeObserver = useRef<ResizeObserver | null>(null);

    useEffect(() => {
        if (!terminalRef.current) return;
        const targetElement = terminalRef.current;

        // Initialize xterm
        const term = new Terminal({
            cursorBlink: true,
            fontSize,
            fontFamily: 'Pretendard, monospace',
            theme: {
                background: '#000000',
                foreground: '#3CD607',
            },
        });
        
        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        
        termInstance.current = term;
        fitAddonInstance.current = fitAddon;

        term.open(targetElement);

        // Safely fit once opened
        setTimeout(() => {
            if (targetElement && targetElement.clientWidth > 0) {
                try {
                    fitAddon.fit();
                } catch (e) {
                    console.debug('Initial fit skipped', e);
                }
            }
        }, 50);

        // Handle Input
        const onDataDisposable = term.onData((data) => {
            if (onInput) onInput(data, term);
        });

        // Resize observer for dynamic container sizing
        resizeObserver.current = new ResizeObserver(() => {
            if (targetElement.clientWidth > 0 && targetElement.clientHeight > 0) {
                try {
                    fitAddon.fit();
                } catch (e) {
                    console.debug('Resize fit skipped', e);
                }
            }
        });
        resizeObserver.current.observe(targetElement);

        // Cleanup
        return () => {
            onDataDisposable.dispose();
            resizeObserver.current?.disconnect();
            term.dispose();
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
        term: termInstance.current,
    };
}
