"use client";

import { Flex } from "@chakra-ui/react";
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
        <Flex
            backgroundImage="url(/images/desktop-bg.jpg)"
            backgroundSize="cover"
            backgroundPosition="center"
            height="100vh"
            width="100%"
            flexDirection="column"
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
        </Flex>
    );
}
