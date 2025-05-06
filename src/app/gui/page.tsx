'use client';

import DesktopMainView from "../components/DesktopMainView";
import LoginModal from "../components/DesktopLoginModal";
import { useSelector } from 'react-redux';
import { RootState } from "../store/store";
import { createClient } from "@/lib/supabaseClient";
import { useState, useEffect } from "react";

export default function guiPage() {
    const supabase = createClient();
    const user = useSelector((state: RootState) => state.desktop.user);
    const [hasSession, setHasSession] = useState<boolean | null>(null);

    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setHasSession(!!session?.user);
        });

        supabase.auth.getUser().then(({ data: { user } }) => {
            setHasSession(!!user);
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [supabase]);

    if (hasSession || (user as any)?.role === 'guest') {
        return <DesktopMainView />;
    }

    return <LoginModal />;
}