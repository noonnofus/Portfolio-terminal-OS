"use client";

import dynamic from "next/dynamic";
import { WindowLoadingState } from "@/features/gui/components/WindowLoadingState";
import type { GuiAppComponentProps } from "@/features/gui/registry/appTypes";

export const contactAppLoader = dynamic<GuiAppComponentProps<"contact">>(
  async () => {
    const { default: App } = await import("./ContactApp");
    return function ContactAdapter({ language }) {
      return <App language={language} />;
    };
  },
  { loading: WindowLoadingState },
);
