import type { Metadata } from "next";
import { GuiV2Entry } from "@/features/gui-v2/GuiV2Entry";

export const metadata: Metadata = {
    title: "GUI V2 Preview",
    robots: {
        index: false,
        follow: false,
    },
};

export default function GuiV2PreviewPage() {
    return <GuiV2Entry />;
}
