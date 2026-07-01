"use client";

import dynamic from "next/dynamic";
import { WindowLoadingState } from "@/features/gui/components/WindowLoadingState";
import type { GuiAppComponentProps } from "@/features/gui/registry/appTypes";
import { ensureProjectNamespace } from "@/shared/lib/i18n/loadProjectNamespace";

export const webPianoAppLoader =
  dynamic<GuiAppComponentProps<"project:webpiano">>(
    async () => {
      await ensureProjectNamespace("WebPiano");
      const { default: App } = await import("./WebPianoApp");
      return function WebPianoAdapter({ language }) {
        return <App language={language} />;
      };
    },
    { loading: WindowLoadingState },
  );
