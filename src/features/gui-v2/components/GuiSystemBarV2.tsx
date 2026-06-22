"use client";

import { useGuiNavigation } from "@/features/gui-v2/navigation/GuiNavigationProvider";
import { useGuiV2Store } from "@/features/gui-v2/store/GuiV2StoreProvider";

export function GuiSystemBarV2() {
    const language = useGuiV2Store((state) => state.language);
    const { navigate, navigationBusy } = useGuiNavigation();

    return (
        <header className="gui-v2-system-bar">
            <strong>Hyunho Kim</strong>
            <nav aria-label="System controls" className="flex items-center gap-1">
                {(["ko", "en"] as const).map((option) => (
                    <button
                        key={option}
                        type="button"
                        aria-pressed={language === option}
                        disabled={navigationBusy}
                        onClick={() =>
                            navigate({
                                type: "change-language",
                                language: option,
                            })
                        }
                        className="rounded px-2 py-1 text-xs uppercase aria-pressed:bg-black aria-pressed:text-white"
                    >
                        {option}
                    </button>
                ))}
            </nav>
        </header>
    );
}
