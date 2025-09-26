"use client";

import AppAbout from "@/app/components/desktop/apps/AppAbout";
import AppContact from "@/app/components/desktop/apps/AppContact";
import AppAboutSite from "@/app/components/desktop/apps/AppAboutSite";
import AppTerminal from "@/app/components/desktop/apps/AppTerminal";
import AppFolder from "@/app/components/desktop/apps/AppFolder";
import { Language } from "@/app/store/features/languageSlice";

export default function DesktopApps(language: Language = "ko") {
    const appTexts = {
        ko: {
            projects: "프로젝트_폴더",
            aboutSite: "사이트_소개",
            terminal: "터미널",
            aboutMe: "나에_대해서",
            contacts: "연락처",
        },
        en: {
            projects: "Projects_Folder",
            aboutSite: "About_Site",
            terminal: "Terminal",
            aboutMe: "About_Kevin",
            contacts: "Contacts",
        },
    };

    const texts = appTexts[language];

    return [
        {
            iconName: "/folder.png",
            appName: "Projects Folder",
            title: texts.projects,
            component: <AppFolder />,
        },
        {
            iconName: "/site.png",
            appName: "App About Site",
            title: texts.aboutSite,
            component: <AppAboutSite language={language} />,
        },
        {
            iconName: "/terminal.png",
            appName: "App Terminal",
            title: texts.terminal,
            component: <AppTerminal />,
        },
        {
            iconName: "/main.png",
            appName: "App About Me",
            title: texts.aboutMe,
            component: <AppAbout language={language} />,
        },
        {
            iconName: "/contact.png",
            appName: "App Contacts",
            title: texts.contacts,
            component: <AppContact language={language} />,
        },
    ];
}
