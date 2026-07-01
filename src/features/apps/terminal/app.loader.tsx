"use client";

import dynamic from "next/dynamic";
import { WindowLoadingState } from "@/features/gui/components/WindowLoadingState";
import type { GuiAppComponentProps } from "@/features/gui/registry/appTypes";
import { useAppRuntime } from "@/features/gui/runtime/AppRuntimeContext";

export const terminalAppLoader = dynamic<GuiAppComponentProps<"terminal">>(
  async () => {
    const { default: App } = await import("./TerminalWindowApp");
    return function TerminalAdapter() {
      const { effectiveVisibility, resumeEpoch } = useAppRuntime();
      return (
        <App
          active={
            effectiveVisibility === "active" ||
            effectiveVisibility === "inactive"
          }
          resumeSignal={resumeEpoch}
        />
      );
    };
  },
  { loading: WindowLoadingState, ssr: false },
);
