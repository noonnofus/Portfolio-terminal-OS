"use client";

import dynamic from "next/dynamic";
import { WindowLoadingState } from "@/features/gui/components/WindowLoadingState";
import type { GuiAppComponentProps } from "@/features/gui/registry/appTypes";
import { ensureProjectNamespace } from "@/shared/lib/i18n/loadProjectNamespace";

export const mejuBotAppLoader =
  dynamic<GuiAppComponentProps<"project:mejubot">>(
    async () => {
      await ensureProjectNamespace("Mejubot");
      const { default: App } = await import("./MejuBotApp");
      return function MejuBotAdapter({ language }) {
        return <App language={language} />;
      };
    },
    { loading: WindowLoadingState },
  );
