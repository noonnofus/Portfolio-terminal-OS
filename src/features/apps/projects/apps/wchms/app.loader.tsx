"use client";

import dynamic from "next/dynamic";
import { WindowLoadingState } from "@/features/gui/components/WindowLoadingState";
import type { GuiAppComponentProps } from "@/features/gui/registry/appTypes";
import { ensureProjectNamespace } from "@/shared/lib/i18n/loadProjectNamespace";

export const wchmsAppLoader = dynamic<GuiAppComponentProps<"project:wchms">>(
  async () => {
    await ensureProjectNamespace("WCHMS");
    const { default: App } = await import("./WchmsApp");
    return function WchmsAdapter({ language }) {
      return <App language={language} />;
    };
  },
  { loading: WindowLoadingState },
);
