"use client";

import dynamic from "next/dynamic";
import { WindowLoadingState } from "@/features/gui/components/WindowLoadingState";
import type { GuiAppComponentProps } from "@/features/gui/registry/appTypes";
import { ensureProjectNamespace } from "@/shared/lib/i18n/loadProjectNamespace";

export const pageSsenceAppLoader =
  dynamic<GuiAppComponentProps<"project:pagessence">>(
    async () => {
      await ensureProjectNamespace("PageSsence");
      const { default: App } = await import("./PageSsenceApp");
      return function PageSsenceAdapter({ language }) {
        return <App language={language} />;
      };
    },
    { loading: WindowLoadingState },
  );
