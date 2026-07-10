import Image from "next/image";
import {
    Brain,
    Cable,
    ClipboardList,
    Cloud,
    Database,
    DatabaseZap,
    ExternalLink,
    FileCode2,
    FileText,
    GitBranch,
    Key,
    Palette,
    PanelsTopLeft,
    Triangle,
} from "lucide-react";
import StackIcon from "@/shared/components/StackIcon";
import { useTranslation } from "react-i18next";
import { Language } from "@/shared/lib/i18n/useLanguageStore";

interface AppProjectWCHMSProps {
    language: Language;
}

export default function AppProjcetWCHMS({}: AppProjectWCHMSProps) {
    const { t } = useTranslation(["WCHMS", "common"]);
    return (
        <div
            className="gui-app-surface h-full overflow-y-auto"
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
                        src="/icons/wchms.png"
                        alt="project WCHMS logo image"
                        width={150}
                        height={150}
                        className="mb-4 w-[150px] h-auto object-cover"
                    />
                    
                    <a
                        href="https://wchms-idsp4.fly.dev/"
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
                                {t("common:clientGroupProject")}
                            </p>
                            <div className="mt-2">
                                {t("description")}
                                <p className="mt-1">{t("descriptionContinued")}</p>
                            </div>
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
                                    <strong>{t("aiPoweredSelfStudy")}:</strong>{" "}
                                    {t("aiPoweredSelfStudyDesc")}
                                </li>
                                <li>
                                    <strong>
                                        {t("automatedCourseMaterial")}:
                                    </strong>{" "}
                                    {t("automatedCourseMaterialDesc")}
                                </li>
                                <li>
                                    <strong>
                                        {t("adminManagementSystem")}:
                                    </strong>{" "}
                                    {t("adminManagementSystemDesc")}
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
                                {t("common:techStack")}
                            </h3>

                            <h4
                                className="mt-6 mb-2 text-lg font-semibold"
                            >
                                {t("common:frontend")}
                            </h4>
                            <div className="grid grid-cols-3 gap-5 mb-12">
                                <StackIcon
                                    label="TypeScript"
                                    icon={FileCode2}
                                    color="#3178C6"
                                />
                                <StackIcon
                                    label="Next.js"
                                    icon={Triangle}
                                    color="black"
                                />
                                <StackIcon
                                    label="TailwindCSS"
                                    icon={Palette}
                                    color="#38B2AC"
                                />
                                <StackIcon
                                    label="shadcn/ui"
                                    icon={PanelsTopLeft}
                                    color="black"
                                />
                                <StackIcon
                                    label="next-i18n"
                                    icon={Triangle}
                                    color="black"
                                />
                            </div>

                            <h4
                                className="mt-6 mb-2 text-lg font-semibold"
                            >
                                {t("common:backend")}
                            </h4>
                            <div className="grid grid-cols-3 gap-5 mb-12">
                                <StackIcon
                                    label="Drizzle ORM"
                                    icon={DatabaseZap}
                                    color="#C5F74F"
                                />
                                <StackIcon
                                    label="MySQL"
                                    icon={Database}
                                    color="#00758F"
                                />
                                <StackIcon
                                    label="WebSocket"
                                    icon={Cable}
                                    color="black"
                                />
                            </div>

                            <h4
                                className="mt-6 mb-2 text-lg font-semibold"
                            >
                                {t("common:authentication")}
                            </h4>
                            <div className="grid grid-cols-3 gap-5 mb-12">
                                <StackIcon
                                    label="NextAuth"
                                    icon={Key}
                                    color="black"
                                />
                            </div>

                            <h4
                                className="mt-6 mb-2 text-lg font-semibold"
                            >
                                {t("common:librariesServices")}
                            </h4>
                            <div className="grid grid-cols-3 gap-5 mb-12">
                                <StackIcon
                                    label="OpenAI API"
                                    icon={Brain}
                                    color="#7fdbff"
                                />
                                <StackIcon
                                    label="AWS S3 Bucket"
                                    icon={Cloud}
                                    color="#FF9900"
                                />
                                <StackIcon
                                    label="react-pdf"
                                    icon={FileText}
                                    color="#d32f2f"
                                />
                            </div>

                            <h4
                                className="mt-6 mb-2 text-lg font-semibold"
                            >
                                {t("common:otherTools")}
                            </h4>
                            <div className="grid grid-cols-3 gap-5 mb-6">
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
                                <StackIcon
                                    label="Jira"
                                    icon={ClipboardList}
                                    color="#0052CC"
                                />
                            </div>
                        </div>

                        <div
                            className="w-full border-t border-pen-gray-300 mx-auto mb-6"
                        />

                        <div className="mt-6">
                            <h3
                                className="font-semibold text-xl text-pen-gray-800"
                            >
                                {t("common:appWalkthrough")}
                            </h3>
                            <p className="mt-2">{t("appWalkthroughDescription")}</p>
                            <div className="w-full aspect-video">
                                <video controls className="w-full h-full">
                                    <source
                                        src="videos/wchms-walkthrough.mp4"
                                        type="video/mp4"
                                    />
                                    {t("common:videoNotSupported")}
                                </video>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
