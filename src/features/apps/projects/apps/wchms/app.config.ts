import { defineAppConfig } from "@/features/gui/registry/defineAppConfig";
import { publicAssetPath } from "@/features/gui/registry/appTypes";
import { defineFileNode } from "@/features/gui/directory/directoryTypes";

export const wchmsAppConfig = defineAppConfig({
  appId: "project:wchms",
  url: { app: "project", slug: "wchms" },
  titleKey: "appNames.wchms",
  icon: publicAssetPath("/icons/optimized/document.png"),
  order: 110,
  window: { width: 840, height: 640 },
});

export const wchmsNode = defineFileNode({
  kind: "file",
  nodeId: "desktop:project:wchms",
  appId: wchmsAppConfig.appId,
  appearance: "document",
});
