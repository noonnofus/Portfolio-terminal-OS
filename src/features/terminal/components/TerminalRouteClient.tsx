"use client";

import dynamic from "next/dynamic";
import type { Language } from "@/lib/i18n/language";

const Terminal = dynamic(() => import("./Terminal"), {
    ssr: false,
});

export default function TerminalRouteClient({
    initialLanguage,
}: {
    initialLanguage?: Language;
}) {
    return (
        <Terminal
            initialLanguage={initialLanguage}
            promptIdentity={{ status: "guest" }}
        />
    );
}
