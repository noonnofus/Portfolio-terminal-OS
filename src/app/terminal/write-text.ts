import { MutableRefObject } from 'react';
import { Terminal } from 'xterm';

function cancelAnimation(term: MutableRefObject<Terminal | null>, isAnimating: MutableRefObject<boolean>) {
    isAnimating.current = false;

    term.current?.writeln(' ');
    term.current?.writeln(' ');
    term.current?.writeln(` ███╗   ██╗ ██████╗  ██████╗ ███╗   ██╗███╗   ██╗ ██████╗ ███████╗██╗   ██╗███████╗`);
    term.current?.writeln(` ████╗  ██║██╔═══██╗██╔═══██╗████╗  ██║████╗  ██║██╔═══██╗██╔════╝██║   ██║██╔════╝`);
    term.current?.writeln(` ██╔██╗ ██║██║   ██║██║   ██║██╔██╗ ██║██╔██╗ ██║██║   ██║█████╗  ██║   ██║███████╗`);
    term.current?.writeln(` ██║╚██╗██║██║   ██║██║   ██║██║╚██╗██║██║╚██╗██║██║   ██║██╔══╝  ██║   ██║╚════██║`);
    term.current?.writeln(` ██║ ╚████║╚██████╔╝╚██████╔╝██║ ╚████║██║ ╚████║╚██████╔╝██║     ╚██████╔╝███████║`);
    term.current?.writeln(` ╚═╝  ╚═══╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═══╝ ╚═════╝ ╚═╝      ╚═════╝ ╚══════╝`);
    term.current?.writeln(' ');
    term.current?.writeln(' ');
    term.current?.writeln(' ');
    term.current?.writeln(' Hello, I\'m Kevin.');
    term.current?.writeln(' I\'m a software developer.');
    term.current?.writeln(' Welcome,');
    term.current?.writeln('    . ');
    term.current?.writeln('    . ');
    term.current?.writeln('    . ');
    term.current?.writeln(' To see available commands, type \"help\" and press Enter.');
};

function writeText(term: MutableRefObject<Terminal | null>, isAnimating: MutableRefObject<boolean>) {
    isAnimating.current = true;

    term.current?.writeln(' ');
    term.current?.writeln(' ');

    const asciiArt = [
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

    let currentLine = 0;

    const typeNextAscii = () => {
        if (!isAnimating.current) return;
        if (currentLine < asciiArt.length) {
            term.current?.writeln(asciiArt[currentLine++]);
            setTimeout(typeNextAscii, 300);
        } else {
            displayText();
        }
    };

    const displayText = () => {
        if (!isAnimating.current) return;

        const lines = [
            ' Hello, I\'m Kevin.',
            ' I\'m a software developer.',
            ' Welcome to my portfolio.',
            '    . ',
            '    . ',
            '    . ',
            ' To see available commands, type \"help\" and press Enter.'
        ];

        let currentTextLine = 0;

        const typeNextLine = () => {
            if (!isAnimating.current) return;
            if (currentTextLine < lines.length) {
                textAnimation(term, lines[currentTextLine], 50, () => {
                    term.current?.write('\r\n');
                    currentTextLine++;
                    typeNextLine();
                });
            } else {
                isAnimating.current = false;
                term.current?.write(' guest@noonofus.com ~ % ');
            }
        };

        typeNextLine();
    };

    typeNextAscii();

    term.current?.onData((data) => {
        if (data.charCodeAt(0) === 13 && isAnimating.current) { // Enter key
            cancelAnimation(term, isAnimating);
        } else {
            return;
        }
    });
}

const textAnimation = (term: MutableRefObject<Terminal | null>, text: string, delay: number, callback?: () => void) => {
    let index = 0;

    const type = () => {
        if (index < text.length) {
            term.current?.write(text[index]);
            index++;
            setTimeout(type, delay);
        } else if (callback) {
            callback();
        }
    };

    type();
};

export default writeText;
