"use client";

import dynamic from "next/dynamic";
import type { Language } from "@/shared/lib/i18n/useLanguageStore";

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

export const WCHMSApp = dynamic<LanguageAppProps>(
    () => import("@/features/applications/components/wchms/AppWCHMS"),
);

export const FlareApp = dynamic<LanguageAppProps>(
    () => import("@/features/applications/components/flare/AppFlare"),
);

export const WeConnectApp = dynamic<LanguageAppProps>(
    () => import("@/features/applications/components/we-connect/AppWeConnect"),
);

export const PageSsenceApp = dynamic<LanguageAppProps>(
    () => import("@/features/applications/components/page-ssence/AppPageSsence"),
);

export const DiceRollerApp = dynamic<LanguageAppProps>(
    () => import("@/features/applications/components/dice-roller/AppDiceRoller"),
);

export const MejubotApp = dynamic<LanguageAppProps>(
    () => import("@/features/applications/components/mejubot/AppMejubot"),
);

export const WebPianoApp = dynamic<LanguageAppProps>(
    () => import("@/features/applications/components/web-piano/AppWebPiano"),
);
