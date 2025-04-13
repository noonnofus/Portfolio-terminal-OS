'use client';

import AppDesktopHeader from "./layout/AppDesktopHeader";
import dynamic from 'next/dynamic';
import { useState } from "react";

const TerminalPage = dynamic(() => import("@/app/terminal/TerminalPage"), { ssr: false });

export default function AppTerminal() {
    const [isFullScreen, setIsFullScreen] = useState<boolean>(true);

    return (
        <div
            style={{
                width: isFullScreen ? "100vw" : "75vw",
                height: isFullScreen ? "100vh" : "75vh",
                backgroundColor: "white",
                borderRadius: 8,
                display: "flex",
                flexDirection: "column",
            }}
        >
            <div style={{
                backgroundColor: "white",
                borderRadius: "8px 8px 0 0",
            }}>
                <AppDesktopHeader
                    appName="App Terminal"
                    title="Terminal"
                    isFullScreen={isFullScreen}
                    setIsFullScreen={setIsFullScreen} />
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
        </div>
    );
}