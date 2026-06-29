"use client";

import Image from "next/image";
import {
    FileText,
    FolderOpen,
    Mail,
    Settings,
    SquareTerminal,
    UserRound,
} from "lucide-react";
import { appCatalog } from "@/features/gui-v2/apps/appCatalog";
import {
    isProjectAppId,
    type GuiAppId,
} from "@/features/gui-v2/apps/appTypes";

const coreIcons = {
    about: UserRound,
    projects: FolderOpen,
    resume: FileText,
    terminal: SquareTerminal,
    contact: Mail,
    settings: Settings,
} as const;

export function GuiAppIcon({
    appId,
    size = "dock",
}: {
    appId: GuiAppId;
    size?: "dock" | "desktop" | "project";
}) {
    const iconSize =
        size === "desktop" ? 30 : size === "project" ? 38 : 24;

    if (isProjectAppId(appId)) {
        return (
            <span
                className="gui-v2-app-icon"
                data-app-icon={appId}
                data-size={size}
                aria-hidden="true"
            >
                <Image
                    src={appCatalog[appId].icon}
                    alt=""
                    width={iconSize}
                    height={iconSize}
                    className="gui-v2-app-icon-image"
                />
            </span>
        );
    }

    const Icon = coreIcons[appId];
    return (
        <span
            className="gui-v2-app-icon"
            data-app-icon={appId}
            data-size={size}
            aria-hidden="true"
        >
            <Icon
                width={iconSize}
                height={iconSize}
                strokeWidth={1.75}
            />
        </span>
    );
}
