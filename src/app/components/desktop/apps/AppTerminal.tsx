'use client';

import TerminalPage from "@/app/terminal/TerminalPage";
import AppDesktopHeader from "./layout/AppDesktopHeader";

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