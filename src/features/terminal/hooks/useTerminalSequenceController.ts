"use client";

import { useEffect, useState } from "react";
import {
  createTerminalSequenceController,
  type TerminalSequenceController,
} from "../utils/terminalSequence";

export function useTerminalSequenceController(): TerminalSequenceController {
  const [controller] = useState(() => createTerminalSequenceController());

  useEffect(() => {
    return () => {
      controller.cancel();
    };
  }, [controller]);

  return controller;
}
