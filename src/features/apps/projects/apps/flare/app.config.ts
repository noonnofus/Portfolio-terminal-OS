import { defineAppConfig } from "@/features/gui/registry/defineAppConfig";
import { publicAssetPath } from "@/features/gui/registry/appTypes";
import { defineFileNode } from "@/features/gui/directory/directoryTypes";

export const flareAppConfig = defineAppConfig({
  appId: "project:flare",
  url: { app: "project", slug: "flare" },
  titles: { ko: "Flare", en: "Flare" },
  icon: publicAssetPath("/icons/flare.png"),
  order: 120,
  window: { width: 840, height: 640 },
});

export const flareNode = defineFileNode({
  kind: "file",
  nodeId: "desktop:project:flare",
  appId: flareAppConfig.appId,
  appearance: "document",
});
