import { MutableRefObject } from 'react';
import { Terminal } from 'xterm';
import commands from '../command';

const handleInput = (term: MutableRefObject<Terminal | null>, inputRef: MutableRefObject<string>, data: string, isAnimating: MutableRefObject<boolean>) => {
    if (!term.current && isAnimating.current) return;

    const char = data.charCodeAt(0);

    if (char === 13) { // Enter key
      processCommand(term, inputRef);
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

const processCommand = (term: MutableRefObject<Terminal | null>, inputRef: MutableRefObject<string>) => {
  if (!term.current) return;
  const cmd = inputRef.current.trim();

  term.current.write('\r\n');

  if (cmd === 'help') {
    term.current?.writeln(' Available commands:');
    commands.forEach(command => {
      term.current?.writeln(`   ${command.name.padEnd(15)} ${command.description}`);
    });
  } else if (cmd === 'clear') {
    term.current.clear();
  } else {
    term.current?.writeln(` command not found: ${cmd.trim()}`);
  }

  term.current.write(' guest@noonofus.com ~ % ');
  inputRef.current = '';
};

export default handleInput;