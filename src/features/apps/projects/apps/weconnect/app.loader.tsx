"use client";

import dynamic from "next/dynamic";
import { WindowLoadingState } from "@/features/gui/components/WindowLoadingState";
import type { GuiAppComponentProps } from "@/features/gui/registry/appTypes";
import { ensureProjectNamespace } from "@/shared/lib/i18n/loadProjectNamespace";

export const weConnectAppLoader =
  dynamic<GuiAppComponentProps<"project:weconnect">>(
    async () => {
      await ensureProjectNamespace("WeConnect");
      const { default: App } = await import("./WeConnectApp");
      return function WeConnectAdapter({ language }) {
        return <App language={language} />;
      };
    },
    { loading: WindowLoadingState },
  );
