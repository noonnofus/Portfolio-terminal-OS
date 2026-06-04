"use client";

import AppAbout from "@/features/Apps/About";
import AppContact from "@/features/Apps/Contact";
import AppAboutSite from "@/features/Apps/AboutSite";
import { AppTerminal } from "@/features/Apps/Terminal";
import AppFolder from "@/features/Apps/Folder";
import { Language } from "@/shared/lib/i18n/useLanguageStore";
import type { ReactNode } from "react";

export interface AppDefinition {
    iconSrc: string;
    appName: string;
    title: string;
    render: () => ReactNode;
}

type DesktopAppText = {
    projects: string;
    aboutSite: string;
    terminal: string;
    aboutMe: string;
    contacts: string;
};

export default function DesktopApps(language: Language): AppDefinition[] {
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
            iconSrc: "/icons/folder.png",
            appName: "Projects Folder",
            title: texts.projects,
            render: () => <AppFolder />,
        },
        {
            iconSrc: "/icons/site.png",
            appName: "App About Site",
            title: texts.aboutSite,
            render: () => <AppAboutSite language={language} />,
        },
        {
            iconSrc: "/icons/terminal.png",
            appName: "App Terminal",
            title: texts.terminal,
            render: () => <AppTerminal />,
        },
        {
            iconSrc: "/icons/main.png",
            appName: "App About Me",
            title: texts.aboutMe,
            render: () => <AppAbout language={language} />,
        },
        {
            iconSrc: "/icons/contact.png",
            appName: "App Contacts",
            title: texts.contacts,
            render: () => <AppContact language={language} />,
        },
    ];
}
