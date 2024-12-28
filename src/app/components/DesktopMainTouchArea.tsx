'use client';

import { Flex } from "@chakra-ui/react";
import React from "react";
import DesktopApps from "@/lib/apps";
import { DesktopIcon } from "./DesktopIcon";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from "../store/store";
import { setActiveApp } from "../store/features/desktopSlice";

export default function DesktopMainTouchArea() {
    const activeApp = useSelector((state: RootState) => state.desktop.activeApp);

    const dispatch = useDispatch();

    return (
        <Flex
            flexGrow={1}
            backgroundRepeat="no-repeat"
            pos="relative"
            backgroundPosition="center"
        >
            <Flex flexWrap="wrap" h="30%">
                {DesktopApps().map((app) => (
                    <React.Fragment key={`touchview-${app.appName}`}>
                        <DesktopIcon
                            key={`touchview-${app.appName}`}
                            iconName={app.iconName}
                            onClick={() => dispatch(setActiveApp(app.appName))}
                            title={app.title}
                        />
                        {activeApp === app.appName ? app.component : null}
                    </React.Fragment>
                ))}
            </Flex>
        </Flex>
    );
}
