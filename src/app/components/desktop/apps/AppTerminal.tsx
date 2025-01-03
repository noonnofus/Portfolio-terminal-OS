'use client';

import AppDesktopHeader from "./layout/AppDesktopHeader";
import dynamic from 'next/dynamic';

const TerminalPage = dynamic(() => import("@/app/terminal/TerminalPage"), { ssr: false });

export default function AppTerminal() {

    return (
        <>
            <div style={{
                backgroundColor: "white",
                borderRadius: "8px 8px 0 0",
            }}>
                <AppDesktopHeader title='Terminal' />
            </div>
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
        </>
    );
}