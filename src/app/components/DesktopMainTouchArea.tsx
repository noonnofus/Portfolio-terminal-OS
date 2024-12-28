'use client';

import { Flex } from "@chakra-ui/react";
import React, { useState } from "react";
import DesktopApps from "@/lib/apps";
import { DesktopIcon } from "./DesktopIcon";

export default function DesktopMainTouchArea() {
    const [activeApp, setActiveApp] = useState<string>('');

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
                            onClick={() => setActiveApp(app.appName)}
                            title={app.title}
                        />
                        {activeApp === app.appName ? app.component : null}
                    </React.Fragment>
                ))}
            </Flex>
        </Flex>
    );
}
