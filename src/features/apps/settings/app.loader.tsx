"use client";

import dynamic from "next/dynamic";
import { WindowLoadingState } from "@/features/gui/components/WindowLoadingState";
import type { GuiAppComponentProps } from "@/features/gui/registry/appTypes";

export const settingsAppLoader = dynamic<GuiAppComponentProps<"settings">>(
  () => import("./SettingsApp"),
  { loading: WindowLoadingState },
);
