"use client";

import { Language } from "@/shared/lib/i18n/useLanguageStore";
import {
    DiceRollerApp,
    FlareApp,
    MejubotApp,
    PageSsenceApp,
    WCHMSApp,
    WebPianoApp,
    WeConnectApp,
} from "@/features/applications/components/loaders/appLoaders";
import type { AppDefinition } from "@/features/applications/types/appDefinition";

type ProjectAppText = {
    wchms: string;
    pagessence: string;
    diceroller: string;
    flare: string;
    mejubot: string;
    weconnect: string;
    webpiano: string;
};

export default function getProjectApplicationDefinitions(language: Language): AppDefinition[] {
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
            iconSrc: "/icons/wchms.png",
            appName: "Client Project WCHMS",
            title: texts.wchms,
            render: () => <WCHMSApp language={language} />,
        },
        {
            iconSrc: "/icons/flare.png",
            appName: "Project Flare",
            title: texts.flare,
            render: () => <FlareApp language={language} />,
        },
        {
            iconSrc: "/icons/weconnect.svg",
            appName: "Project WeConnect",
            title: texts.weconnect,
            render: () => <WeConnectApp language={language} />,
        },
        {
            iconSrc: "/icons/pagessence.png",
            appName: "Project PageSsence",
            title: texts.pagessence,
            render: () => <PageSsenceApp language={language} />,
        },
        {
            iconSrc: "/icons/diceroller.png",
            appName: "Project DiceRoller",
            title: texts.diceroller,
            render: () => <DiceRollerApp language={language} />,
        },
        {
            iconSrc: "/icons/mejubot.png",
            appName: "Project MejuBot",
            title: texts.mejubot,
            render: () => <MejubotApp language={language} />,
        },
        {
            iconSrc: "/icons/webpiano.png",
            appName: "Project WebPiano",
            title: texts.webpiano,
            render: () => <WebPianoApp language={language} />,
        },
    ];
}
