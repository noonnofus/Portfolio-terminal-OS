import type { ReactNode } from "react";

export interface AppDefinition {
    iconSrc: string;
    appName: string;
    title: string;
    render: () => ReactNode;
}
