"use client";

import dynamic from "next/dynamic";
import { WindowLoadingState } from "@/features/gui/components/WindowLoadingState";
import type { GuiAppComponentProps } from "@/features/gui/registry/appTypes";
import { ensureProjectNamespace } from "@/shared/lib/i18n/loadProjectNamespace";

export const mcpAppLoader = dynamic<GuiAppComponentProps<"project:mcp">>(
  async () => {
    await ensureProjectNamespace("Mcp");
    const { default: App } = await import("./McpApp");
    return function McpAdapter({ language }) {
      return <App language={language} />;
    };
  },
  { loading: WindowLoadingState },
);
