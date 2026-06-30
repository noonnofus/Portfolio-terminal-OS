import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createTerminalSequenceController,
  type TerminalSequenceStep,
} from "./terminalSequence";

function createTerminalMock() {
  return {
    write: vi.fn(),
  };
}

describe("terminalSequence", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("runs write, type, line-break, and wait steps in order", async () => {
    const controller = createTerminalSequenceController();
    const terminal = createTerminalMock();
    const steps: TerminalSequenceStep[] = [
      { type: "write", value: "A" },
      { type: "type", value: "BC", delayMs: 10 },
      { type: "line-break" },
      { type: "wait", delayMs: 25 },
      { type: "write", value: "D" },
    ];

    const resultPromise = controller.run(terminal as never, steps);

    expect(terminal.write.mock.calls).toEqual([["A"], ["B"]]);

    await vi.advanceTimersByTimeAsync(10);
    expect(terminal.write.mock.calls).toEqual([["A"], ["B"], ["C"]]);

    await vi.advanceTimersByTimeAsync(10);
    expect(terminal.write.mock.calls).toEqual([["A"], ["B"], ["C"], ["\r\n"]]);

    await vi.advanceTimersByTimeAsync(24);
    expect(terminal.write.mock.calls).toEqual([["A"], ["B"], ["C"], ["\r\n"]]);

    await vi.advanceTimersByTimeAsync(1);
    expect(terminal.write.mock.calls).toEqual([
      ["A"],
      ["B"],
      ["C"],
      ["\r\n"],
      ["D"],
    ]);

    await expect(resultPromise).resolves.toBe(true);
  });

  it("does not advance to the next step before the timer fires", async () => {
    const controller = createTerminalSequenceController();
    const terminal = createTerminalMock();
    const resultPromise = controller.run(terminal as never, [
      { type: "wait", delayMs: 50 },
      { type: "write", value: "done" },
    ]);

    expect(terminal.write).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(49);
    expect(terminal.write).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(1);
    expect(terminal.write).toHaveBeenCalledWith("done");
    await expect(resultPromise).resolves.toBe(true);
  });

  it("stops remaining output after cancel", async () => {
    const controller = createTerminalSequenceController();
    const terminal = createTerminalMock();
    const resultPromise = controller.run(terminal as never, [
      { type: "type", value: "ABC", delayMs: 20 },
      { type: "write", value: "tail" },
    ]);

    expect(terminal.write.mock.calls).toEqual([["A"]]);

    controller.cancel();
    await vi.runAllTimersAsync();

    expect(terminal.write.mock.calls).toEqual([["A"]]);
    await expect(resultPromise).resolves.toBe(false);
  });

  it("settles the active run to false exactly once on cancel", async () => {
    const controller = createTerminalSequenceController();
    const terminal = createTerminalMock();
    const onResolved = vi.fn();

    const resultPromise = controller.run(terminal as never, [
      { type: "wait", delayMs: 50 },
      { type: "write", value: "late" },
    ]);

    resultPromise.then(onResolved);
    controller.cancel();
    controller.cancel();

    await Promise.resolve();
    await vi.runAllTimersAsync();

    expect(onResolved).toHaveBeenCalledTimes(1);
    expect(onResolved).toHaveBeenCalledWith(false);
  });

  it("cancels the previous run when a new run starts", async () => {
    const controller = createTerminalSequenceController();
    const terminal = createTerminalMock();
    const firstResolved = vi.fn();
    const secondResolved = vi.fn();

    controller
      .run(terminal as never, [
        { type: "type", value: "AB", delayMs: 30 },
        { type: "write", value: "tail-1" },
      ])
      .then(firstResolved);

    expect(terminal.write.mock.calls).toEqual([["A"]]);

    controller
      .run(terminal as never, [{ type: "write", value: "Z" }])
      .then(secondResolved);

    await Promise.resolve();
    await vi.runAllTimersAsync();

    expect(terminal.write.mock.calls).toEqual([["A"], ["Z"]]);
    expect(firstResolved).toHaveBeenCalledTimes(1);
    expect(firstResolved).toHaveBeenCalledWith(false);
    expect(secondResolved).toHaveBeenCalledTimes(1);
    expect(secondResolved).toHaveBeenCalledWith(true);
  });


  it("pauses pending timers and resumes from the remaining delay", async () => {
    const controller = createTerminalSequenceController();
    const terminal = createTerminalMock();
    const resultPromise = controller.run(terminal as never, [
      { type: "type", value: "ABC", delayMs: 20 },
    ]);

    expect(terminal.write.mock.calls).toEqual([["A"]]);

    await vi.advanceTimersByTimeAsync(10);
    controller.pause();
    await vi.advanceTimersByTimeAsync(100);
    expect(terminal.write.mock.calls).toEqual([["A"]]);

    controller.resume();
    await vi.advanceTimersByTimeAsync(9);
    expect(terminal.write.mock.calls).toEqual([["A"]]);

    await vi.advanceTimersByTimeAsync(1);
    expect(terminal.write.mock.calls).toEqual([["A"], ["B"]]);

    await vi.advanceTimersByTimeAsync(40);
    await expect(resultPromise).resolves.toBe(true);
    expect(terminal.write.mock.calls).toEqual([["A"], ["B"], ["C"]]);
  });
});
