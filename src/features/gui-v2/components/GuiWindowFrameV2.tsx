"use client";

import { appCatalog } from "@/features/gui-v2/apps/appCatalog";
import {
    createOpenAppCommand,
    type GuiAppId,
} from "@/features/gui-v2/apps/appTypes";
import { GuiAppRenderer } from "@/features/gui-v2/components/GuiAppRenderer";
import { useGuiNavigation } from "@/features/gui-v2/navigation/GuiNavigationProvider";
import type { GuiWindowSnapshot } from "@/features/gui-v2/navigation/navigationTypes";
import { useGuiV2Store } from "@/features/gui-v2/store/GuiV2StoreProvider";
import { AppRuntimeBoundary } from "@/features/gui-v2/runtime/AppRuntimeContext";

export function GuiWindowFrameV2({
    window,
    active,
    workspaceDesktop,
    index,
}: {
    window: GuiWindowSnapshot;
    active: boolean;
    workspaceDesktop: boolean;
    index: number;
}) {
    const language = useGuiV2Store((state) => state.language);
    const { navigate, navigationBusy } = useGuiNavigation();
    const appId: GuiAppId = window.appId;
    const title = appCatalog[appId].titles[language];
    const headingId = `gui-v2-window-${appId.replace(":", "-")}`;
    const windowVisibility = window.minimized
        ? "minimized"
        : active
          ? "active"
          : "inactive";

    return (
        <section
            role="dialog"
            aria-labelledby={headingId}
            className="gui-v2-window"
            data-active={active}
            data-window-id={appId}
            data-window-visibility={windowVisibility}
            hidden={window.minimized || workspaceDesktop}
            style={{
                left: `${64 + index * 44}px`,
                top: `${68 + index * 36}px`,
                zIndex: active ? 40 : 10 + index,
            }}
        >
            <div
                className="gui-v2-title-bar"
                onPointerDown={() =>
                    !active && navigate(createOpenAppCommand(appId))
                }
            >
                <h2 id={headingId} tabIndex={-1} className="font-medium">
                    {title}
                </h2>
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        aria-label={`${title} minimize`}
                        disabled={navigationBusy}
                        onClick={() =>
                            navigate({
                                type: "minimize-window",
                                windowId: appId,
                            })
                        }
                        className="gui-v2-window-control"
                    >
                        −
                    </button>
                    <button
                        type="button"
                        aria-label={`${title} close`}
                        disabled={navigationBusy}
                        onClick={() =>
                            navigate({
                                type: "close-window",
                                windowId: appId,
                            })
                        }
                        className="gui-v2-window-control"
                    >
                        ×
                    </button>
                </div>
            </div>
            <div
                className="gui-v2-window-content"
                inert={!active ? true : undefined}
            >
                <AppRuntimeBoundary
                    windowVisibility={windowVisibility}
                >
                    <GuiAppRenderer
                        appId={appId}
                        language={language}
                    />
                </AppRuntimeBoundary>
            </div>
        </section>
    );
}
