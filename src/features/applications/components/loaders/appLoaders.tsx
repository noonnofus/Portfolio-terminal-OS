"use client";

import dynamic from "next/dynamic";
import type { Language } from "@/shared/lib/i18n/useLanguageStore";
import { ensureProjectNamespace } from "@/shared/lib/i18n/loadProjectNamespace";

type LanguageAppProps = {
    language: Language;
};

export const FolderApp = dynamic(
    () => import("@/features/applications/components/folder/AppFolder"),
);

export const AboutSiteApp = dynamic<LanguageAppProps>(
    () => import("@/features/applications/components/about-site/AppAboutSite"),
);

export const TerminalApp = dynamic(
    () => import("@/features/applications/components/terminal/AppTerminal"),
    { ssr: false },
);

export const AboutApp = dynamic<LanguageAppProps>(
    () => import("@/features/applications/components/about/AppAbout"),
);

export const ContactApp = dynamic<LanguageAppProps>(
    () => import("@/features/applications/components/contact/AppContact"),
);

export const WCHMSApp = dynamic<LanguageAppProps>(async () => {
    await ensureProjectNamespace("WCHMS");
    return import("@/features/applications/components/wchms/AppWCHMS");
});

export const FlareApp = dynamic<LanguageAppProps>(async () => {
    await ensureProjectNamespace("Flare");
    return import("@/features/applications/components/flare/AppFlare");
});

export const WeConnectApp = dynamic<LanguageAppProps>(async () => {
    await ensureProjectNamespace("WeConnect");
    return import("@/features/applications/components/we-connect/AppWeConnect");
});

export const PageSsenceApp = dynamic<LanguageAppProps>(async () => {
    await ensureProjectNamespace("PageSsence");
    return import("@/features/applications/components/page-ssence/AppPageSsence");
});

export const DiceRollerApp = dynamic<LanguageAppProps>(async () => {
    await ensureProjectNamespace("DiceRoller");
    return import("@/features/applications/components/dice-roller/AppDiceRoller");
});

export const MejubotApp = dynamic<LanguageAppProps>(async () => {
    await ensureProjectNamespace("Mejubot");
    return import("@/features/applications/components/mejubot/AppMejubot");
});

export const WebPianoApp = dynamic<LanguageAppProps>(async () => {
    await ensureProjectNamespace("WebPiano");
    return import("@/features/applications/components/web-piano/AppWebPiano");
});
