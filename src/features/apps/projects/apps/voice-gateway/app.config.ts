import { defineFileNode } from "@/features/gui/directory/directoryTypes";
import { defineAppConfig } from "@/features/gui/registry/defineAppConfig";
import { publicAssetPath } from "@/features/gui/registry/appTypes";

export const voiceGatewayAppConfig = defineAppConfig({
  appId: "project:voice-gateway",
  url: { app: "project", slug: "voice-gateway" },
  titleKey: "appNames.voice-gateway",
  icon: publicAssetPath("/icons/optimized/document.png"),
  order: 104,
  window: { width: 960, height: 720 },
});

export const voiceGatewayNode = defineFileNode({
  kind: "file",
  nodeId: "desktop:project:voice-gateway",
  appId: voiceGatewayAppConfig.appId,
  appearance: "document",
});
