'use client';

import Image from "next/image";
import { SiJavascript, SiDiscord, SiMongodb, SiPubg, } from "react-icons/si"
import { FaPlayCircle, FaMicrophoneAlt, FaGithub } from "react-icons/fa"
import StackIcon from "@/shared/components/StackIcon";
import { GoLinkExternal as ExternalLinkIcon } from "react-icons/go";
import { useTranslation } from 'react-i18next';
import { Language } from "@/shared/lib/i18n/useLanguageStore";

interface AppProjectMejubotProps {
    language: Language;
}

export default function AppProjcetMejubot({}: AppProjectMejubotProps) {
    const { t } = useTranslation(['Mejubot', 'common']);
    return (
        <div
            style={{
                overflow: "scroll",
                backgroundColor: "white",
                borderRadius: "0 0 8px 8px",
                color: 'black',
            }}
        >
            <div className="my-8 mx-4 md:mx-36">
                <div className="flex flex-col items-center mt-8 mb-3">
                    <h2 className="font-bold text-3xl text-gray-800 mb-6 text-center">
                        {t('title')}
                    </h2>

                    <Image
                        src="/icons/mejubot.png"
                        alt="project WCHMS logo image"
                        width={150}
                        height={150}
                        className="w-[150px] h-auto object-cover mb-4"
                    />
                    <a
                        href="https://discord.com/oauth2/authorize?client_id=1263899843055583254&permissions=8&integration_type=0&scope=bot"
                        className="underline mb-4 flex items-center gap-1"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {t('linkAction')}<ExternalLinkIcon />
                    </a>
                    <div className="max-w-[700px] flex flex-col mx-1">
                        <div className="mb-6">
                            <h3 className="font-semibold text-xl text-gray-800">
                                {t('common:overview')}
                            </h3>
                            <p className="mt-1 text-sm text-gray-600">
                                📌 <b>{t('common:projectType')}:</b> {t('common:soloProject')}
                            </p>
                            <p className="mt-2">
                                {t('description')}
                            </p>
                        </div>

                        <div className="w-full border-t border-[#ccc] mx-auto" />

                        <div className="mb-6 mt-6">
                            <h3 className="font-semibold text-xl text-gray-800">
                                {t('common:keyFeatures')}
                            </h3>

                            <ul className="mt-4 ps-4 space-y-3 text-gray-700 list-disc">
                                <li>
                                    <strong>{t('youtubeMusicPlayback')}:</strong> {t('youtubeMusicPlaybackDesc')}
                                </li>
                                <li>
                                    <strong>{t('pubgStatsIntegration')}:</strong> {t('pubgStatsIntegrationDesc')}
                                </li>
                                <li>
                                    <strong>{t('virtualStockMarketGame')}:</strong> {t('virtualStockMarketGameDesc')}
                                </li>
                                <li>
                                    <strong>{t('multiLanguageSupport')}:</strong> {t('multiLanguageSupportDesc')}
                                </li>
                            </ul>
                        </div>

                        <div className="w-full border-t border-[#ccc] mx-auto" />

                        <div className="mb-6 mt-6">
                            <h3 className="mb-2 font-semibold text-xl text-gray-800">
                                Tech Stack
                            </h3>

                            <h4 className="mt-6 mb-2 text-lg font-semibold">{t('botFramework')}</h4>
                            <div className="grid grid-cols-3 gap-5 mb-12">
                                <StackIcon label="Discord.js" icon={SiDiscord} color="#5865F2" />
                                <StackIcon label="discord-player" icon={FaPlayCircle} color="#FF5722" />
                                <StackIcon label="discordjs/opus" icon={FaMicrophoneAlt} color="#2D3748" />
                            </div>

                            <h4 className="mt-6 mb-2 text-lg font-semibold">{t('apisFeatures')}</h4>
                            <div className="grid grid-cols-3 gap-5 mb-12">
                                <StackIcon label="PUBG API" icon={SiPubg} color="black" />
                            </div>

                            <h4 className="mt-6 mb-2 text-lg font-semibold">Frontend</h4>
                            <div className="grid grid-cols-3 gap-5 mb-12">
                                <StackIcon label="JavaScript" icon={SiJavascript} color="#f7df1e" />
                            </div>

                            <h4 className="mt-6 mb-2 text-lg font-semibold">{t('databaseAuth')}</h4>
                            <div className="grid grid-cols-3 gap-5 mb-12">
                                <StackIcon label="MongoDB" icon={SiMongodb} color="#47A248" />
                            </div>

                            <h4 className="mt-6 mb-2 text-lg font-semibold">{t('deploymentTools')}</h4>
                            <div className="grid grid-cols-3 gap-5 mb-6">
                                <StackIcon label="GitHub" icon={FaGithub} color="black" />
                            </div>
                        </div>

                        <div className="w-full border-t border-[#ccc] mx-auto mb-6" />
                    </div>
                </div>
            </div>
        </div>
    );
}
