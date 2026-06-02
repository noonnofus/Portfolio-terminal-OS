"use client";

import AppProjcetWCHMS from "@/features/Apps/WCHMS";
import AppProjcetPageSsence from "@/features/Apps/PageSsence";
import AppProjcetDiceRoller from "@/features/Apps/DiceRoller";
import AppProjcetFlare from "@/features/Apps/Flare";
import AppProjcetMejubot from "@/features/Apps/Mejubot";
import AppProjcetWeConnect from "@/features/Apps/WeConnect";
import AppProjcetWebPiano from "@/features/Apps/WebPiano";
import { Language } from "@/shared/lib/i18n/useLanguageStore";
import type { AppDefinition } from "./apps";

type ProjectAppText = {
    wchms: string;
    pagessence: string;
    diceroller: string;
    flare: string;
    mejubot: string;
    weconnect: string;
    webpiano: string;
};

export default function ProjectsApps(language: Language = "ko"): AppDefinition[] {
    const projectTexts: Record<Language, ProjectAppText> = {
        ko: {
            wchms: "WCHMS",
            pagessence: "pageSsence",
            diceroller: "다이스롤러",
            flare: "Flare",
            mejubot: "디스코드 봇",
            weconnect: "WeConnect",
            webpiano: "웹 피아노",
        },
        en: {
            wchms: "WCHMS",
            pagessence: "PageSsence",
            diceroller: "DiceRoller",
            flare: "Flare",
            mejubot: "Discord Bot",
            weconnect: "WeConnect",
            webpiano: "WebPiano",
        },
    };

    const texts = projectTexts[language];

    return [
        {
            iconName: "/wchms.png",
            appName: "Client Project WCHMS",
            title: texts.wchms,
            component: <AppProjcetWCHMS language={language} />,
        },
        {
            iconName: "/flare.png",
            appName: "Project Flare",
            title: texts.flare,
            component: <AppProjcetFlare language={language} />,
        },
        {
            iconName: "/weconnect.svg",
            appName: "Project WeConnect",
            title: texts.weconnect,
            component: <AppProjcetWeConnect language={language} />,
        },
        {
            iconName: "/pagessence.png",
            appName: "Project PageSsence",
            title: texts.pagessence,
            component: <AppProjcetPageSsence language={language} />,
        },
        {
            iconName: "/diceroller.png",
            appName: "Project DiceRoller",
            title: texts.diceroller,
            component: <AppProjcetDiceRoller language={language} />,
        },
        {
            iconName: "/mejubot.png",
            appName: "Project MejuBot",
            title: texts.mejubot,
            component: <AppProjcetMejubot language={language} />,
        },
        {
            iconName: "/webpiano.png",
            appName: "Project WebPiano",
            title: texts.webpiano,
            component: <AppProjcetWebPiano language={language} />,
        },
    ];
}
