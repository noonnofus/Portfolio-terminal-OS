'use client';

import AppProjcetWCHMS from "@/app/components/desktop/apps/projects/AppWCHMS";
import AppProjcetPageSsence from "@/app/components/desktop/apps/projects/AppPageSsence";
import AppProjcetDiceRoller from "@/app/components/desktop/apps/projects/AppDiceRoller";
import AppProjcetFlare from "@/app/components/desktop/apps/projects/AppFlare";
import AppProjcetMejubot from "@/app/components/desktop/apps/projects/AppMejubot";
import AppProjcetWeConnect from "@/app/components/desktop/apps/projects/AppWeConnect";
import AppProjcetWebPiano from "@/app/components/desktop/apps/projects/AppWebPiano";

export default function ProjectsApps() {
    return [
        {
            iconName: "/wchms.png",
            appName: "Client Project WCHMS",
            title: "WCHMS",
            component: <AppProjcetWCHMS />,
        },
        {
            iconName: "/pagessence.png",
            appName: "Project PageSsence",
            title: "PageSsence",
            component: <AppProjcetPageSsence />,
        },
        {
            iconName: "/diceroller.png",
            appName: "Project DiceRoller",
            title: "DiceRoller",
            component: <AppProjcetDiceRoller />,
        },
        {
            iconName: "/flare.png",
            appName: "Project Flare",
            title: "Flare",
            component: <AppProjcetFlare />,
        },
        {
            iconName: "/mejubot.png",
            appName: "Project MejuBot",
            title: "Discord Bot",
            component: <AppProjcetMejubot />,
        },
        {
            iconName: "/weconnect.svg",
            appName: "Project WeConnect",
            title: "WeConnect",
            component: <AppProjcetWeConnect />,
        },
        {
            iconName: "/webpiano.png",
            appName: "Project WebPiano",
            title: "WebPiano",
            component: <AppProjcetWebPiano />,
        },
    ];
}