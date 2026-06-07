import { Contact, ExternalLink, GitBranch, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Language } from "@/shared/lib/i18n/useLanguageStore";

interface AppContactProps {
    language: Language;
}

export default function AppContact({}: AppContactProps) {
    const { t } = useTranslation(["Contact", "common"]);
    return (
        <div
            className="w-full h-[95%] overflow-scroll bg-white rounded-b-pen-lg text-black"
        >
            <div className="my-8 mx-4 md:mx-36">
                <div className="px-6 py-4">
                    <h2 className="font-bold text-2xl mb-4">
                        {t("title")}
                    </h2>

                    <p className="mt-2 mb-4 text-md text-pen-gray-700">
                        {t("description")}
                    </p>

                    <div className="flex flex-col gap-4 items-start">
                        <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5" />
                            <a
                                href="mailto:kevinvancouver02@gmail.com"
                                className="underline flex items-center gap-1"
                            >
                                kevinvancouver02@gmail.com <ExternalLink />
                            </a>
                        </div>

                        <div className="flex items-center gap-3">
                            <GitBranch className="w-5 h-5" />
                            <a
                                href="https://github.com/noonnofus"
                                className="underline flex items-center gap-1"
                            >
                                github.com/noonnofus <ExternalLink />
                            </a>
                        </div>

                        <div className="flex items-center gap-3">
                            <Contact className="w-5 h-5" />
                            <a
                                href="https://www.linkedin.com/in/kevin-hyun-ho-kim/"
                                className="underline flex items-center gap-1"
                            >
                                linkedin.com/in/kevin-hyun-ho-kim{" "}
                                <ExternalLink />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
