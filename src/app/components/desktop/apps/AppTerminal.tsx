'use client';

import dynamic from 'next/dynamic';

const TerminalPage = dynamic(() => import("@/app/terminal/TerminalPage"), { ssr: false });

export default function AppTerminal() {

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                overflow: "scroll",
                backgroundColor: "white",
                borderRadius: "0 0 8px 8px",
            }}
        >
            <TerminalPage />
        </div>
    );
}