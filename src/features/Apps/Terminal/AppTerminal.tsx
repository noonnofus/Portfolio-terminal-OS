'use client';

import dynamic from 'next/dynamic';

const TerminalPage = dynamic(() => import("@/features/Apps/Terminal/TerminalPage"), { ssr: false });

export default function AppTerminal() {

    return (
        <div
            className="w-full h-full overflow-hidden bg-black rounded-b-lg"
        >
            <TerminalPage />
        </div>
    );
}