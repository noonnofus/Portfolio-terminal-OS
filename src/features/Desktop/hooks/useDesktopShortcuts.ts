'use client';

import { useEffect } from 'react';
import { useDesktopStore } from '@/features/Desktop/store/useDesktopStore';

export function useDesktopShortcuts() {
    const focusApp = useDesktopStore((state) => state.focusApp);
    const setActiveApp = useDesktopStore((state) => state.setActiveApp);
    const setFocusApp = useDesktopStore((state) => state.setFocusApp);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Ignore if no app is focused or if the main view itself is "focused" in a way that shouldn't trigger these
            if (focusApp && focusApp !== "DesktopMainView") {
                if (event.key === "Enter") {
                    setActiveApp(focusApp);
                } else if (event.key === "Escape") {
                    setFocusApp("");
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [focusApp, setActiveApp, setFocusApp]);
}
