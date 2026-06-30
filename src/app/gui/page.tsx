import type { Metadata } from "next";
import { GuiEntry } from "@/features/gui/GuiEntry";

export const metadata: Metadata = {
  title: "Hyunho Kim | Portfolio",
};

export default function GuiPage() {
  return <GuiEntry />;
}
