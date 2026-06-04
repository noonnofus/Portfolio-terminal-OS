'use client';

import Image from "next/image";
import {
    Bell,
    Brain,
    Bug,
    Cloud,
    Database,
    DatabaseZap,
    ExternalLink,
    FileCode2,
    GitBranch,
    Network,
    Orbit,
    Palette,
    Triangle,
} from "lucide-react";
import StackIcon from "@/shared/components/StackIcon";
import { useTranslation } from 'react-i18next';
import { Language } from "@/shared/lib/i18n/useLanguageStore";

interface AppProjectFlareProps {
    language: Language;
}

export default function AppProjectFlare({}: AppProjectFlareProps) {
    const { t } = useTranslation(['Flare', 'common']);
    return (
        <div className="w-full h-full overflow-y-auto bg-white rounded-b-pen-lg text-black">
            <div className="my-8 mx-4 md:mx-36">
                <div className="flex flex-col items-center mt-8 mb-3">
                    <h2 className="text-3xl font-bold text-pen-gray-800 mb-6">
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
                        {t('linkAction')} <ExternalLink />
                    </a>
                    <a
                        href="https://github.com/noonnofus/Flare_IDSP"
                        className="underline mb-4 inline-flex items-center gap-1"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <GitBranch size={20} />
                        {t('common:sourceCode')} <ExternalLink />
                    </a>
                    <div className="max-w-[700px] flex flex-col mx-1">
                        <div className="mb-6">
                            <h3 className="text-xl font-semibold text-pen-gray-800">
                                {t('common:overview')}
                            </h3>
                            <p className="mt-1 text-sm text-pen-gray-600">
                                📌 <b>{t('common:projectType')}:</b> {t('common:groupProject')}
                            </p>
                            <p className="mt-2 text-base">
                                {t('description')}
                            </p>
                        </div>

                        <div className="w-full border-t border-pen-gray-300 mx-auto" />

                        <div className="mb-6 mt-6">
                            <h3 className="text-xl font-semibold text-pen-gray-800">
                                {t('common:myRole')}
                            </h3>

                            <p className="mt-2 text-pen-gray-700">
                                {t('myRoleDescription')}
                            </p>

                            <ul className="mt-4 ps-4 flex flex-col gap-3 text-pen-gray-700 list-disc">
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

                        <div className="w-full border-t border-pen-gray-300 mx-auto" />

                        <div className="mb-6 mt-6">
                            <h3 className="mb-2 text-xl font-semibold text-pen-gray-800">
                                Tech Stack
                            </h3>

                            <h4 className="mt-6 mb-2 text-lg font-semibold text-black">Frontend</h4>
                            <div className="grid grid-cols-3 gap-5 mb-12">
                                <StackIcon label="Next.js" icon={Triangle} color="black" />
                                <StackIcon label="React" icon={Orbit} color="#61DAFB" />
                                <StackIcon label="TypeScript" icon={FileCode2} color="#3178C6" />
                                <StackIcon label="Tailwind CSS" icon={Palette} color="#38B2AC" />
                            </div>

                            <h4 className="mt-6 mb-2 text-lg font-semibold text-black">{t('backendDatabase')}</h4>
                            <div className="grid grid-cols-3 gap-5 mb-12">
                                <StackIcon label="PostgreSQL" icon={Database} color="#336791" />
                                <StackIcon label="Drizzle ORM" icon={DatabaseZap} color="#C5F74F" />
                            </div>

                            <h4 className="mt-6 mb-2 text-lg font-semibold text-black">{t('cloudAPIs')}</h4>
                            <div className="grid grid-cols-3 gap-5 mb-12">
                                <StackIcon label="AWS S3" icon={Cloud} color="#FF9900" />
                                <StackIcon label="OpenAI API" icon={Brain} color="#7fdbff" />
                                <StackIcon label="Bing News API" icon={Network} color="#008272" />
                                <StackIcon label="Firebase" icon={Cloud} color="#FFCA28" />
                            </div>

                            <h4 className="mt-6 mb-2 text-lg font-semibold text-black">{t('pwaRealtime')}</h4>
                            <div className="grid grid-cols-3 gap-5 mb-12">
                                <StackIcon label="Next.js PWA" icon={Triangle} color="black" />
                                <StackIcon label="Push Notifications" icon={Bell} color="#f59e0b" />
                                <StackIcon label="Web Crawler" icon={Bug} color="#9CA3AF" />
                            </div>
                        </div>

                        <div className="w-full border-t border-pen-gray-300 mx-auto mb-6" />

                        <div className="mt-6">
                            <h3 className="text-xl font-semibold text-pen-gray-800">
                                App Walkthrough
                            </h3>
                            <p className="mt-2 mb-4">
                                {t('appWalkthroughDescription')}
                            </p>
                            <div className="aspect-[2/1] w-full mb-4">
                                <video className="w-full h-full rounded-pen-lg" controls>
                                    <source src="videos/flare-walkthrough-web.mp4" type="video/mp4" />
                                    {t('common:videoNotSupported')}
                                </video>
                            </div>
                            <div className="aspect-[2/1] w-full">
                                <video className="w-full h-full rounded-pen-lg" controls>
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
