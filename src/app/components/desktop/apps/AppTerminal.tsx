'use client';

import TerminalPage from "@/app/terminal/TerminalPage";
import AppDesktopHeader from "./layout/AppDesktopHeader";

export default function AppTerminal() {
    return (
        <>
            <div style={{
                width: "75vw",
                height: "75vh",
                overflow: "scroll",
                backgroundColor: "white",
                borderRadius: "8px",
            }}>
                <AppDesktopHeader title='Terminal' />
                <TerminalPage />
            </div>
        </>
    );
}