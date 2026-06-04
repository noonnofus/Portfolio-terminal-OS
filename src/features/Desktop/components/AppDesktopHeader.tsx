"use client";

import { CircleX, Maximize2, Minimize2 } from "lucide-react";
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
            <div className="flex justify-between gap-3 bg-window-surface px-4 py-2 text-window-foreground">
                <div className="flex-1 flex items-center justify-start relative">
                    <button
                        type="button"
                        onClick={() => {
                            closeApp(appName);
                        }}
                        className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-window-foreground"
                        aria-label={`Close ${title}`}
                    >
                        <CircleX className="text-[#FF605C] w-[1.2em] h-[1.2em]" />
                    </button>
                    <button
                        type="button"
                        className="ml-3 flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-window-foreground"
                        onClick={() => setIsFullScreen(!isFullScreen)}
                        aria-label={isFullScreen ? `Exit fullscreen for ${title}` : `Enter fullscreen for ${title}`}
                    >
                        {isFullScreen ? (
                            <Minimize2 className="text-[#00CA4E] w-[1.2em] h-[1.2em]" />
                        ) : (
                            <Maximize2 className="text-[#00CA4E] w-[1.2em] h-[1.2em]" />
                        )}
                    </button>
                </div>
                <div className="flex-1 text-center font-medium text-window-foreground">
                    {title}
                </div>
                <div className="flex-1" />
            </div>
        </div>
    );
}
