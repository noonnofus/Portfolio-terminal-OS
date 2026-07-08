'use client';

import { useGuiStore } from "@/features/gui/store/GuiStoreProvider";
import TerminalApp from "./TerminalApp";

export default function TerminalWindowApp({
    active = true,
    resumeSignal = 0,
}: {
    active?: boolean;
    resumeSignal?: number;
}) {
    const viewer = useGuiStore((state) => state.viewer);
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
            />
        </div>
    );
}
