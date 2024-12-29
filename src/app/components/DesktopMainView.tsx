'use client';

import { Flex } from "@chakra-ui/react"
import DesktopMainViewHeader from "./DesktopMainViewHeader"
import DesktopMainTouchArea from "./DesktopMainTouchArea"
import { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { setActiveApp, setFoucsApp } from "../store/features/desktopSlice";
import { RootState } from "../store/store";
import "../styles/appLayout.css";

export default function DesktopMainView() {
    const focusApp = useSelector((state: RootState) => state.desktop.focusApp);
    const dispatch = useDispatch();


    function setActiveDesktopApp(focusApp: string) {
        dispatch(setActiveApp(focusApp))
    }

    function resetFocusedDesktopApp() {
        dispatch(setFoucsApp(''));
    }

    useEffect(() => {
        const eventHandler = (event: KeyboardEvent) => {
            if (focusApp !== "DesktopMainView") {
                if (event.key === "Enter") {
                    setActiveDesktopApp(focusApp);
                } else if (event.key === "Escape") {
                    resetFocusedDesktopApp();
                }
            }
        };

        window.addEventListener("keydown", eventHandler);

        return () => window.removeEventListener("keydown", eventHandler);
    }, [focusApp]);

    return (
        <Flex
            backgroundImage="url(/images/desktop-bg.jpg)"
            backgroundSize="cover"
            backgroundPosition="center"
            height="100vh"
            width="100%"
            flexDirection="column"
        >
            <DesktopMainViewHeader />
            <DesktopMainTouchArea />
        </Flex>
    )
}