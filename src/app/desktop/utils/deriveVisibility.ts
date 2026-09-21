import type {
    EffectiveVisibility,
    PageVisibility,
    WindowVisibility,
} from "@/app/desktop/types/appVisibility";

export function deriveVisibility(
    windowVisibility: WindowVisibility,
    pageVisibility: PageVisibility,
): EffectiveVisibility {
    return pageVisibility === "hidden" ? "page-suspended" : windowVisibility;
}
