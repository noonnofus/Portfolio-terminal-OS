'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import DesktopApps from "@/features/Apps/Config/apps";
import { RiShutDownLine } from "react-icons/ri";
import { MdOutlineRestartAlt } from "react-icons/md";
import { useDesktopStore } from "@/features/Desktop/store/useDesktopStore";

export default function DesktopHeaderAppMenu() {
    const setActiveApp = useDesktopStore((state) => state.setActiveApp);
    const setShowAppMenu = useDesktopStore((state) => state.setShowAppMenu);
    const router = useRouter();

    const hanldeShutdownClick = () => {
        router.push('/');
    }

    const handleRebootClick = () => {
        router.push('/');
    }

    return (
        <div className="w-[400px] min-h-[150px] absolute z-10 bg-white/95 text-black p-4 border border-black/10 rounded-lg flex flex-col shadow-[1.5px_1.5px_1.5px_rgba(0,0,0,0.1)]">
            <div className="flex">
                <div className="w-[40%] border-r border-black/10 pt-2">
                    Applications
                </div>
                <div className="w-[60%] flex flex-col pl-2">
                    {DesktopApps().map((app, i) => {
                        return (
                            <div
                                key={i}
                                className="flex items-center p-2 hover:bg-gray-200 rounded-[5px] cursor-pointer"
                                onClick={() => {
                                    setActiveApp(app.appName);
                                    setShowAppMenu(false);
                                }}
                            >
                                <Image
                                    src={`/icons/${app.iconName}`}
                                    alt={app.title}
                                    width={30}
                                    height={30}
                                    className="w-[30px] h-[30px]"
                                />
                                <div className="w-2" />
                                <span className="select-none">{app.title}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="flex flex-col border-t border-black/10 pt-3 mt-3">
                <div
                    className="hover:bg-gray-200 p-2 cursor-pointer w-[180px] rounded-[10px] flex items-center"
                    onClick={hanldeShutdownClick}
                >
                    <RiShutDownLine className="w-[30px] h-[30px]" />
                    <div className="w-2" />
                    <span className="select-none">Shutdown</span>
                </div>
                <div
                    className="hover:bg-gray-200 p-2 cursor-pointer w-[180px] rounded-[10px] flex items-center"
                    onClick={handleRebootClick}
                >
                    <MdOutlineRestartAlt className="w-[30px] h-[30px]" />
                    <div className="w-2" />
                    <span className="select-none">Reboot</span>
                </div>
            </div>
        </div>
    );
}
