"use client";

import AppProjcetWCHMS from "@/app/components/desktop/apps/projects/AppWCHMS";
import AppProjcetPageSsence from "@/app/components/desktop/apps/projects/AppPageSsence";
import AppProjcetDiceRoller from "@/app/components/desktop/apps/projects/AppDiceRoller";
import AppProjcetFlare from "@/app/components/desktop/apps/projects/AppFlare";
import AppProjcetMejubot from "@/app/components/desktop/apps/projects/AppMejubot";
import AppProjcetWeConnect from "@/app/components/desktop/apps/projects/AppWeConnect";
import AppProjcetWebPiano from "@/app/components/desktop/apps/projects/AppWebPiano";
import { Language } from "@/app/store/features/languageSlice";

export default function ProjectsApps(language: Language = "ko") {
    const projectTexts = {
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
