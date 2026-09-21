'use client';

import { useDesktopStore } from "@/app/desktop/store/DesktopStoreProvider";
import { useDesktopNavigation } from "@/app/desktop/hooks/useDesktopNavigation";
import Terminal from "@/features/terminal/components/Terminal";

export default function TerminalAdapter({
    active = true,
    resumeSignal = 0,
}: {
    active?: boolean;
    resumeSignal?: number;
}) {
    const viewer = useDesktopStore((state) => state.viewer);
    const { navigate } = useDesktopNavigation();
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
            <Terminal
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
