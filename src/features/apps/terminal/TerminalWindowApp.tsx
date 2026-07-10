'use client';

import { useGuiStore } from "@/features/gui/store/GuiStoreProvider";
import { useGuiNavigation } from "@/features/gui/navigation/GuiNavigationProvider";
import TerminalApp from "./TerminalApp";

export default function TerminalWindowApp({
    active = true,
    resumeSignal = 0,
}: {
    active?: boolean;
    resumeSignal?: number;
}) {
    const viewer = useGuiStore((state) => state.viewer);
    const { navigate } = useGuiNavigation();
    const promptIdentity =
        viewer.status === "authenticated"
            ? {
                  status: "authenticated" as const,
                  displayName: viewer.displayName,
              }
            : { status: "guest" as const };

    return (
        <div
            className="w-full h-full overflow-hidden bg-black rounded-b-pen-lg"
        >
            <TerminalApp
                active={active}
                promptIdentity={promptIdentity}
                resumeSignal={resumeSignal}
                onLanguageChange={(language) => {
                    navigate({ type: "change-language", language });
                }}
            />
        </div>
    );
}
