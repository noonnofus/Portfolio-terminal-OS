"use client";

import dynamic from "next/dynamic";

const Terminal = dynamic(() => import("./Terminal"), {
    ssr: false,
});

export default function TerminalRouteClient() {
    return <Terminal promptIdentity={{ status: "guest" }} />;
}
