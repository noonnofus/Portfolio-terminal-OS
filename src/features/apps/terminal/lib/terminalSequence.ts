import type { Terminal } from "@xterm/xterm";

export type TerminalSequenceStep =
  | { type: "write"; value: string }
  | { type: "type"; value: string; delayMs: number }
  | { type: "line-break" }
  | { type: "wait"; delayMs: number };

export interface TerminalSequenceController {
  run(terminal: Terminal, steps: TerminalSequenceStep[]): Promise<boolean>;
  pause(): void;
  resume(): void;
  cancel(): void;
}

interface ActiveRun {
  generation: number;
  resolve: (completed: boolean) => void;
  settled: boolean;
}

export function createTerminalSequenceController(): TerminalSequenceController {
  type ScheduledTask = {
    callback: () => void;
    dueAt: number;
  };

  type PausedTask = {
    callback: () => void;
    remainingMs: number;
  };

  let generation = 0;
  let activeRun: ActiveRun | null = null;
  let paused = false;
  const timers = new Map<ReturnType<typeof setTimeout>, ScheduledTask>();
  let pausedTasks: PausedTask[] = [];

  const clearScheduledTasks = () => {
    timers.forEach((_task, timer) => clearTimeout(timer));
    timers.clear();
    pausedTasks = [];
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
    clearScheduledTasks();
    settleActiveRun(false);
  };

  const schedule = (callback: () => void, delayMs: number) => {
    if (paused) {
      pausedTasks.push({ callback, remainingMs: delayMs });
      return;
    }

    const timer = setTimeout(() => {
      timers.delete(timer);
      callback();
    }, delayMs);

    timers.set(timer, {
      callback,
      dueAt: Date.now() + delayMs,
    });
  };

  const pause = () => {
    if (paused) return;

    paused = true;
    const now = Date.now();
    timers.forEach((task, timer) => {
      clearTimeout(timer);
      pausedTasks.push({
        callback: task.callback,
        remainingMs: Math.max(0, task.dueAt - now),
      });
    });
    timers.clear();
  };

  const resume = () => {
    if (!paused) return;

    paused = false;
    const tasks = pausedTasks;
    pausedTasks = [];
    tasks.forEach((task) => schedule(task.callback, task.remainingMs));
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

      if (paused) {
        schedule(() => runStep(0), 0);
      } else {
        runStep(0);
      }
    });
  };

  return { run, pause, resume, cancel };
}
