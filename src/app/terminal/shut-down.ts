import { MutableRefObject } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "@xterm/addon-fit";
import writeText from "./write-text";
import { setQuestion, isQuestion } from "./global-state";
import handleInput from "./handle-input";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import useIsTouchDevice from "@/lib/isTouchDevice";

const shutDown = (
  term: MutableRefObject<Terminal | null>,
  isAnimating: MutableRefObject<boolean>,
  terminalRef: MutableRefObject<HTMLDivElement | null>,
  fitAddon: MutableRefObject<FitAddon | null>,
  inputRef: MutableRefObject<string>,
  router: AppRouterInstance,
  pathname: string
) => {
  if (!term.current) return;
  term.current?.writeln(" ");
  term.current?.writeln(" ");

  const shutdownLines = [
    " Stopping all processes...",
    " Shutting down system...",
    " ",
    "    . ",
    "    . ",
    "    . ",
    " ",
    " System is shut down.",
    " Thank you for visiting.",
    " See you later.",
  ];

  let currentLine = 0;
  let isShutdown = false;
  setQuestion(false);

  function textAnimation(text: string, delay: number, callback: () => void) {
    let i = 0;

    function animateChar() {
      if (!term.current) {
        callback();
        return;
      }

      if (i < text.length) {
        term.current.write(text[i++]);
        setTimeout(animateChar, delay);
      } else {
        callback();
      }
    }

    animateChar();
  }

  function displayNextLine() {
    if (!term.current) return;

    if (currentLine < shutdownLines.length) {
      textAnimation(shutdownLines[currentLine], 50, () => {
        term.current?.write("\r\n");
        currentLine++;
        setTimeout(displayNextLine, 300);
      });
    } else {
      isShutdown = true;
      setTimeout(() => {
        if (term.current) {
          term.current.clear();
        }
      }, 1000);
    }
  }

  term.current.reset();

  displayNextLine();

  const shutdownHandler = term.current.onData((data) => {
    if (isShutdown) {
      if (!term.current) return;

      if (!isQuestion) {
        textAnimation(" Would you like to restart? (y/n)", 50, () => {
          setQuestion(true);
        });
        return;
      }

      const isTouchDevice = useIsTouchDevice();

      if (data.toLowerCase() === "y") {
        setQuestion(false);
        term.current.reset();
        term.current.clear();

        shutdownHandler.dispose();

        if (term.current && terminalRef.current) {
          const oldTerm = term.current;
          term.current = new Terminal();
          oldTerm.dispose();

          term.current.open(terminalRef.current);
          if (fitAddon.current) {
            term.current.loadAddon(fitAddon.current);
            fitAddon.current.fit();
          }

          term.current.onData((data) => {
            if (!isAnimating.current) {
              handleInput(
                term,
                inputRef,
                data,
                isAnimating,
                terminalRef,
                fitAddon,
                router,
                pathname
              );
            }
          });

          writeText(term, isAnimating, isTouchDevice);
        }
      } else if (data.toLowerCase() === "n") {
        setQuestion(false);
        textAnimation("\r\n System restart canceled.", 50, () => {});
      }
    }
  });
};

export default shutDown;
