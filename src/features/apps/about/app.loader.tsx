"use client";

import dynamic from "next/dynamic";
import { WindowLoadingState } from "@/features/gui/components/WindowLoadingState";
import type { GuiAppComponentProps } from "@/features/gui/registry/appTypes";

export const aboutAppLoader = dynamic<GuiAppComponentProps<"about">>(
  async () => {
    const { default: App } = await import("./AboutApp");
    return function AboutAdapter({ language }) {
      return <App language={language} />;
    };
  },
  { loading: WindowLoadingState },
);
