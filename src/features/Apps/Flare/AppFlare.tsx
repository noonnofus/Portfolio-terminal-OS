'use client';

import Image from "next/image";
import { SiTypescript, SiNextdotjs, SiTailwindcss, SiDrizzle, SiPostgresql, SiFirebase } from "react-icons/si"
import { FaSpider, FaBrain, FaProjectDiagram, FaBell, FaAws, FaReact, FaGithub } from "react-icons/fa"
import { GoLinkExternal as ExternalLinkIcon } from "react-icons/go";
import StackIcon from "@/shared/components/StackIcon";
import { useTranslation } from 'react-i18next';
import { Language } from "@/shared/lib/i18n/useLanguageStore";

interface AppProjectFlareProps {
    language: Language;
}

export default function AppProjectFlare({}: AppProjectFlareProps) {
    const { t } = useTranslation(['Flare', 'common']);
    return (
        <div className="w-full h-full overflow-y-auto bg-white rounded-b-lg text-black">
            <div className="my-8 mx-4 md:mx-36">
                <div className="flex flex-col items-center mt-8 mb-3">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">
                        {t('title')}
                    </h2>

                    <Image
                        src="/icons/flare.png"
                        alt="project flare logo image"
                        width={150}
                        height={150}
                        className="w-[150px] h-auto object-cover mb-4"
                    />
                    <a
                        href="https://www.flare-bc.com/"
                        className="underline mb-4 inline-flex items-center gap-1"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {t('linkAction')} <ExternalLinkIcon />
                    </a>
                    <a
                        href="https://github.com/noonnofus/Flare_IDSP"
                        className="underline mb-4 inline-flex items-center gap-1"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <FaGithub size={20} />
                        {t('common:sourceCode')} <ExternalLinkIcon />
                    </a>
                    <div className="max-w-[700px] flex flex-col mx-1">
                        <div className="mb-6">
                            <h3 className="text-xl font-semibold text-gray-800">
                                {t('common:overview')}
                            </h3>
                            <p className="mt-1 text-sm text-gray-600">
                                📌 <b>{t('common:projectType')}:</b> {t('common:groupProject')}
                            </p>
                            <p className="mt-2 text-base">
                                {t('description')}
                            </p>
                        </div>

                        <div className="w-full border-t border-gray-300 mx-auto" />

                        <div className="mb-6 mt-6">
                            <h3 className="text-xl font-semibold text-gray-800">
                                {t('common:myRole')}
                            </h3>

                            <p className="mt-2 text-gray-700">
                                {t('myRoleDescription')}
                            </p>

                            <ul className="mt-4 ps-4 flex flex-col gap-3 text-gray-700 list-disc">
                                <li>
                                    <strong>{t('pwaIntegration')}:</strong> {t('pwaIntegrationDesc')}
                                </li>
                                <li>
                                    <strong>{t('chatbotDevelopment')}:</strong> {t('chatbotDevelopmentDesc')}
                                </li>
                                <li>
                                    <strong>{t('realtimeNotifications')}:</strong> {t('realtimeNotificationsDesc')}
                                </li>
                            </ul>
                        </div>

                        <div className="w-full border-t border-gray-300 mx-auto" />

                        <div className="mb-6 mt-6">
                            <h3 className="mb-2 text-xl font-semibold text-gray-800">
                                Tech Stack
                            </h3>

                            <h4 className="mt-6 mb-2 text-lg font-semibold text-black">Frontend</h4>
                            <div className="grid grid-cols-3 gap-5 mb-12">
                                <StackIcon label="Next.js" icon={SiNextdotjs} color="black" />
                                <StackIcon label="React" icon={FaReact} color="#61DAFB" />
                                <StackIcon label="TypeScript" icon={SiTypescript} color="#3178C6" />
                                <StackIcon label="Tailwind CSS" icon={SiTailwindcss} color="#38B2AC" />
                            </div>

                            <h4 className="mt-6 mb-2 text-lg font-semibold text-black">{t('backendDatabase')}</h4>
                            <div className="grid grid-cols-3 gap-5 mb-12">
                                <StackIcon label="PostgreSQL" icon={SiPostgresql} color="#336791" />
                                <StackIcon label="Drizzle ORM" icon={SiDrizzle} color="#C5F74F" />
                            </div>

                            <h4 className="mt-6 mb-2 text-lg font-semibold text-black">{t('cloudAPIs')}</h4>
                            <div className="grid grid-cols-3 gap-5 mb-12">
                                <StackIcon label="AWS S3" icon={FaAws} color="#FF9900" />
                                <StackIcon label="OpenAI API" icon={FaBrain} color="#7fdbff" />
                                <StackIcon label="Bing News API" icon={FaProjectDiagram} color="#008272" />
                                <StackIcon label="Firebase" icon={SiFirebase} color="#FFCA28" />
                            </div>

                            <h4 className="mt-6 mb-2 text-lg font-semibold text-black">{t('pwaRealtime')}</h4>
                            <div className="grid grid-cols-3 gap-5 mb-12">
                                <StackIcon label="Next.js PWA" icon={SiNextdotjs} color="black" />
                                <StackIcon label="Push Notifications" icon={FaBell} color="#f59e0b" />
                                <StackIcon label="Web Crawler" icon={FaSpider} color="#9CA3AF" />
                            </div>
                        </div>

                        <div className="w-full border-t border-gray-300 mx-auto mb-6" />

                        <div className="mt-6">
                            <h3 className="text-xl font-semibold text-gray-800">
                                App Walkthrough
                            </h3>
                            <p className="mt-2 mb-4">
                                {t('appWalkthroughDescription')}
                            </p>
                            <div className="aspect-[2/1] w-full mb-4">
                                <video className="w-full h-full rounded-lg" controls>
                                    <source src="videos/flare-walkthrough-web.mp4" type="video/mp4" />
                                    {t('common:videoNotSupported')}
                                </video>
                            </div>
                            <div className="aspect-[2/1] w-full">
                                <video className="w-full h-full rounded-lg" controls>
                                    <source src="videos/flare-walkthrough-app.mp4" type="video/mp4" />
                                    {t('common:videoNotSupported')}
                                </video>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
