import Image from "next/image";
import {
    Brain,
    Braces,
    Cable,
    Cloud,
    Database,
    DatabaseZap,
    ExternalLink,
    FileCode,
    FileCode2,
    GitBranch,
    Palette,
    RadioTower,
    Rocket,
    Server,
    ServerCog,
} from "lucide-react";
import StackIcon from "@/shared/components/StackIcon";
import { useTranslation } from "react-i18next";
import { Language } from "@/shared/lib/i18n/useLanguageStore";

interface AppProjectWeConnectProps {
    language: Language;
}

export default function AppProjcetWeConnect({}: AppProjectWeConnectProps) {
    const { t } = useTranslation(["WeConnect", "common"]);
    return (
        <div
            className="overflow-scroll bg-white rounded-b-pen-lg text-black"
        >
            <div className="my-8 mx-4 md:mx-36">
                <div
                    className="flex flex-col items-center mt-8 mb-3"
                >
                    <h2
                        className="font-bold text-3xl text-pen-gray-800 mb-6"
                    >
                        {t("title")}
                    </h2>

                    <Image
                        src="/images/weconnect-logo.svg"
                        alt="project WCHMS logo image"
                        width={300}
                        height={120}
                        className="mb-4 w-[300px] h-auto object-cover"
                    />
                    
                    <a
                        href="https://idsp-weconnect-1.onrender.com"
                        className="underline mb-4 flex items-center gap-1"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {t("linkAction")} <ExternalLink />
                    </a>

                    <div className="max-w-[700px] flex flex-col ml-1 mr-1">
                        <div className="mb-6">
                            <h3
                                className="font-semibold text-xl text-pen-gray-800"
                            >
                                {t("common:overview")}
                            </h3>
                            <p className="mt-1 text-sm text-pen-gray-600">
                                📌 <b>{t("common:projectType")}:</b>{" "}
                                {t("common:groupProject")}
                            </p>
                            <p className="mt-2">{t("description")}</p>
                        </div>

                        <div
                            className="w-full border-t border-pen-gray-300 mx-auto"
                        />

                        <div className="mb-6 mt-6">
                            <h3
                                className="font-semibold text-xl text-pen-gray-800"
                            >
                                {t("common:myRole")}
                            </h3>
                            <p className="mt-2 text-pen-gray-700">
                                {t("myRoleDescription")}
                            </p>

                            <ul
                                className="mt-4 ps-4 flex flex-col gap-3 text-pen-gray-700 list-disc"
                            >
                                <li>
                                    <strong>{t("realtimeTranslation")}:</strong>{" "}
                                    {t("realtimeTranslationDesc")}
                                </li>
                                <li>
                                    <strong>
                                        {t("videoChatInfrastructure")}:
                                    </strong>{" "}
                                    {t("videoChatInfrastructureDesc")}
                                </li>
                                <li>
                                    <strong>{t("userInterfaceUX")}:</strong>{" "}
                                    {t("userInterfaceUXDesc")}
                                </li>
                                <li>
                                    <strong>
                                        {t("authenticationRoomManagement")}:
                                    </strong>{" "}
                                    {t("authenticationRoomManagementDesc")}
                                </li>
                            </ul>
                        </div>

                        <div
                            className="w-full border-t border-pen-gray-300 mx-auto"
                        />

                        <div className="mb-6 mt-6">
                            <h3
                                className="mb-2 font-semibold text-xl text-pen-gray-800"
                            >
                                Tech Stack
                            </h3>

                            <h4
                                className="mt-6 mb-2 text-lg font-semibold"
                            >
                                Frontend
                            </h4>
                            <div className="grid grid-cols-3 gap-5 mb-12">
                                <StackIcon
                                    label="JavaScript"
                                    icon={Braces}
                                    color="#f7df1e"
                                />
                                <StackIcon
                                    label="EJS"
                                    icon={FileCode}
                                    color="#A91E50"
                                />
                                <StackIcon
                                    label="CSS3"
                                    icon={Palette}
                                    color="#264de4"
                                />
                            </div>

                            <h4
                                className="mt-6 mb-2 text-lg font-semibold"
                            >
                                {t("backendDatabase")}
                            </h4>
                            <div className="grid grid-cols-3 gap-5 mb-12">
                                <StackIcon
                                    label="TypeScript"
                                    icon={FileCode2}
                                    color="#3178C6"
                                />
                                <StackIcon
                                    label="Node.js"
                                    icon={Server}
                                    color="#339933"
                                />
                                <StackIcon
                                    label="Express"
                                    icon={ServerCog}
                                    color="black"
                                />
                                <StackIcon
                                    label="Prisma ORM"
                                    icon={DatabaseZap}
                                    color="#0C344B"
                                />
                                <StackIcon
                                    label="MySQL"
                                    icon={Database}
                                    color="#00758F"
                                />
                            </div>

                            <h4
                                className="mt-6 mb-2 text-lg font-semibold"
                            >
                                {t("realtimeCommunication")}
                            </h4>
                            <div className="grid grid-cols-3 gap-5 mb-12">
                                <StackIcon
                                    label="WebRTC"
                                    icon={RadioTower}
                                    color="#3333cc"
                                />
                                <StackIcon
                                    label="WebSocket"
                                    icon={Cable}
                                    color="#4A5568"
                                />
                            </div>

                            <h4
                                className="mt-6 mb-2 text-lg font-semibold"
                            >
                                {t("apis")}
                            </h4>
                            <div className="grid grid-cols-3 gap-5 mb-12">
                                <StackIcon
                                    label="OpenAI API"
                                    icon={Brain}
                                    color="#7fdbff"
                                />
                                <StackIcon
                                    label="Google Speech-to-Text"
                                    icon={Cloud}
                                    color="#4285F4"
                                />
                            </div>

                            <h4
                                className="mt-6 mb-2 text-lg font-semibold"
                            >
                                {t("deploymentTools")}
                            </h4>
                            <div className="grid grid-cols-3 gap-5 mb-6">
                                <StackIcon
                                    label="Render"
                                    icon={Rocket}
                                    color="#46E3B7"
                                />
                                <StackIcon
                                    label="GitHub"
                                    icon={GitBranch}
                                    color="black"
                                />
                                <StackIcon
                                    label="Git"
                                    icon={GitBranch}
                                    color="#F05033"
                                />
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
