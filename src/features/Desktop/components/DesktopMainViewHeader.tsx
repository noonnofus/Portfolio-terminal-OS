import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Calendar from "react-calendar";
import DesktopHeaderAppMenu from "./DesktopHeaderAppMenu";
import LanguageSelector from "@/features/Apps/Settings/LanguageSelector";
import { useDesktopStore } from "@/features/Desktop/store/useDesktopStore";
import { useLanguageStore } from "@/shared/lib/i18n/useLanguageStore";
import "@/shared/styles/calender.css";

function formatCurrentTime() {
    const now = new Date();
    return `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
}

export default function DesktopMainViewHeader() {
    const [time, setTime] = useState<string>(formatCurrentTime);
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
    const [isAnimating, setIsAnimating] = useState<boolean>(false);
    const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isAppMenuShow = useDesktopStore((state) => state.showAppMenu);
    const setShowAppMenu = useDesktopStore((state) => state.setShowAppMenu);
    const currentLanguage = useLanguageStore((state) => state.currentLanguage);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTime(formatCurrentTime());
        }, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    useEffect(() => {
        return () => {
            if (closeTimeoutRef.current) {
                clearTimeout(closeTimeoutRef.current);
            }
        };
    }, []);

    const toggleDatePicker = () => {
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = null;
        }

        if (showDatePicker) {
            setIsAnimating(true);

            closeTimeoutRef.current = setTimeout(() => {
                setShowDatePicker(false);
                setIsAnimating(false);
                closeTimeoutRef.current = null;
            }, 300);
        } else {
            setIsAnimating(false);
            setShowDatePicker(true);
        }
    };

    const headerTexts = {
        ko: "김현호",
        en: "HyunHoKim",
    };

    return (
        <div className="relative w-full">
            <div className="flex gap-4 justify-between bg-gray-600/20 backdrop-blur-sm px-4 py-2 relative z-10">
                <div className="flex-1">
                    <Image
                        src="/icons/main.png"
                        alt="application list icon"
                        width={24}
                        height={24}
                        className="w-6 cursor-pointer"
                        onClick={() => setShowAppMenu(!isAppMenuShow)}
                    />
                </div>
                <div className="h-5 border-r border-border/80 mx-2" />
                <div className="flex-[2] text-center text-white">
                    {headerTexts[currentLanguage]}
                </div>
                <div className="h-5 border-r border-border/80 mx-2" />
                <div className="flex-1 flex items-center justify-end relative gap-2">
                    <div className="flex items-center justify-center">
                        <LanguageSelector />
                    </div>
                    <div>
                        <Image
                            src={"/icons/wifi-connect.png"}
                            alt="wifi-status-icon"
                            width={16}
                            height={16}
                            className="w-4 h-4 object-contain"
                        />
                    </div>
                    <div
                        onClick={toggleDatePicker}
                        className="ml-2 cursor-pointer text-white"
                    >
                        {time || "--:--:--"}
                    </div>
                </div>
            </div>
            {isAppMenuShow && <DesktopHeaderAppMenu />}
            {showDatePicker && (
                <div
                    className={`absolute right-1 top-10 z-10 ${
                        isAnimating ? "animate-slideOut" : "animate-slideIn"
                    }`}
                >
                    <DatePicker />
                </div>
            )}
        </div>
    );
}

function DatePicker() {
    return (
        <div className="calendar-panel">
            <Calendar className="design-calendar" />
        </div>
    );
}
