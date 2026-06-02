"use client";

import { IoCloseCircle } from "react-icons/io5";
import { BiFullscreen, BiExitFullscreen } from "react-icons/bi";
import { useDesktopStore } from "@/features/Desktop/store/useDesktopStore";

export default function AppDesktopHeader({
    appName,
    title,
    isFullScreen,
    setIsFullScreen,
}: {
    appName: string;
    title: string;
    isFullScreen: boolean;
    setIsFullScreen: (val: boolean) => void;
}) {
    const closeApp = useDesktopStore((state) => state.closeApp);

    return (
        <div className="relative w-full overflow-hidden">
            <div className="flex gap-3 justify-between bg-gray-300/70 px-4 py-2 rounded-t-lg">
                <div className="flex-1 flex items-center justify-start relative">
                    <div
                        onClick={() => {
                            closeApp(appName);
                        }}
                        className="cursor-pointer flex items-center"
                    >
                        <IoCloseCircle className="text-[#FF605C] w-[1.2em] h-[1.2em]" />
                    </div>
                    <div
                        className="ml-3 cursor-pointer flex items-center"
                        onClick={() => setIsFullScreen(!isFullScreen)}
                    >
                        {isFullScreen ? (
                            <BiExitFullscreen className="text-[#00CA4E] w-[1.2em] h-[1.2em]" />
                        ) : (
                            <BiFullscreen className="text-[#00CA4E] w-[1.2em] h-[1.2em]" />
                        )}
                    </div>
                </div>
                <div className="flex-1 text-center text-black font-medium">
                    {title}
                </div>
                <div className="flex-1" />
            </div>
        </div>
    );
}
