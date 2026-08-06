"use client";

import dynamic from "next/dynamic";
import { WindowLoadingState } from "@/features/gui/components/WindowLoadingState";
import type { GuiAppComponentProps } from "@/features/gui/registry/appTypes";
import { ensureProjectNamespace } from "@/shared/lib/i18n/loadProjectNamespace";

export const voiceGatewayAppLoader = dynamic<
  GuiAppComponentProps<"project:voice-gateway">
>(
  async () => {
    await ensureProjectNamespace("VoiceGateway");
    const { default: App } = await import("./VoiceGatewayApp");
    return function VoiceGatewayAdapter({ language }) {
      return <App language={language} />;
    };
  },
  { loading: WindowLoadingState },
);
