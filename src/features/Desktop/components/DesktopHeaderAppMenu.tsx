'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Power, RotateCcw } from "lucide-react";
import getRootApplicationDefinitions from "@/features/applications/lib/getRootApplicationDefinitions";
import { useDesktopStore } from "@/features/Desktop/store/useDesktopStore";
import { useLanguageStore } from "@/shared/lib/i18n/useLanguageStore";

export default function DesktopHeaderAppMenu() {
    const setActiveApp = useDesktopStore((state) => state.setActiveApp);
    const setShowAppMenu = useDesktopStore((state) => state.setShowAppMenu);
    const language = useLanguageStore((state) => state.currentLanguage);
    const router = useRouter();

    const hanldeShutdownClick = () => {
        router.push('/');
    }

    const handleRebootClick = () => {
        router.push('/');
    }

    return (
        <div
            className="absolute z-10 flex min-h-[150px] w-[400px] flex-col rounded-pen-lg border border-window-border bg-window-surface p-4 text-window-foreground shadow-[1.5px_1.5px_1.5px_rgba(0,0,0,0.1)] backdrop-blur-md"
            role="menu"
            aria-label="Application menu"
        >
            <div className="flex">
                <div className="w-[40%] border-r border-window-border pt-2">
                    Applications
                </div>
                <div className="w-[60%] flex flex-col pl-2">
                    {getRootApplicationDefinitions(language).map((app, i) => {
                        return (
                            <button
                                type="button"
                                key={i}
                                className="flex items-center rounded-pen-sm p-2 text-left hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-window-foreground"
                                onClick={() => {
                                    setActiveApp(app.appName);
                                    setShowAppMenu(false);
                                }}
                            >
                                <Image
                                    src={app.iconSrc}
                                    alt={app.title}
                                    width={30}
                                    height={30}
                                    className="w-[30px] h-[30px]"
                                />
                                <div className="w-2" />
                                <span className="select-none">{app.title}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
            <div className="mt-3 flex flex-col border-t border-window-border pt-3">
                <button
                    type="button"
                    className="flex w-[180px] items-center rounded-pen-md p-2 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-window-foreground"
                    onClick={hanldeShutdownClick}
                >
                    <Power className="w-[30px] h-[30px]" />
                    <div className="w-2" />
                    <span className="select-none">Shutdown</span>
                </button>
                <button
                    type="button"
                    className="flex w-[180px] items-center rounded-pen-md p-2 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-window-foreground"
                    onClick={handleRebootClick}
                >
                    <RotateCcw className="w-[30px] h-[30px]" />
                    <div className="w-2" />
                    <span className="select-none">Reboot</span>
                </button>
            </div>
        </div>
    );
}
