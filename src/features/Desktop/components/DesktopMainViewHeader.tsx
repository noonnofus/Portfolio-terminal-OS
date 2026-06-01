import { useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import Calendar from "react-calendar";
import Clock from "react-clock";
import DesktopHeaderAppMenu from "./DesktopHeaderAppMenu";
import LanguageSelector from "@/features/Apps/Settings/LanguageSelector";
import { useDesktopStore } from "@/features/Desktop/store/useDesktopStore";
import { useLanguageStore } from "@/shared/lib/i18n/useLanguageStore";
import "@/shared/styles/calender.css";

export default function DesktopMainViewHeader() {
    const [time, setTime] = useState<string>("");
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
    const [isAnimating, setIsAnimating] = useState<boolean>(false);
    const isAppMenuShow = useDesktopStore((state) => state.showAppMenu);
    const setShowAppMenu = useDesktopStore((state) => state.setShowAppMenu);
    const currentLanguage = useLanguageStore((state) => state.currentLanguage);

    const toggleDatePicker = () => {
        if (showDatePicker) {
            setIsAnimating(true);
            setTimeout(() => {
                setShowDatePicker(false);
                setIsAnimating(false);
            }, 300);
        } else {
            setShowDatePicker(true);
        }
    };

    const headerTexts = {
        ko: "김현호",
        en: "HyunHoKim",
    };

    setInterval(() => {
        const now = new Date();
        const formattedTime = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
        setTime(formattedTime);
    }, 1000);

    return (
        <div className="relative w-full">
            <Flex
                gap="4"
                justify="space-between"
                className="bg-gray-600/20 backdrop-blur-sm px-4 py-2"
                zIndex={11}
                position="relative"
            >
                <Box flex="1">
                    <img
                        src="/icons/main.png"
                        alt="application list icon"
                        width={24}
                        style={{
                            cursor: "pointer",
                        }}
                        onClick={() => setShowAppMenu(!isAppMenuShow)}
                    />
                </Box>
                <Box
                    height="20px"
                    borderRight="1px solid #ccc"
                    margin="0 8px"
                />
                <Box flex="2" textAlign="center" className="text-white">
                    {headerTexts[currentLanguage]}
                </Box>
                <Box
                    height="20px"
                    borderRight="1px solid #ccc"
                    margin="0 8px"
                />
                <Box
                    flex="1"
                    display="flex"
                    alignItems="center"
                    justifyContent="flex-end"
                    position="relative"
                    gap={2}
                >
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <LanguageSelector />
                    </Box>
                    <Box>
                        <img
                            src={"/icons/wifi-connect.png"}
                            alt="wifi-status-icon"
                            width={16}
                            height={16}
                            style={{
                                objectFit: "contain",
                            }}
                        />
                    </Box>
                    <Box
                        onClick={toggleDatePicker}
                        className="ml-2 cursor-pointer text-white"
                    >
                        {time}
                    </Box>
                </Box>
            </Flex>
            {isAppMenuShow && <DesktopHeaderAppMenu />}
            {showDatePicker && (
                <div
                    className={`absolute right-1 top-10 z-10 p-3 rounded-xl ${
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
        <Box className="rounded-lg">
            <Clock />
            <Calendar />
        </Box>
    );
}
