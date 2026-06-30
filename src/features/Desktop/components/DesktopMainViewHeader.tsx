import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Calendar from "react-calendar";
import DesktopHeaderAppMenu from "./DesktopHeaderAppMenu";
import LanguageSelector from "@/features/applications/components/settings/LanguageSelector";
import { useDesktopStore } from "@/features/Desktop/store/useDesktopStore";
import { useLanguageStore } from "@/shared/lib/i18n/useLanguageStore";
import "@/shared/styles/calender.css";

function formatCurrentTime() {
    const now = new Date();
    return `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
}

export default function DesktopMainViewHeader() {
    const [time, setTime] = useState<string>("--:--:--");
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

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setShowAppMenu(false);
                setShowDatePicker(false);
                setIsAnimating(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [setShowAppMenu]);

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
            <div className="relative z-10 flex justify-between gap-4 border-b border-desktop-bar-border bg-desktop-bar px-4 py-2 text-desktop-bar-foreground backdrop-blur-sm">
                <div className="flex-1">
                    <button
                        type="button"
                        aria-label="Toggle application menu"
                        aria-expanded={isAppMenuShow}
                        onClick={() => setShowAppMenu(!isAppMenuShow)}
                        className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-desktop-bar-foreground"
                    >
                        <Image
                            src="/icons/about.png"
                            alt=""
                            width={24}
                            height={24}
                            className="w-6"
                        />
                    </button>
                </div>
                <div className="mx-2 h-5 border-r border-desktop-bar-border" />
                <div className="flex-[2] text-center text-desktop-bar-foreground">
                    {headerTexts[currentLanguage]}
                </div>
                <div className="mx-2 h-5 border-r border-desktop-bar-border" />
                <div className="flex-1 flex items-center justify-end relative gap-2">
                    <div className="flex items-center justify-center">
                        <LanguageSelector />
                    </div>
                    <div>
                        <Image
                            src={"/icons/about.png"}
                            alt="wifi-status-icon"
                            width={16}
                            height={16}
                            className="w-4 h-4 object-contain"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={toggleDatePicker}
                        aria-expanded={showDatePicker}
                        aria-label="Toggle date and time panel"
                        className="ml-2 text-desktop-bar-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-desktop-bar-foreground"
                    >
                        {time || "--:--:--"}
                    </button>
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
