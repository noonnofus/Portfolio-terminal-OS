"use client";

import { Language } from "@/shared/lib/i18n/useLanguageStore";
import type { AppDefinition } from "@/features/applications/types/appDefinition";
import {
    AboutApp,
    AboutSiteApp,
    ContactApp,
    FolderApp,
    TerminalApp,
} from "@/features/applications/components/loaders/appLoaders";

type DesktopAppText = {
    projects: string;
    aboutSite: string;
    terminal: string;
    aboutMe: string;
    contacts: string;
};

export default function getRootApplicationDefinitions(language: Language): AppDefinition[] {
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
            render: () => <FolderApp />,
        },
        {
            iconSrc: "/icons/about.png",
            appName: "App About Site",
            title: texts.aboutSite,
            render: () => <AboutSiteApp language={language} />,
        },
        {
            iconSrc: "/icons/iterm2.png",
            appName: "App Terminal",
            title: texts.terminal,
            render: () => <TerminalApp />,
        },
        {
            iconSrc: "/icons/about.png",
            appName: "App About Me",
            title: texts.aboutMe,
            render: () => <AboutApp language={language} />,
        },
        {
            iconSrc: "/icons/contact.png",
            appName: "App Contacts",
            title: texts.contacts,
            render: () => <ContactApp language={language} />,
        },
    ];
}
