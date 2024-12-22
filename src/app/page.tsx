'use client';

import { Terminal } from 'xterm';
import { FitAddon } from '@xterm/addon-fit';
import 'xterm/css/xterm.css';
import { useEffect, useRef } from 'react';
import writeText from './terminal/write-text';
import handleInput from './terminal/handle-input';

export default function TerminalPage() {
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const term = useRef<Terminal | null>(null);
  const fitAddon = useRef<FitAddon | null>(null);
  const inputRef = useRef('');
  const isAnimating = useRef(false);

  useEffect(() => {
    if (terminalRef.current && !term.current) {
      term.current = new Terminal();
      fitAddon.current = new FitAddon();
      term.current.loadAddon(fitAddon.current);
      term.current.open(terminalRef.current);

      // Writing the text that show first.
      writeText(term, isAnimating);

      const handleResize = () => {
        if (fitAddon.current) {
          fitAddon.current.fit();
        }
      };

      window.addEventListener('resize', handleResize);

      // Initialize the size
      handleResize();

      term.current.onData((data) => {
        if (!isAnimating.current) {
          handleInput(term, inputRef, data, isAnimating);
        }
      });
    }
  }, []);

  return <div ref={terminalRef} style={{ height: '100%', width: '100%' }} />;
}

// bug: The typed commands goes to the top instead of storing stacks. ✅