import { defineFileNode } from "@/features/gui/directory/directoryTypes";
import { defineAppConfig } from "@/features/gui/registry/defineAppConfig";
import { publicAssetPath } from "@/features/gui/registry/appTypes";

export const optigenAppConfig = defineAppConfig({
    appId: "project:optigen",
    url: { app: "project", slug: "optigen" },
    titleKey: "appNames.optigen",
    icon: publicAssetPath("/icons/optimized/document.png"),
    order: 102,
    window: { width: 960, height: 720 },
});

export const optigenNode = defineFileNode({
    kind: "file",
    nodeId: "desktop:project:optigen",
    appId: optigenAppConfig.appId,
    appearance: "document",
});
