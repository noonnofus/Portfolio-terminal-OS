import { MutableRefObject } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from '@xterm/addon-fit';
import commands from '../command';
import writeText from './write-text';
import shutDown from './shut-down';
import { isQuestion } from './global-state';


const handleInput = (term: MutableRefObject<Terminal | null>, inputRef: MutableRefObject<string>, data: string, isAnimating: MutableRefObject<boolean>, terminalRef: MutableRefObject<HTMLDivElement | null>, fitAddon: MutableRefObject<FitAddon | null>) => {
  if (!term.current) return;

  const char = data.charCodeAt(0);

  if (isAnimating.current) {
    inputRef.current = '';
    return;
  }

  if (char === 13 && !isQuestion) { // Enter key
    processCommand(term, inputRef, isAnimating, terminalRef, fitAddon);
  } else if (char === 127) { // Backspace key
    if (inputRef.current.length > 0) {
      inputRef.current = inputRef.current.slice(0, -1);
      term.current?.write('\b \b');
    }
  } else {
    inputRef.current += data;
    term.current?.write(data);
  }
};

const processCommand = async (term: MutableRefObject<Terminal | null>, inputRef: MutableRefObject<string>, isAnimating: MutableRefObject<boolean>, terminalRef: MutableRefObject<HTMLDivElement | null>, fitAddon: MutableRefObject<FitAddon | null>) => {
  if (!term.current) return;
  const cmd = inputRef.current.trim();

  term.current.write('\r\n');

  if (cmd === 'help') {
    term.current?.writeln(' Available commands:');
    commands.forEach(command => {
      term.current?.writeln(`   ${command.name.padEnd(15)} ${command.description}`);
    });
    term.current.write(' guest@noonofus.com ~ % ');
  } else if (cmd === 'clear') {
    term.current.clear();
    term.current.write(' guest@noonofus.com ~ % ');
  } else if (cmd === 'reboot') {
    term.current.clear();

    writeText(term, isAnimating);
  } else if (cmd === 'shutdown') {
    term.current.clear();

    shutDown(term, isAnimating, terminalRef, fitAddon, inputRef);
  } else {
    term.current?.writeln(` command not found: ${cmd.trim()}`);
    term.current.write(' guest@noonofus.com ~ % ');
  }

  inputRef.current = '';
};

export default handleInput;