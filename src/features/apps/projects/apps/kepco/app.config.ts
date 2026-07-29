import { defineFileNode } from "@/features/gui/directory/directoryTypes";
import { defineAppConfig } from "@/features/gui/registry/defineAppConfig";
import { publicAssetPath } from "@/features/gui/registry/appTypes";

export const kepcoAppConfig = defineAppConfig({
  appId: "project:kepco",
  url: { app: "project", slug: "kepco" },
  titleKey: "appNames.kepco",
  icon: publicAssetPath("/icons/optimized/document.png"),
  order: 105,
  window: { width: 960, height: 720 },
});

export const kepcoNode = defineFileNode({
  kind: "file",
  nodeId: "desktop:project:kepco",
  appId: kepcoAppConfig.appId,
  appearance: "document",
});
