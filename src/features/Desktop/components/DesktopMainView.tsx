"use client";

import DesktopMainViewHeader from "./DesktopMainViewHeader";
import DesktopMainDragArea from "./DesktopMainDragArea";
import { useDesktopShortcuts } from "../hooks/useDesktopShortcuts";
import useIsTouchDevice from "@/features/Desktop/hooks/useIsTouchDevice";
import DesktopMainTouchArea from "./DesktopMainTouchArea";
import "@/shared/styles/appLayout.css";

export default function DesktopMainView() {
    const isTouchDevice = useIsTouchDevice();
    useDesktopShortcuts();

    return (
        <div
            className="flex flex-col h-screen w-full bg-cover bg-center"
            style={{
                backgroundImage: "url(/images/desktop-bg.jpg)",
            }}
        >
            {isTouchDevice ? (
                <>
                    <DesktopMainViewHeader />
                    <DesktopMainTouchArea />
                </>
            ) : (
                <>
                    <DesktopMainViewHeader />
                    <DesktopMainDragArea />
                </>
            )}
        </div>
    );
}
