'use client';

import TerminalPage from "./TerminalPage";

export default function AppTerminal({
    active = true,
    resumeSignal = 0,
}: {
    active?: boolean;
    resumeSignal?: number;
}) {

    return (
        <div
            className="w-full h-full overflow-hidden bg-black rounded-b-pen-lg"
        >
            <TerminalPage
                active={active}
                resumeSignal={resumeSignal}
            />
        </div>
    );
}
