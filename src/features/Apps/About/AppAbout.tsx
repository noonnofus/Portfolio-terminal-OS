'use client';

import { TbBrandCSharp } from "react-icons/tb";
import { FaReact, FaNodeJs, FaHtml5, FaCss3Alt, FaJs, FaGithub } from "react-icons/fa"
import {
    SiTypescript, SiPhp, SiMarkdown, SiNextdotjs,
    SiVuedotjs, SiVite, SiRedux, SiEjs, SiTailwindcss, SiShadcnui, SiChakraui,
    SiExpress, SiHono, SiLaravel, SiDotnet,
    SiReactrouter, SiReactquery, SiZod,
    SiWebrtc, SiSocketdotio,
    SiBun, SiSqlite, SiTurso, SiDrizzle, SiPrisma,
    SiNpm, SiVercel, SiHeroku, SiRender,
    SiGit, SiJira, SiTrello, SiFigma, SiMysql, SiPostgresql, SiMongodb
} from "react-icons/si"
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
                        <StackIcon label="HTML5" icon={FaHtml5} color="#E34F26" />
                        <StackIcon label="CSS3" icon={FaCss3Alt} color="#1572B6" />
                        <StackIcon label="JavaScript" icon={FaJs} color="#F7DF1E" />
                        <StackIcon label="TypeScript" icon={SiTypescript} color="#3178C6" />
                        <StackIcon label="C#" icon={TbBrandCSharp} color="#8D74E4" />
                        <StackIcon label="PHP" icon={SiPhp} color="#777BB4" />
                        <StackIcon label="Markdown" icon={SiMarkdown} color="#000000" />
                    </div>
                    <h3 className="mt-6 mb-2 text-lg font-semibold">{t('frontendFrameworks')}</h3>
                    <div className="grid grid-cols-3 gap-1 mb-12">
                        <StackIcon label="React" icon={FaReact} color="#61DAFB" />
                        <StackIcon label="Next.js" icon={SiNextdotjs} color="black" />
                        <StackIcon label="Vue.js" icon={SiVuedotjs} color="#42b883" />
                        <StackIcon label="Vite" icon={SiVite} color="#646CFF" />
                        <StackIcon label="Redux" icon={SiRedux} color="#764abc" />
                        <StackIcon label="EJS" icon={SiEjs} color="black" />
                        <StackIcon label="TailwindCSS" icon={SiTailwindcss} color="#38B2AC" />
                        <StackIcon label="shadcn/ui" icon={SiShadcnui} color="black" />
                        <StackIcon label="Chakra UI" icon={SiChakraui} color="#4ED1C5" />
                    </div>

                    <h3 className="mt-6 mb-2 text-lg font-semibold">{t('backendFrameworks')}</h3>
                    <div className="grid grid-cols-3 gap-2 mb-12">
                        <StackIcon label="Express.js" icon={SiExpress} color="#404d59" />
                        <StackIcon label="Hono" icon={SiHono} color="#FF9859" />
                        <StackIcon label="Laravel" icon={SiLaravel} color="#FF2D20" />
                        <StackIcon label=".NET" icon={SiDotnet} color="#5C2D91" />
                    </div>

                    <h3 className="mt-6 mb-2 text-lg font-semibold">{t('stateManagement')}</h3>
                    <div className="grid grid-cols-3 gap-2 mb-12">
                        <StackIcon label="React Router" icon={SiReactrouter} color="#CA4245" />
                        <StackIcon label="React Query" icon={SiReactquery} color="#FF4154" />
                        <StackIcon label="Zod" icon={SiZod} color="#3068b7" />
                    </div>

                    <h3 className="mt-6 mb-2 text-lg font-semibold">{t('webTechnologies')}</h3>
                    <div className="grid grid-cols-3 gap-2 mb-12">
                        <StackIcon label="WebRTC" icon={SiWebrtc} color="#333" />
                        <StackIcon label="Socket.IO" icon={SiSocketdotio} color="black" />
                    </div>

                    <h3 className="mt-6 mb-2 text-lg font-semibold">{t('runtimeEnvironments')}</h3>
                    <div className="grid grid-cols-3 gap-2 mb-12">
                        <StackIcon label="Node.js" icon={FaNodeJs} color="#339933" />
                        <StackIcon label="Bun" icon={SiBun} color="black" />
                    </div>

                    <h3 className="mt-6 mb-2 text-lg font-semibold">{t('databasesORMs')}</h3>
                    <div className="grid grid-cols-3 gap-2 mb-12">
                        <StackIcon label="MySQL" icon={SiMysql} color="#00758F" />
                        <StackIcon label="PostgreSQL" icon={SiPostgresql} color="#336791" />
                        <StackIcon label="MongoDB" icon={SiMongodb} color="#4ea94b" />
                        <StackIcon label="SQLite" icon={SiSqlite} color="#07405e" />
                        <StackIcon label="Turso" icon={SiTurso} color="black" />
                        <StackIcon label="Drizzle" icon={SiDrizzle} color="#C5F74F" />
                        <StackIcon label="Prisma" icon={SiPrisma} color="#3982CE" />
                    </div>

                    <h3 className="mt-6 mb-2 text-lg font-semibold">{t('devopsDeployment')}</h3>
                    <div className="grid grid-cols-3 gap-2 mb-12">
                        <StackIcon label="NPM" icon={SiNpm} color="#CB3837" />
                        <StackIcon label="Vercel" icon={SiVercel} color="black" />
                        <StackIcon label="Heroku" icon={SiHeroku} color="#430098" />
                        <StackIcon label="Render" icon={SiRender} color="black" />
                        <StackIcon label="GitHub Pages" icon={FaGithub} color="black" />
                    </div>

                    <h3 className="mt-6 mb-2 text-lg font-semibold">{t('toolsCollaborations')}</h3>
                    <div className="grid grid-cols-3 gap-2 mb-12">
                        <StackIcon label="Git" icon={SiGit} color="#F05033" />
                        <StackIcon label="Jira" icon={SiJira} color="#0A0FFF" />
                        <StackIcon label="Trello" icon={SiTrello} color="#026AA7" />
                        <StackIcon label="Figma" icon={SiFigma} color="#F24E1E" />
                    </div>

                </div>
            </div>
        </div>
    );
}