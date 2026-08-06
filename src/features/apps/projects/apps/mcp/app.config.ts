import { defineFileNode } from "@/features/gui/directory/directoryTypes";
import { defineAppConfig } from "@/features/gui/registry/defineAppConfig";
import { publicAssetPath } from "@/features/gui/registry/appTypes";

export const mcpAppConfig = defineAppConfig({
  appId: "project:mcp",
  url: { app: "project", slug: "mcp" },
  titleKey: "appNames.mcp",
  icon: publicAssetPath("/icons/optimized/document.png"),
  order: 103,
  window: { width: 960, height: 720 },
});

export const mcpNode = defineFileNode({
  kind: "file",
  nodeId: "desktop:project:mcp",
  appId: mcpAppConfig.appId,
  appearance: "document",
});
