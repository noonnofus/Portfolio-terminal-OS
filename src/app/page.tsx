'use client';

import { Terminal } from 'xterm';
import { FitAddon } from '@xterm/addon-fit';
import 'xterm/css/xterm.css';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import writeText from './terminal/write-text';
import handleInput from './terminal/handle-input';

export default function TerminalPage() {
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const term = useRef<Terminal | null>(null);
  const fitAddon = useRef<FitAddon | null>(null);
  const inputRef = useRef('');
  const isAnimating = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (!terminalRef.current || term.current) {
      return;
    }

    term.current = new Terminal();
    fitAddon.current = new FitAddon();
    term.current.loadAddon(fitAddon.current);
    term.current.open(terminalRef.current);

    writeText(term, isAnimating);

    const handleResize = () => {
      if (fitAddon.current) {
        fitAddon.current.fit();
      }
    };

    window.addEventListener('resize', handleResize);

    handleResize();

    term.current.onData((data) => {
      if (!isAnimating.current) {
        handleInput(term, inputRef, data, isAnimating, terminalRef, fitAddon, router);
      }
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      term.current?.dispose();
      term.current = null;
      fitAddon.current = null;
    };
  }, []);

  console.log(
    `
      Are you looking for the source code?
      Here is what you looking for!
      https://github.com/BCITKevin/Portfolio-terminal-OS
    `
  );

  return <div ref={terminalRef} style={{ height: '100%', width: '100%' }} />;
}
