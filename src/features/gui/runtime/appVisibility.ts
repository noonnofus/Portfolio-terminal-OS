export type WindowVisibility =
    | "active"
    | "inactive"
    | "minimized";

export type PageVisibility = "visible" | "hidden";

export type EffectiveVisibility =
    | WindowVisibility
    | "page-suspended";

export function deriveVisibility(
    windowVisibility: WindowVisibility,
    pageVisibility: PageVisibility,
): EffectiveVisibility {
    return pageVisibility === "hidden"
        ? "page-suspended"
        : windowVisibility;
}
