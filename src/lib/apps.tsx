'use client';

import AppAbout from "@/app/components/desktop/apps/AppAbout";
import AppContact from "@/app/components/desktop/apps/AppContact";
import AppProjects from "@/app/components/desktop/apps/AppProjects";
import AppAboutSite from "@/app/components/desktop/apps/AppAboutSite";
import AppTerminal from "@/app/components/desktop/apps/AppTerminal";

export default function DesktopApps() {
    return [
        {
            iconName: "/projects.png",
            appName: "App Projects",
            title: "Projects",
            component: <AppProjects />,
        },
        {
            iconName: "/site.png",
            appName: "App About Site",
            title: "About Site",
            component: <AppAboutSite />,
        },
        {
            iconName: "/terminal.png",
            appName: "App Terminal",
            title: "Terminal",
            component: <AppTerminal />,
        },
        {
            iconName: "/main.png",
            appName: "App About Me",
            title: "About Kevin",
            component: <AppAbout />,
        },
        {
            iconName: "/contact.png",
            appName: "App Contacts",
            title: "Contacts",
            component: <AppContact />,
        },
    ];
}