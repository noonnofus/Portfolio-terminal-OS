"use client";

import dynamic from "next/dynamic";
import { WindowLoadingState } from "@/features/gui/components/WindowLoadingState";
import type { GuiAppComponentProps } from "@/features/gui/registry/appTypes";
import { ensureProjectNamespace } from "@/shared/lib/i18n/loadProjectNamespace";

export const flareAppLoader = dynamic<GuiAppComponentProps<"project:flare">>(
  async () => {
    await ensureProjectNamespace("Flare");
    const { default: App } = await import("./FlareApp");
    return function FlareAdapter({ language }) {
      return <App language={language} />;
    };
  },
  { loading: WindowLoadingState },
);
