import { MutableRefObject } from 'react';
import { Terminal } from 'xterm';

const ascii = [
    ` ██╗  ██╗██╗   ██╗██╗   ██╗███╗   ██╗██╗  ██╗ ██████╗`,
    ` ██║  ██║╚██╗ ██╔╝██║   ██║████╗  ██║██║  ██║██╔═══██╗`,
    ` ███████║ ╚████╔╝ ██║   ██║██╔██╗ ██║███████║██║   ██║`,
    ` ██╔══██║  ╚██╔╝  ██║   ██║██║╚██╗██║██╔══██║██║   ██║`,
    ` ██║  ██║   ██║   ╚██████╔╝██║ ╚████║██║  ██║╚██████╔╝`,
    ` ╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═╝ ╚═════╝ `,
    ` `,
    ` `,
    ` `,
];

const mobileAscii = [
    `  **                                **              `,
    ` /**       **   **                 /**              `,
    ` /**      //** **  **   ** ******* /**       ****** `,
    ` /******   //***  /**  /**//**///**/******  **////**`,
    ` /**///**   /**   /**  /** /**  /**/**///**/**   /**`,
    ` /**  /**   **    /**  /** /**  /**/**  /**/**   /**`,
    ` /**  /**  **     //****** ***  /**/**  /**//****** `,
    ` //   //  //       ////// ///   // //   //  //////  `,
    ` `,
    ` `,
    ` `,
]

const lines = [
    ' Hello, I\'m Kevin, Kim.',
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
    if (!term.current) return;
    
    if (isAnimating.current) return;
    
    let currentLine = 0;
    isAnimating.current = true;
    
    term.current.reset();
    term.current.clear();
    
    const writeAscii = () => {
        if (!term.current || !isAnimating.current) return;
        
        if (currentLine < ascii.length) {
            term.current.writeln(ascii[currentLine]);
            currentLine++;
            setTimeout(writeAscii, 300);
        } else {
            startTextAnimation();
        }
    };
    
    const writeChar = (text: string, index: number, onComplete: () => void) => {
        if (!term.current || !isAnimating.current) {
            onComplete();
            return;
        }
        
        if (index < text.length) {
            term.current.write(text[index]);
            setTimeout(() => writeChar(text, index + 1, onComplete), 50);
        } else {
            onComplete();
        }
    };
    
    const startTextAnimation = () => {
        let lineIndex = 0;
        
        const writeLine = () => {
            if (!term.current || !isAnimating.current) return;
            
            if (lineIndex < lines.length) {
                writeChar(lines[lineIndex], 0, () => {
                    if (term.current && isAnimating.current) {
                        term.current.write('\r\n');
                        lineIndex++;
                        writeLine();
                    }
                });
            } else {
                if (term.current) {
                    term.current.write(' guest@noonofus.com ~ % ');
                    isAnimating.current = false;
                }
            }
        };
        
        writeLine();
    };
    
    term.current.writeln(' ');
    term.current.writeln(' ');
    writeAscii();
    
    const handler = term.current.onData((data) => {
        if (!isAnimating.current || !term.current) return;
        
        const char = data.charCodeAt(0);
        if (char === 32) {
            cancelAnimation(term, isAnimating);
            term.current.write(' guest@noonofus.com ~ % ');
            handler.dispose();
        }
    });
}

export default writeText;