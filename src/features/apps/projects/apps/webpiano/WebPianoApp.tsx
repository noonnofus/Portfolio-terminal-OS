import Image from "next/image";
import { Braces, ExternalLink, FileCode, GitBranch, Music, Palette } from "lucide-react";
import StackIcon from "@/shared/components/StackIcon";
import { useTranslation } from 'react-i18next';
import { Language } from "@/shared/lib/i18n/useLanguageStore";

interface AppProjectWebPianoProps {
    language: Language;
}

export default function AppProjcetWebPiano({}: AppProjectWebPianoProps) {
    const { t } = useTranslation(['WebPiano', 'common']);
    return (
        <div
            className="gui-app-surface h-full overflow-y-auto"
        >
            <div className="my-8 mx-4 md:mx-36">
                <div
                    className="flex flex-col items-center mt-8 mb-3"
                >
                    <h2 className="font-bold text-3xl text-pen-gray-800 mb-6">
                        {t('title')}
                    </h2>

                    <Image
                        src="/icons/webpiano.png"
                        alt="project WebPiano logo image"
                        width={250}
                        height={250}
                        className="mb-4 w-[250px] h-auto object-cover"
                    />
                    
                    <a
                        href="https://play-piano-project.onrender.com"
                        className="underline mb-4 flex items-center gap-1"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {t('linkAction')}<ExternalLink />
                    </a>
                    
                    <a
                        href="https://github.com/noonnofus/play_piano_project"
                        className="underline mb-4 flex items-center gap-1"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <GitBranch className="w-5 h-5" />
                        {t('common:sourceCode')} <ExternalLink />
                    </a>
                    <div className="max-w-[700px] flex flex-col ml-1 mr-1">
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
                                    <strong>{t('keyboardBasedPlay')}:</strong> {t('keyboardBasedPlayDesc')}
                                </li>
                                <li>
                                    <strong>{t('pitchTuningControl')}:</strong> {t('pitchTuningControlDesc')}
                                </li>
                                <li>
                                    <strong>{t('mp3SoundMapping')}:</strong> {t('mp3SoundMappingDesc')}
                                </li>
                                <li>
                                    <strong>{t('membraneSoundSupport')}:</strong> {t('membraneSoundSupportDesc')}
                                </li>
                            </ul>
                        </div>

                        <div
                            className="w-full border-t border-pen-gray-300 mx-auto"
                        />

                        <div className="mb-6 mt-6">
                            <h3 className="font-semibold text-xl text-pen-gray-800">
                                {t('common:techStack')}
                            </h3>

                            <div className="grid grid-cols-3 gap-5 mt-4 mb-6">
                                <StackIcon label="JavaScript" icon={Braces} color="#f7df1e" />
                                <StackIcon label="EJS" icon={FileCode} color="#A91E50" />
                                <StackIcon label="CSS3" icon={Palette} color="#264de4" />
                                <StackIcon label="Tone.js" icon={Music} color="#888" />
                            </div>

                        </div>



                        <div
                            className="w-full border-t border-pen-gray-300 mx-auto mb-6"
                        />
                        <div className="mt-6">
                            <h3 className="font-semibold text-xl text-pen-gray-800">
                                {t('common:appWalkthrough')}
                            </h3>
                            <p className="mt-2 mb-2">
                                {t('appWalkthroughDescription')}
                            </p>
                            <div className="aspect-video">
                                <video controls className="w-full h-full">
                                    <source src="videos/webpiano-walkthrough.mp4" type="video/mp4" />
                                    {t('common:videoNotSupported')}
                                </video>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}
