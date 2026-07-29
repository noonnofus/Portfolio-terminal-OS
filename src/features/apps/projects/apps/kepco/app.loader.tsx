"use client";

import dynamic from "next/dynamic";
import { WindowLoadingState } from "@/features/gui/components/WindowLoadingState";
import type { GuiAppComponentProps } from "@/features/gui/registry/appTypes";
import { ensureProjectNamespace } from "@/shared/lib/i18n/loadProjectNamespace";

export const kepcoAppLoader = dynamic<GuiAppComponentProps<"project:kepco">>(
  async () => {
    await ensureProjectNamespace("Kepco");
    const { default: App } = await import("./KepcoApp");
    return function KepcoAdapter({ language }) {
      return <App language={language} />;
    };
  },
  { loading: WindowLoadingState },
);
