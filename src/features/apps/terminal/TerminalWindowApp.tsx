'use client';

import TerminalApp from "./TerminalApp";

export default function TerminalWindowApp({
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
            <TerminalApp
                active={active}
                resumeSignal={resumeSignal}
            />
        </div>
    );
}
