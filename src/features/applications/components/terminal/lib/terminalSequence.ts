import type { Terminal } from "@xterm/xterm";

export type TerminalSequenceStep =
  | { type: "write"; value: string }
  | { type: "type"; value: string; delayMs: number }
  | { type: "line-break" }
  | { type: "wait"; delayMs: number };

export interface TerminalSequenceController {
  run(terminal: Terminal, steps: TerminalSequenceStep[]): Promise<boolean>;
  cancel(): void;
}

interface ActiveRun {
  generation: number;
  resolve: (completed: boolean) => void;
  settled: boolean;
}

export function createTerminalSequenceController(): TerminalSequenceController {
  let generation = 0;
  let activeRun: ActiveRun | null = null;
  const timers = new Set<ReturnType<typeof setTimeout>>();

  const clearTimers = () => {
    timers.forEach(clearTimeout);
    timers.clear();
  };

  const settleActiveRun = (completed: boolean) => {
    if (!activeRun || activeRun.settled) return;

    const { resolve } = activeRun;
    activeRun.settled = true;
    activeRun = null;
    resolve(completed);
  };

  const cancel = () => {
    generation += 1;
    clearTimers();
    settleActiveRun(false);
  };

  const run = (terminal: Terminal, steps: TerminalSequenceStep[]) => {
    cancel();

    const currentGeneration = generation;

    return new Promise<boolean>((resolve) => {
      activeRun = {
        generation: currentGeneration,
        resolve,
        settled: false,
      };

      const isCurrentRun = () =>
        activeRun?.generation === currentGeneration && !activeRun.settled;

      const finish = (completed: boolean) => {
        if (!isCurrentRun()) return;
        settleActiveRun(completed);
      };

      const schedule = (callback: () => void, delayMs: number) => {
        const timer = setTimeout(() => {
          timers.delete(timer);
          if (!isCurrentRun()) return;
          callback();
        }, delayMs);

        timers.add(timer);
      };

      const runStep = (stepIndex: number): void => {
        if (!isCurrentRun()) return;

        if (stepIndex >= steps.length) {
          finish(true);
          return;
        }

        const step = steps[stepIndex];

        switch (step.type) {
          case "write":
            terminal.write(step.value);
            runStep(stepIndex + 1);
            return;
          case "line-break":
            terminal.write("\r\n");
            runStep(stepIndex + 1);
            return;
          case "wait":
            schedule(() => runStep(stepIndex + 1), step.delayMs);
            return;
          case "type": {
            const writeCharacter = (characterIndex: number): void => {
              if (!isCurrentRun()) return;

              if (characterIndex >= step.value.length) {
                runStep(stepIndex + 1);
                return;
              }

              terminal.write(step.value[characterIndex]);
              schedule(
                () => writeCharacter(characterIndex + 1),
                step.delayMs,
              );
            };

            writeCharacter(0);
            return;
          }
        }
      };

      runStep(0);
    });
  };

  return { run, cancel };
}
