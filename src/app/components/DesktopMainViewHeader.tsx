'use client';

import { useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import Calendar from 'react-calendar';
import Clock from 'react-clock';
import DesktopHeaderAppMenu from "./DesktopHeaderAppMenu";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from "../store/store";
import { setShowAppMenu } from "../store/features/desktopSlice";
import '../styles/calender.css';

export default function DesktopMainViewHeader() {
    const [time, setTime] = useState<string>('');
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
    const [isAnimating, setIsAnimating] = useState<boolean>(false);
    const isAppMenuShow = useSelector((state: RootState) => state.desktop.showAppMenu);
    const dispatch = useDispatch();

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
            >
                <Box flex="1">
                    <img
                        src="/icons/main.png"
                        alt="application list icon"
                        width={24}
                        style={{
                            cursor: 'pointer'
                        }}
                        onClick={() => dispatch(setShowAppMenu(!isAppMenuShow))}
                    />
                </Box>
                <Box
                    height="20px"
                    borderRight="1px solid #ccc"
                    margin="0 8px"
                />
                <Box flex="2" textAlign="center" className="text-white">
                    HyunHoKim
                </Box>
                <Box
                    height="20px"
                    borderRight="1px solid #ccc"
                    margin="0 8px"
                />
                <Box flex="1" display="flex" alignItems="center" justifyContent="flex-end" position="relative">
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
            {isAppMenuShow && (
                <DesktopHeaderAppMenu />
            )}
            {showDatePicker && (
                <div className={`absolute right-1 top-10 z-10 p-3 rounded-xl ${isAnimating ? 'animate-slideOut' : 'animate-slideIn'
                    }`}>
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