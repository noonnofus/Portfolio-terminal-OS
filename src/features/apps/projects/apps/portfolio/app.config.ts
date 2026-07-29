import { defineFileNode } from "@/features/gui/directory/directoryTypes";
import { defineAppConfig } from "@/features/gui/registry/defineAppConfig";
import { publicAssetPath } from "@/features/gui/registry/appTypes";

export const portfolioAppConfig = defineAppConfig({
  appId: "project:portfolio",
  url: { app: "project", slug: "portfolio" },
  titleKey: "appNames.portfolio",
  icon: publicAssetPath("/icons/optimized/document.png"),
  order: 100,
  window: { width: 920, height: 700 },
});

export const portfolioNode = defineFileNode({
  kind: "file",
  nodeId: "desktop:project:portfolio",
  appId: portfolioAppConfig.appId,
  appearance: "document",
});
