import { defineAppConfig } from "@/features/gui/registry/defineAppConfig";
import { publicAssetPath } from "@/features/gui/registry/appTypes";
import { defineFileNode } from "@/features/gui/directory/directoryTypes";

export const weConnectAppConfig = defineAppConfig({
  appId: "project:weconnect",
  url: { app: "project", slug: "weconnect" },
  titles: { ko: "WeConnect", en: "WeConnect" },
  icon: publicAssetPath("/icons/weconnect.svg"),
  order: 130,
  window: { width: 840, height: 640 },
});

export const weConnectNode = defineFileNode({
  kind: "file",
  nodeId: "desktop:project:weconnect",
  appId: weConnectAppConfig.appId,
  appearance: "document",
});
