'use client';

import AppProjcetFlare from "@/app/components/desktop/apps/projects/AppFlare";
import AppProjcetWeConnect from "@/app/components/desktop/apps/projects/AppWeConnect";

export default function ProjectsApps() {
    return [
        {
            iconName: "/wchms.png",
            appName: "Client Project WCHMS",
            title: "WCHMS",
            component: <AppProjcetWeConnect />,
        },
        {
            iconName: "/pagessence.png",
            appName: "Project PageSsence",
            title: "PageSsence",
            component: <AppProjcetWeConnect />,
        },
        {
            iconName: "/diceroller.png",
            appName: "Project DiceRoller",
            title: "DiceRoller",
            component: <AppProjcetWeConnect />,
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
            component: <AppProjcetWeConnect />,
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
            component: <AppProjcetWeConnect />,
        },
    ];
}