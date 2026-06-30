import type { ComponentProps } from "react";
import type {
    GuiAppLoaderMap,
    OpenAppCommand,
} from "@/features/gui-v2/apps/appTypes";

const validAboutCommand = {
    type: "open-app",
    appId: "about",
    params: {},
} satisfies OpenAppCommand;

const validProjectCommand = {
    type: "open-app",
    appId: "project:wchms",
    params: { slug: "wchms" },
} satisfies OpenAppCommand;

const invalidAboutCommand: OpenAppCommand = {
    type: "open-app",
    appId: "about",
    // @ts-expect-error About does not accept project params.
    params: { slug: "wchms" },
};

// @ts-expect-error Project IDs and slug params must remain correlated.
const invalidProjectCommand: OpenAppCommand = {
    type: "open-app",
    appId: "project:wchms",
    params: { slug: "flare" },
};

type WchmsProps = ComponentProps<GuiAppLoaderMap["project:wchms"]>;

const validWchmsProps = {
    slug: "wchms",
    language: "ko",
} satisfies WchmsProps;

void validAboutCommand;
void validProjectCommand;
void invalidAboutCommand;
void invalidProjectCommand;
void validWchmsProps;
