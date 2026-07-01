"use client";

import dynamic from "next/dynamic";
import { WindowLoadingState } from "@/features/gui/components/WindowLoadingState";
import type { GuiAppComponentProps } from "@/features/gui/registry/appTypes";
import { ensureProjectNamespace } from "@/shared/lib/i18n/loadProjectNamespace";

export const diceRollerAppLoader =
  dynamic<GuiAppComponentProps<"project:diceroller">>(
    async () => {
      await ensureProjectNamespace("DiceRoller");
      const { default: App } = await import("./DiceRollerApp");
      return function DiceRollerAdapter({ language }) {
        return <App language={language} />;
      };
    },
    { loading: WindowLoadingState },
  );
