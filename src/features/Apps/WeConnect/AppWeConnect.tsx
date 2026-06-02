import Image from "next/image";
import {
    SiTypescript,
    SiJavascript,
    SiEjs,
    SiCss3,
    SiExpress,
    SiGit,
    SiPrisma,
    SiMysql,
    SiWebrtc,
    SiGooglecloud,
    SiRender,
} from "react-icons/si";
import { FaGithub, FaBrain, FaProjectDiagram, FaNodeJs } from "react-icons/fa";
import StackIcon from "@/shared/components/StackIcon";
import { GoLinkExternal as ExternalLinkIcon } from "react-icons/go";
import { useTranslation } from "react-i18next";
import { Language } from "@/shared/lib/i18n/useLanguageStore";

interface AppProjectWeConnectProps {
    language: Language;
}

export default function AppProjcetWeConnect({}: AppProjectWeConnectProps) {
    const { t } = useTranslation(["WeConnect", "common"]);
    return (
        <div
            className="overflow-scroll bg-white rounded-b-lg text-black"
        >
            <div className="my-8 mx-4 md:mx-36">
                <div
                    className="flex flex-col items-center mt-8 mb-3"
                >
                    <h2
                        className="font-bold text-3xl text-gray-800 mb-6"
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
                        {t("linkAction")} <ExternalLinkIcon />
                    </a>

                    <div className="max-w-[700px] flex flex-col ml-1 mr-1">
                        <div className="mb-6">
                            <h3
                                className="font-semibold text-xl text-gray-800"
                            >
                                {t("common:overview")}
                            </h3>
                            <p className="mt-1 text-sm text-gray-600">
                                📌 <b>{t("common:projectType")}:</b>{" "}
                                {t("common:groupProject")}
                            </p>
                            <p className="mt-2">{t("description")}</p>
                        </div>

                        <div
                            className="w-full border-t border-[#ccc] mx-auto"
                        />

                        <div className="mb-6 mt-6">
                            <h3
                                className="font-semibold text-xl text-gray-800"
                            >
                                {t("common:myRole")}
                            </h3>
                            <p className="mt-2 text-gray-700">
                                {t("myRoleDescription")}
                            </p>

                            <ul
                                className="mt-4 ps-4 flex flex-col gap-3 text-gray-700 list-disc"
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
                            className="w-full border-t border-[#ccc] mx-auto"
                        />

                        <div className="mb-6 mt-6">
                            <h3
                                className="mb-2 font-semibold text-xl text-gray-800"
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
                                    icon={SiJavascript}
                                    color="#f7df1e"
                                />
                                <StackIcon
                                    label="EJS"
                                    icon={SiEjs}
                                    color="#A91E50"
                                />
                                <StackIcon
                                    label="CSS3"
                                    icon={SiCss3}
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
                                    icon={SiTypescript}
                                    color="#3178C6"
                                />
                                <StackIcon
                                    label="Node.js"
                                    icon={FaNodeJs}
                                    color="#339933"
                                />
                                <StackIcon
                                    label="Express"
                                    icon={SiExpress}
                                    color="black"
                                />
                                <StackIcon
                                    label="Prisma ORM"
                                    icon={SiPrisma}
                                    color="#0C344B"
                                />
                                <StackIcon
                                    label="MySQL"
                                    icon={SiMysql}
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
                                    icon={SiWebrtc}
                                    color="#3333cc"
                                />
                                <StackIcon
                                    label="WebSocket"
                                    icon={FaProjectDiagram}
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
                                    icon={FaBrain}
                                    color="#7fdbff"
                                />
                                <StackIcon
                                    label="Google Speech-to-Text"
                                    icon={SiGooglecloud}
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
                                    icon={SiRender}
                                    color="#46E3B7"
                                />
                                <StackIcon
                                    label="GitHub"
                                    icon={FaGithub}
                                    color="black"
                                />
                                <StackIcon
                                    label="Git"
                                    icon={SiGit}
                                    color="#F05033"
                                />
                            </div>
                        </div>

                        <div
                            className="w-full border-t border-[#ccc] mx-auto mb-6"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
