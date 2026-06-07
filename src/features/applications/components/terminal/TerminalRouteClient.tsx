"use client";

import dynamic from "next/dynamic";

const TerminalPage = dynamic(() => import("./TerminalPage"), {
    ssr: false,
});

export default function TerminalRouteClient() {
    return <TerminalPage />;
}
