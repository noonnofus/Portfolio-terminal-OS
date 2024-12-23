import { MutableRefObject } from 'react';
import { Terminal } from 'xterm';

const ascii = [
    ` ███╗   ██╗ ██████╗  ██████╗ ███╗   ██╗███╗   ██╗ ██████╗ ███████╗██╗   ██╗███████╗`,
    ` ████╗  ██║██╔═══██╗██╔═══██╗████╗  ██║████╗  ██║██╔═══██╗██╔════╝██║   ██║██╔════╝`,
    ` ██╔██╗ ██║██║   ██║██║   ██║██╔██╗ ██║██╔██╗ ██║██║   ██║█████╗  ██║   ██║███████╗`,
    ` ██║╚██╗██║██║   ██║██║   ██║██║╚██╗██║██║╚██╗██║██║   ██║██╔══╝  ██║   ██║╚════██║`,
    ` ██║ ╚████║╚██████╔╝╚██████╔╝██║ ╚████║██║ ╚████║╚██████╔╝██║     ╚██████╔╝███████║`,
    ` ╚═╝  ╚═══╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═══╝ ╚═════╝ ╚═╝      ╚═════╝ ╚══════╝`,
    ` `,
    ` `,
    ` `,
];

const lines = [
    ' Hello, I\'m Kevin.',
    ' I\'m a software developer.',
    ' Welcome to my portfolio.',
    '    . ',
    '    . ',
    '    . ',
    ' To see available commands, type \"help\" and press Enter.'
];

function cancelAnimation(term: MutableRefObject<Terminal | null>, isAnimating: MutableRefObject<boolean>) {
    isAnimating.current = false;

    term.current?.writeln('\n\n');
    ascii.forEach(line => term.current?.writeln(line));
    term.current?.writeln('\n\n');
    lines.forEach(line => term.current?.writeln(line));
}

function writeText(term: MutableRefObject<Terminal | null>, isAnimating: MutableRefObject<boolean>) {
    let currentLine = 0;
    isAnimating.current = true;

    term.current?.writeln(' ');
    term.current?.writeln(' ');

    function typeNextAscii() {
        if (!isAnimating.current) return;

        if (currentLine < ascii.length) {
            term.current?.writeln(ascii[currentLine++]);
            setTimeout(typeNextAscii, 300);
        } else {
            displayText();
        }
    }

    function textAnimation(text: string, delay: number, callback: () => void) {
        let i = 0;
        
        function animateChar() {
            if (!isAnimating.current) {
                callback();
                return;
            }

            if (i < text.length) {
                term.current?.write(text[i++]);
                setTimeout(animateChar, delay);
            } else {
                callback();
            }
        }

        animateChar();
    }

    function displayText() {
        if (!isAnimating.current) return;

        let currentTextLine = 0;

        function displayNextLine() {
            if (!isAnimating.current) return;

            if (currentTextLine < lines.length) {
                textAnimation(lines[currentTextLine], 50, () => {
                    term.current?.write('\r\n');
                    currentTextLine++;
                    displayNextLine();
                });
            } else {
                term.current?.write(' guest@noonofus.com ~ % ');
                isAnimating.current = false;
            }
        }

        displayNextLine();
    }

    typeNextAscii();

    term.current?.onData((data) => {
        const char = data.charCodeAt(0);
        
        if (!isAnimating.current) return;

        if (char === 32) { // Spacebar to cancel animation.
            cancelAnimation(term, isAnimating);
            term.current?.write(' guest@noonofus.com ~ % ');
        }
    });
}

export default writeText;