"use client";

import Image from "next/image";
import { appCatalog } from "@/features/gui-v2/apps/appCatalog";
import {
    createOpenAppCommand,
    type GuiAppId,
} from "@/features/gui-v2/apps/appTypes";
import { useGuiNavigation } from "@/features/gui-v2/navigation/GuiNavigationProvider";
import { useGuiV2Store } from "@/features/gui-v2/store/GuiV2StoreProvider";

const dockAppIds = [
    "about",
    "projects",
    "resume",
    "terminal",
    "contact",
] as const satisfies readonly GuiAppId[];

export function GuiDockV2() {
    const language = useGuiV2Store((state) => state.language);
    const activeWindowId = useGuiV2Store((state) =>
        state.focus.mode === "windows"
            ? state.focus.activeWindowId
            : null,
    );
    const { navigate, navigationBusy } = useGuiNavigation();

    return (
        <nav aria-label="Applications" className="gui-v2-dock">
            {dockAppIds.map((appId) => {
                const app = appCatalog[appId];
                return (
                    <button
                        key={appId}
                        type="button"
                        disabled={navigationBusy}
                        aria-label={app.titles[language]}
                        aria-pressed={activeWindowId === appId}
                        onClick={() =>
                            navigate(createOpenAppCommand(appId))
                        }
                        className="gui-v2-dock-button"
                    >
                        <Image
                            src={app.icon}
                            alt=""
                            width={34}
                            height={34}
                            className="h-8 w-8 object-contain"
                        />
                        <span className="sr-only">
                            {app.titles[language]}
                        </span>
                    </button>
                );
            })}
        </nav>
    );
}
