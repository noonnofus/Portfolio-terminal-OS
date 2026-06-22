"use client";

import Image from "next/image";
import { appCatalog } from "@/features/gui-v2/apps/appCatalog";
import {
    createOpenAppCommand,
    type GuiAppId,
} from "@/features/gui-v2/apps/appTypes";
import { useGuiNavigation } from "@/features/gui-v2/navigation/GuiNavigationProvider";
import { useGuiV2Store } from "@/features/gui-v2/store/GuiV2StoreProvider";

const shortcutIds = [
    "projects",
    "resume",
] as const satisfies readonly GuiAppId[];

export function GuiDesktopShortcutsV2() {
    const language = useGuiV2Store((state) => state.language);
    const { navigate, navigationBusy } = useGuiNavigation();

    return (
        <nav aria-label="Desktop shortcuts" className="gui-v2-shortcuts">
            {shortcutIds.map((appId) => {
                const app = appCatalog[appId];
                return (
                    <button
                        key={appId}
                        type="button"
                        disabled={navigationBusy}
                        onClick={() =>
                            navigate(createOpenAppCommand(appId))
                        }
                        className="gui-v2-shortcut"
                    >
                        <Image
                            src={app.icon}
                            alt=""
                            width={48}
                            height={48}
                            className="h-12 w-12 object-contain"
                        />
                        <span>{app.titles[language]}</span>
                    </button>
                );
            })}
        </nav>
    );
}
