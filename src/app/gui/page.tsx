import type { Metadata } from "next";
import { GuiV2Entry } from "@/features/gui-v2/GuiV2Entry";

export const metadata: Metadata = {
    title: "Hyunho Kim | Portfolio GUI",
};

export default function GuiPage() {
    return <GuiV2Entry />;
}
