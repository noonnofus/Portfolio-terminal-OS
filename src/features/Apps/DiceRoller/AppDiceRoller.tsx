'use client';

import Image from "next/image";
import {
    Box,
    Cuboid,
    ExternalLink,
    FileCode2,
    GitBranch,
    Globe,
    Keyboard,
    Orbit,
    Smartphone,
} from "lucide-react";
import StackIcon from "@/shared/components/StackIcon";
import { useTranslation } from 'react-i18next';
import { Language } from "@/shared/lib/i18n/useLanguageStore";

interface AppProjectDiceRollerProps {
    language: Language;
}

export default function AppProjcetDiceRoller({}: AppProjectDiceRollerProps) {
    const { t } = useTranslation(['DiceRoller', 'common']);
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
                    <h2 className="font-bold text-3xl text-pen-gray-800 mb-6 text-center">
                        {t('title')}
                    </h2>

                    <Image
                        src="/icons/diceroller.png"
                        alt="project WCHMS logo image"
                        width={150}
                        height={150}
                        className="w-[150px] h-auto object-cover mb-4"
                    />
                    <a
                        href="https://diceroller-jet.vercel.app/"
                        className="underline mb-4 flex items-center gap-1"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {t('linkAction')}<ExternalLink />
                    </a>
                    <a
                        href="https://github.com/noonnofus/diceRoller"
                        className="underline mb-4 flex items-center gap-1"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <GitBranch className="w-5 h-5" />
                        {t('common:sourceCode')} <ExternalLink />
                    </a>
                    <div className="max-w-[700px] flex flex-col mx-1">
                        <div className="mb-6">
                            <h3 className="font-semibold text-xl text-pen-gray-800">
                                {t('common:overview')}
                            </h3>
                            <p className="mt-1 text-sm text-pen-gray-600">
                                📌 <b>{t('common:projectType')}:</b> {t('common:soloProject')}
                            </p>
                            <p className="mt-2">
                                {t('description')}
                            </p>
                            <p className="mt-1">
                                {t('descriptionContinued')}
                            </p>
                        </div>

                        <div className="w-full border-t border-pen-gray-300 mx-auto" />

                        <div className="mb-6 mt-6">
                            <h3 className="font-semibold text-xl text-pen-gray-800">
                                {t('common:keyFeatures')}
                            </h3>

                            <ul className="mt-4 ps-4 space-y-3 text-pen-gray-700 list-disc">
                                <li>
                                    <strong>{t('threeDDiceSimulation')}:</strong> {t('threeDDiceSimulationDesc')}
                                </li>
                                <li>
                                    <strong>{t('crossPlatformSupport')}:</strong> {t('crossPlatformSupportDesc')}
                                </li>
                                <li>
                                    <strong>{t('shakeDetectionMobile')}:</strong> {t('shakeDetectionMobileDesc')}
                                </li>
                                <li>
                                    <strong>{t('keyboardInteractionWeb')}:</strong> {t('keyboardInteractionWebDesc')}
                                </li>
                                <li>
                                    <strong>{t('cameraPositionLighting')}:</strong> {t('cameraPositionLightingDesc')}
                                </li>
                            </ul>
                        </div>

                        <div className="w-full border-t border-pen-gray-300 mx-auto" />

                        <div className="mb-6 mt-6">
                            <h3 className="mb-2 font-semibold text-xl text-pen-gray-800">
                                Tech Stack
                            </h3>

                            <h4 className="mt-6 mb-2 text-lg font-semibold">Frontend</h4>
                            <div className="grid grid-cols-3 gap-5 mb-12">
                                <StackIcon label="React Native" icon={Orbit} color="#61DAFB" />
                                <StackIcon label="Expo" icon={Smartphone} color="black" />
                                <StackIcon label="TypeScript" icon={FileCode2} color="#3178C6" />
                            </div>

                            <h4 className="mt-6 mb-2 text-lg font-semibold">{t('threeDInteraction')}</h4>
                            <div className="grid grid-cols-3 gap-5 mb-12">
                                <StackIcon label="expo-three" icon={Cuboid} color="black" />
                                <StackIcon label="cannon-es" icon={Box} color="#555" />
                                <StackIcon label="react-native-shake" icon={Smartphone} color="#1E88E5" />
                            </div>

                            <h4 className="mt-6 mb-2 text-lg font-semibold">{t('platform')}</h4>
                            <div className="grid grid-cols-3 gap-5 mb-6">
                                <StackIcon label={t('mobileShake')} icon={Smartphone} color="#6C63FF" />
                                <StackIcon label={t('webKeyboard')} icon={Keyboard} color="#4A5568" />
                                <StackIcon label={t('crossPlatform')} icon={Globe} color="#2D3748" />
                            </div>
                        </div>

                        <div className="w-full border-t border-pen-gray-300 mx-auto mb-6" />

                        <div className="mt-6">
                            <h3 className="font-semibold text-xl text-pen-gray-800">
                                App Walkthrough
                            </h3>
                            <p className="mt-2 mb-4">
                                {t('appWalkthroughDescription')}
                            </p>
                            <div className="relative aspect-[9/16] max-w-[400px] mx-auto">
                                <video controls className="w-full h-full rounded-pen-lg">
                                    <source src="videos/diceroller-walkthrough-app.mp4" type="video/mp4" />
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
