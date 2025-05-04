'use client';

import { Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function LoginModal() {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");

    const day = days[now.getDay()];
    const month = months[now.getMonth()];
    const date = now.getDate();

    return (
        <Flex className="w-screen h-screen bg-cover bg-center relative"
            backgroundImage="url(/images/desktop-bg.jpg)"
        >
            <div className="absolute mt-16 w-full text-center text-white">
                <div className="text-2xl"> {day}, {month} {date}</div>
                <div className="text-[5rem] leading-none" style={{ fontWeight: "550" }}>{hours}:{minutes}</div>
            </div>

            <div className="absolute bottom-20 w-full flex flex-col items-center">
                <input
                    placeholder="Name"
                    className="bg-white/10 backdrop-blur-sm text-white placeholder-white px-4 py-2 rounded-3xl mb-2 w-64 text-center"
                />
                <input
                    placeholder="Enter Password"
                    type="password"
                    className="bg-white/10 backdrop-blur-sm text-white placeholder-white px-4 py-2 rounded-3xl w-64 text-center"
                />
                <button className="mt-4 text-white text-sm underline">
                    Continue with Guest
                </button>
            </div>
        </Flex>

    );
}