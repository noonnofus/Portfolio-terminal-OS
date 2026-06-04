'use client';

import {
    Box,
    Braces,
    Cable,
    ClipboardList,
    CodeXml,
    Component,
    Database,
    DatabaseZap,
    FileCode,
    FileCode2,
    FileText,
    Flame,
    GitBranch,
    Hash,
    Kanban,
    Package,
    Palette,
    PanelsTopLeft,
    PenTool,
    RadioTower,
    RefreshCw,
    Rocket,
    Route,
    Server,
    ServerCog,
    ShieldCheck,
    Triangle,
    Workflow,
    Zap,
    Orbit,
    Cloud,
} from "lucide-react";
import StackIcon from "@/shared/components/StackIcon";
import { useTranslation } from 'react-i18next';
import { Language } from "@/shared/lib/i18n/useLanguageStore";

interface AppAboutProps {
    language: Language;
}

export default function AppAbout({}: AppAboutProps) {
    const { t } = useTranslation(['About', 'common']);
    return (
        <div className="w-full h-[95%] overflow-y-auto bg-white rounded-b-pen-lg text-black">
            <div className="my-8 mx-4 md:mx-36">
                <div className="mb-8">
                    <h2 className="font-bold text-3xl text-pen-gray-800">
                        {t('title')}
                    </h2>
                    <p className="mt-2 text-md text-pen-gray-700">
                        {t('description')}
                    </p>
                    <p className="mt-1 text-md text-pen-gray-600">
                        {t('education')}
                    </p>
                </div>


                <div className="mb-8">
                    <h2 className="mb-4 font-bold text-2xl">
                        {t('techStackTitle')}
                    </h2>

                    <h3 className="mt-6 mb-2 text-lg font-semibold">{t('languages')}</h3>
                    <div className="grid grid-cols-3 gap-5 mb-12">
                        <StackIcon label="HTML5" icon={CodeXml} color="#E34F26" />
                        <StackIcon label="CSS3" icon={Palette} color="#1572B6" />
                        <StackIcon label="JavaScript" icon={Braces} color="#F7DF1E" />
                        <StackIcon label="TypeScript" icon={FileCode2} color="#3178C6" />
                        <StackIcon label="C#" icon={Hash} color="#8D74E4" />
                        <StackIcon label="PHP" icon={FileCode} color="#777BB4" />
                        <StackIcon label="Markdown" icon={FileText} color="#000000" />
                    </div>
                    <h3 className="mt-6 mb-2 text-lg font-semibold">{t('frontendFrameworks')}</h3>
                    <div className="grid grid-cols-3 gap-1 mb-12">
                        <StackIcon label="React" icon={Orbit} color="#61DAFB" />
                        <StackIcon label="Next.js" icon={Triangle} color="black" />
                        <StackIcon label="Vue.js" icon={Component} color="#42b883" />
                        <StackIcon label="Vite" icon={Zap} color="#646CFF" />
                        <StackIcon label="Redux" icon={Workflow} color="#764abc" />
                        <StackIcon label="EJS" icon={FileCode} color="black" />
                        <StackIcon label="TailwindCSS" icon={Palette} color="#38B2AC" />
                        <StackIcon label="shadcn/ui" icon={PanelsTopLeft} color="black" />
                        <StackIcon label="Chakra UI" icon={Palette} color="#4ED1C5" />
                    </div>

                    <h3 className="mt-6 mb-2 text-lg font-semibold">{t('backendFrameworks')}</h3>
                    <div className="grid grid-cols-3 gap-2 mb-12">
                        <StackIcon label="Express.js" icon={ServerCog} color="#404d59" />
                        <StackIcon label="Hono" icon={Flame} color="#FF9859" />
                        <StackIcon label="Laravel" icon={Box} color="#FF2D20" />
                        <StackIcon label=".NET" icon={Package} color="#5C2D91" />
                    </div>

                    <h3 className="mt-6 mb-2 text-lg font-semibold">{t('stateManagement')}</h3>
                    <div className="grid grid-cols-3 gap-2 mb-12">
                        <StackIcon label="React Router" icon={Route} color="#CA4245" />
                        <StackIcon label="React Query" icon={RefreshCw} color="#FF4154" />
                        <StackIcon label="Zod" icon={ShieldCheck} color="#3068b7" />
                    </div>

                    <h3 className="mt-6 mb-2 text-lg font-semibold">{t('webTechnologies')}</h3>
                    <div className="grid grid-cols-3 gap-2 mb-12">
                        <StackIcon label="WebRTC" icon={RadioTower} color="#333" />
                        <StackIcon label="Socket.IO" icon={Cable} color="black" />
                    </div>

                    <h3 className="mt-6 mb-2 text-lg font-semibold">{t('runtimeEnvironments')}</h3>
                    <div className="grid grid-cols-3 gap-2 mb-12">
                        <StackIcon label="Node.js" icon={Server} color="#339933" />
                        <StackIcon label="Bun" icon={Package} color="black" />
                    </div>

                    <h3 className="mt-6 mb-2 text-lg font-semibold">{t('databasesORMs')}</h3>
                    <div className="grid grid-cols-3 gap-2 mb-12">
                        <StackIcon label="MySQL" icon={Database} color="#00758F" />
                        <StackIcon label="PostgreSQL" icon={Database} color="#336791" />
                        <StackIcon label="MongoDB" icon={Database} color="#4ea94b" />
                        <StackIcon label="SQLite" icon={Database} color="#07405e" />
                        <StackIcon label="Turso" icon={Database} color="black" />
                        <StackIcon label="Drizzle" icon={DatabaseZap} color="#C5F74F" />
                        <StackIcon label="Prisma" icon={Database} color="#3982CE" />
                    </div>

                    <h3 className="mt-6 mb-2 text-lg font-semibold">{t('devopsDeployment')}</h3>
                    <div className="grid grid-cols-3 gap-2 mb-12">
                        <StackIcon label="NPM" icon={Package} color="#CB3837" />
                        <StackIcon label="Vercel" icon={Rocket} color="black" />
                        <StackIcon label="Heroku" icon={Rocket} color="#430098" />
                        <StackIcon label="Render" icon={Cloud} color="black" />
                        <StackIcon label="GitHub Pages" icon={GitBranch} color="black" />
                    </div>

                    <h3 className="mt-6 mb-2 text-lg font-semibold">{t('toolsCollaborations')}</h3>
                    <div className="grid grid-cols-3 gap-2 mb-12">
                        <StackIcon label="Git" icon={GitBranch} color="#F05033" />
                        <StackIcon label="Jira" icon={ClipboardList} color="#0A0FFF" />
                        <StackIcon label="Trello" icon={Kanban} color="#026AA7" />
                        <StackIcon label="Figma" icon={PenTool} color="#F24E1E" />
                    </div>

                </div>
            </div>
        </div>
    );
}
