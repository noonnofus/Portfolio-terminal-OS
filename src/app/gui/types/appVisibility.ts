export type WindowVisibility =
    | "active"
    | "inactive"
    | "minimized";

export type PageVisibility = "visible" | "hidden";

export type EffectiveVisibility =
    | WindowVisibility
    | "page-suspended";
