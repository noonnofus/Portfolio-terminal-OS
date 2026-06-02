"use client";

import { FaReact, FaTerminal, FaGithub } from "react-icons/fa";
import {
    SiTypescript,
    SiFramer,
    SiNextdotjs,
    SiChakraui,
    SiVercel,
} from "react-icons/si";
import StackIcon from "@/shared/components/StackIcon";
import { GoLinkExternal as ExternalLinkIcon } from "react-icons/go";
import { useTranslation } from 'react-i18next';
import { Language } from "@/shared/lib/i18n/useLanguageStore";

interface AppAboutSiteProps {
    language: Language;
}

export default function AppAboutSite({}: AppAboutSiteProps) {
    const { t } = useTranslation(['AboutSite', 'common']);
    return (
        <div className="my-8 mx-4 md:mx-36 text-black">
            <div className="mb-8">
                <h2 className="font-bold text-3xl text-gray-800">
                    {t('title')}
                </h2>
                <p className="mt-3 text-md text-gray-700">
                    {t('description')}
                </p>
            </div>

            <div className="mb-8">
                <h2 className="mb-4 font-bold text-2xl">
                    {t('sourceCodeTitle')}
                </h2>
                <a
                    href="https://github.com/noonnofus/Portfolio-terminal-OS"
                    className="underline mb-4 inline-flex items-center gap-1"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <FaGithub size={20} />
                    {t('sourceCodeTitle')} <ExternalLinkIcon />
                </a>
            </div>
            <div className="mb-8">
                <h2 className="mb-4 font-bold text-2xl">
                    {t('techStackTitle')}
                </h2>

                <h3 className="mt-6 mb-2 text-lg font-semibold">
                    {t('coreStack')}
                </h3>
                <div className="grid grid-cols-3 gap-5 mb-12">
                    <StackIcon
                        label="TypeScript"
                        icon={SiTypescript}
                        color="#3178C6"
                    />
                    <StackIcon label="ReactJS" icon={FaReact} color="#61DAFB" />
                    <StackIcon
                        label="Next.js"
                        icon={SiNextdotjs}
                        color="black"
                    />
                </div>

                <h3 className="mt-6 mb-2 text-lg font-semibold">
                    {t('uiAnimation')}
                </h3>
                <div className="grid grid-cols-3 gap-5 mb-12">
                    <StackIcon
                        label="Chakra UI"
                        icon={SiChakraui}
                        color="#4ED1C5"
                    />
                    <StackIcon
                        label="Framer Motion"
                        icon={SiFramer}
                        color="black"
                    />
                </div>

                <h3 className="mt-6 mb-2 text-lg font-semibold">
                    {t('terminalInterface')}
                </h3>
                <div className="grid grid-cols-3 gap-5 mb-12">
                    <StackIcon
                        label="xterm.js"
                        icon={FaTerminal}
                        color="#0F4C81"
                    />
                </div>

                <h3 className="mt-6 mb-2 text-lg font-semibold">
                    {t('deployment')}
                </h3>
                <div className="grid grid-cols-3 gap-5 mb-12">
                    <StackIcon label="Vercel" icon={SiVercel} color="black" />
                </div>
            </div>
            <div className="mb-8">
                <h2 className="mb-4 font-bold text-2xl">
                    {t('iconsBackgroundCredits')}
                </h2>
                <p className="mt-2 text-md text-gray-700">
                    <b>{t('iconsCredit')}</b> <br />
                    {t('iconsProvidedBy')}{" "}
                    <a
                        href="https://www.flaticon.com/"
                        className="underline text-teal-600 font-medium inline-flex items-center gap-1"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Flaticon <ExternalLinkIcon />
                    </a>{" "}
                    {t('iconsCreatedBy')}{" "}
                    <a
                        href="https://www.flaticon.com/authors/mattbadal"
                        className="underline text-teal-600 inline-flex items-center gap-1"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        mattbadal <ExternalLinkIcon />
                    </a>
                    ,{" "}
                    <a
                        href="https://www.flaticon.com/authors/freepik"
                        className="underline text-teal-600 inline-flex items-center gap-1"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Freepik <ExternalLinkIcon />
                    </a>
                    ,{" "}
                    <a
                        href="https://www.flaticon.com/authors/ilham-fitrotul-hayat"
                        className="underline text-teal-600 inline-flex items-center gap-1"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Ilham Fitrotul Hayat <ExternalLinkIcon />
                    </a>
                    , and{" "}
                    <a
                        href="https://www.flaticon.com/authors/riajulislam"
                        className="underline text-teal-600 inline-flex items-center gap-1"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        riajulislam <ExternalLinkIcon />
                    </a>
                    .
                </p>

                <p className="mt-4 text-md text-gray-700">
                    <b>{t('backgroundCredit')}</b> <br />
                    {t('backgroundFrom')}{" "}
                    <a
                        href="https://4kwallpapers.com/abstract/macos-sonoma-11573.html"
                        className="underline text-teal-600 inline-flex items-center gap-1"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        4kwallpapers <ExternalLinkIcon />
                    </a>
                    .
                </p>
            </div>
        </div>
    );
}