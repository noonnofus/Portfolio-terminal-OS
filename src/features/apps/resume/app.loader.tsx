"use client";

import dynamic from "next/dynamic";
import { WindowLoadingState } from "@/features/gui/components/WindowLoadingState";
import type { GuiAppComponentProps } from "@/features/gui/registry/appTypes";

export const resumeAppLoader = dynamic<GuiAppComponentProps<"resume">>(
  () => import("./ResumeApp"),
  { loading: WindowLoadingState },
);
