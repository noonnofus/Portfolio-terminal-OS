'use client';

import { Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import { Input } from '@chakra-ui/react';
import { Tooltip } from "@/components/ui/tooltip"
import { ArrowRight } from "lucide-react";

export default function LoginModal() {
    const [now, setNow] = useState(new Date());
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showError, setShowError] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const supabase = await createClient();

        const data = {
            email: email,
            password: password,
        }
        const { error } = await supabase.auth.signInWithPassword(data);

        if (error) {
            setError('Invalid email or password, Please try it again.');
            setShowError(true);
        }
    }

    useEffect(() => {
        if (showError) {
            const timeout = setTimeout(() => {
                setShowError(false);
            }, 3000);

            return () => clearTimeout(timeout);
        }
    }, [showError]);


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
                <form className="flex flex-col items-center" onSubmit={handleLogin}>
                    <Input
                        placeholder="Email"
                        className="bg-white/10 backdrop-blur-sm text-white placeholder-white px-4 py-2 rounded-3xl mb-2 w-64"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <div className="relative w-64">
                        <Tooltip
                            content={error}
                            showArrow
                            open={showError}
                        >
                            <Input
                                placeholder="Enter Password"
                                type="password"
                                className="bg-white/10 backdrop-blur-sm text-white placeholder-white px-4 py-2 pr-10 rounded-3xl w-full"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Tooltip>
                        {email && password && (
                            <button
                                type="submit"
                                className="!absolute right-2 top-1/2 -translate-y-1/2 
                                w-7 h-7 border-2 border-gray-300 rounded-full 
                                flex items-center justify-center bg-transparent"
                            >
                                <ArrowRight className="text-gray-300 w-5 h-5 stroke-[1.5]" />
                            </button>
                        )}
                    </div>
                </form>

                <button className="mt-4 text-white text-md underline">
                    Continue with Guest
                </button>
            </div>
        </Flex>

    );
}