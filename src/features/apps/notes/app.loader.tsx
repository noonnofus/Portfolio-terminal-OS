"use client";

import dynamic from "next/dynamic";
import { WindowLoadingState } from "@/features/gui/components/WindowLoadingState";
import type { GuiAppComponentProps } from "@/features/gui/registry/appTypes";

export const notesAppLoader = dynamic<GuiAppComponentProps<"notes">>(
  async () => {
    const { default: App } = await import("./NotesApp");
    return function NotesAdapter({ language }) {
      return <App language={language} />;
    };
  },
  { loading: WindowLoadingState },
);
