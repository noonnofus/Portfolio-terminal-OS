"use client";

import AppAbout from "@/features/Apps/About";
import AppContact from "@/features/Apps/Contact";
import AppAboutSite from "@/features/Apps/AboutSite";
import { AppTerminal } from "@/features/Apps/Terminal";
import AppFolder from "@/features/Apps/Folder";
import { Language } from "@/shared/lib/i18n/useLanguageStore";
import type { ReactNode } from "react";

export interface AppDefinition {
    iconName: string;
    appName: string;
    title: string;
    component: ReactNode;
}

type DesktopAppText = {
    projects: string;
    aboutSite: string;
    terminal: string;
    aboutMe: string;
    contacts: string;
};

export default function DesktopApps(language: Language = "ko"): AppDefinition[] {
    const appTexts: Record<Language, DesktopAppText> = {
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
