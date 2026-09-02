import type { Metadata } from "next";
import { GuiClient } from "@/app/gui/GuiClient";

export const metadata: Metadata = {
  title: "Hyunho Kim | Portfolio",
};

export default function GuiPage() {
  return <GuiClient />;
}
