"use client";

import dynamic from "next/dynamic";

const TerminalApp = dynamic(() => import("./TerminalApp"), {
    ssr: false,
});

export default function TerminalRouteClient() {
    return <TerminalApp />;
}
