"use client";

import dynamic from "next/dynamic";
import { WindowLoadingState } from "@/features/gui/components/WindowLoadingState";
import type { GuiAppComponentProps } from "@/features/gui/registry/appTypes";
import { ensureProjectNamespace } from "@/shared/lib/i18n/loadProjectNamespace";

export const portfolioAppLoader = dynamic<
  GuiAppComponentProps<"project:portfolio">
>(
  async () => {
    await ensureProjectNamespace("Portfolio");
    const { default: App } = await import("./PortfolioApp");
    return function PortfolioAdapter({ language }) {
      return <App language={language} />;
    };
  },
  { loading: WindowLoadingState },
);
