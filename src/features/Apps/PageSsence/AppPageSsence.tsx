import Image from "next/image";
import { SiVuedotjs, SiInertia, SiTailwindcss, SiPrime, SiVite, SiGit, SiJavascript, SiMysql, SiLaravel, SiAxios, SiPhp } from "react-icons/si"
import { FaGithub, FaWindowRestore, } from "react-icons/fa"
import StackIcon from "@/shared/components/StackIcon";
import { GoLinkExternal as ExternalLinkIcon } from "react-icons/go";
import { useTranslation } from 'react-i18next';
import { Language } from "@/shared/lib/i18n/useLanguageStore";

interface AppProjectPageSsenceProps {
    language: Language;
}

export default function AppProjcetPageSsence({}: AppProjectPageSsenceProps) {
    const { t } = useTranslation(['PageSsence', 'common']);
    return (
        <div
            className="overflow-scroll bg-white rounded-b-pen-lg text-black"
        >
            <div className="my-8 mx-4 md:mx-36">
                <div
                    className="flex flex-col items-center mt-8 mb-3"
                >
                    <h2 className="font-bold text-3xl text-pen-gray-800 mb-6">
                        {t('title')}
                    </h2>

                    <Image
                        src="/icons/pagessence.png"
                        alt="project WCHMS logo image"
                        width={150}
                        height={150}
                        className="mb-4 w-[150px] h-auto object-cover"
                    />
                    <a
                        href="/" // need to put it here
                        className="underline mb-4 flex items-center gap-1"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {t('linkAction')} <ExternalLinkIcon />
                    </a>
                    <a
                        href="https://github.com/noonnofus/PageSsence"
                        className="underline mb-4 flex items-center gap-1"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <FaGithub className="w-5 h-5" />
                        {t('common:sourceCode')} <ExternalLinkIcon />
                    </a>
                    <div className="max-w-[700px] flex flex-col ml-1 mr-1">
                        <div className="mb-6">
                            <h3 className="font-semibold text-xl text-pen-gray-800">
                                {t('common:overview')}
                            </h3>
                            <p className="mt-1 text-sm text-pen-gray-600">
                                📌 <b>{t('common:projectType')}:</b> {t('common:soloProject')}
                            </p>
                            <div className="mt-2">
                                {t('description')}
                                <p className="mt-1">
                                    {t('descriptionContinued')}
                                </p>
                            </div>
                        </div>

                        <div
                            className="w-full border-t border-pen-gray-300 mx-auto"
                        />

                        <div className="mb-6 mt-6">
                            <h3 className="font-semibold text-xl text-pen-gray-800">
                                {t('common:keyFeatures')}
                            </h3>

                            <ul className="mt-4 ps-4 flex flex-col gap-3 text-pen-gray-700 list-disc">
                                <li>
                                    <strong>{t('bookBrowsingSearch')}:</strong> {t('bookBrowsingSearchDesc')}
                                </li>
                                <li>
                                    <strong>{t('interactiveReviewsRatings')}:</strong> {t('interactiveReviewsRatingsDesc')}
                                </li>
                                <li>
                                    <strong>{t('roleBasedAccessControl')}:</strong> {t('roleBasedAccessControlDesc')}
                                </li>
                                <li>
                                    <strong>{t('modernStackUI')}:</strong> {t('modernStackUIDesc')}
                                </li>
                            </ul>
                        </div>

                        <div
                            className="w-full border-t border-pen-gray-300 mx-auto"
                        />

                        <div className="mb-6 mt-6">
                            <h3 className="mb-2 font-semibold text-xl text-pen-gray-800">
                                Tech Stack
                            </h3>

                            <h4 className="mt-6 mb-2 text-lg font-semibold">Frontend</h4>
                            <div className="grid grid-cols-3 gap-5 mb-12">
                                <StackIcon label="Vue.js" icon={SiVuedotjs} color="#42b883" />
                                <StackIcon label="Inertia.js" icon={SiInertia} color="#000000" />
                                <StackIcon label="PrimeVue" icon={SiPrime} color="#4CAF50" />
                                <StackIcon label="Vite" icon={SiVite} color="#646CFF" />
                                <StackIcon label="JavaScript" icon={SiJavascript} color="#f7df1e" />
                                <StackIcon label="TailwindCSS" icon={SiTailwindcss} color="#38B2AC" />
                            </div>

                            <h4 className="mt-6 mb-2 text-lg font-semibold">Backend</h4>
                            <div className="grid grid-cols-3 gap-5 mb-12">
                                <StackIcon label="Laravel" icon={SiLaravel} color="#FF2D20" />
                                <StackIcon label="PHP" icon={SiPhp} color="#777BB4" />
                                <StackIcon label="MySQL" icon={SiMysql} color="#00758F" />
                            </div>

                            <h4 className="mt-6 mb-2 text-lg font-semibold">Authentication</h4>
                            <div className="grid grid-cols-3 gap-5 mb-12">
                                <StackIcon label="Laravel Breeze" icon={SiLaravel} color="#FF2D20" />
                            </div>

                            <h4 className="mt-6 mb-2 text-lg font-semibold">Libraries & Services</h4>
                            <div className="grid grid-cols-3 gap-5 mb-12">
                                <StackIcon label="Axios" icon={SiAxios} color="#5A29E4" />
                                <StackIcon label="Ziggy" icon={SiLaravel} color="#FF2D20" />
                                <StackIcon label="Inertia Modal" icon={FaWindowRestore} color="#4A5568" />
                            </div>

                            <h4 className="mt-6 mb-2 text-lg font-semibold">Other Tools</h4>
                            <div className="grid grid-cols-3 gap-5 mb-6">
                                <StackIcon label="GitHub" icon={FaGithub} color="black" />
                                <StackIcon label="Git" icon={SiGit} color="#F05033" />
                            </div>
                        </div>

                        <div
                            className="w-full border-t border-pen-gray-300 mx-auto mb-6"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
