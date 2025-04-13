'use client';

import AppAbout from "@/app/components/desktop/apps/AppAbout";
import AppContact from "@/app/components/desktop/apps/AppContact";
import AppAboutSite from "@/app/components/desktop/apps/AppAboutSite";
import AppTerminal from "@/app/components/desktop/apps/AppTerminal";
import AppFolder from "@/app/components/desktop/apps/folder/AppFolder";

export default function DesktopApps() {
    return [
        {
            iconName: "/folder.png",
            appName: "Projects Folder",
            title: "Projects",
            component: <AppFolder />,
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