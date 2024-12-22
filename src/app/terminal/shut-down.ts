import { MutableRefObject } from 'react';
import { Terminal } from 'xterm';

function shutDown(term: MutableRefObject<Terminal | null>) {
    
    term.current?.attachCustomKeyEventHandler(() => {
        return false;
    });


    const lines = [
      ' shutdown processing...',
      ' ',
      ' ',
      '    . ',
      '    . ',
      '    . ',
      ' ',
      ' ',
      ' Thank you for visiting.',
      ' See you later.',
  ];

    term.current?.writeln(' ');
    term.current?.writeln(' ');

    displayText();

    function textAnimation(text: string, delay: number, callback: () => void) {
        let i = 0;
        
        function animateChar() {
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
        let currentTextLine = 0;

        function displayNextLine() {

            if (currentTextLine < lines.length) {
                textAnimation(lines[currentTextLine], 50, () => {
                    term.current?.write('\r\n');
                    currentTextLine++;
                    displayNextLine();
                });
            } else {
                term.current?.attachCustomKeyEventHandler(() => {
                    return true;
                });
                enableTyping();
            }
        }

        displayNextLine();
    }

    function enableTyping() {
        if (term.current) {
            term.current.write = () => {};
            term.current.writeln = () => {};

            term.current.onData((data) => {
                const char = data.charCodeAt(0);
                console.log(char);

                // shut it on code here.
            });
        }
    }
}

export default shutDown;