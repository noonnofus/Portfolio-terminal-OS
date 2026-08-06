import { defineAppConfig } from "@/features/gui/registry/defineAppConfig";
import { publicAssetPath } from "@/features/gui/registry/appTypes";
import { defineFolderNode } from "@/features/gui/directory/directoryTypes";
import { flareNode } from "./apps/flare/app.config";
import { kepcoNode } from "./apps/kepco/app.config";
import { mcpNode } from "./apps/mcp/app.config";
import { optigenNode } from "./apps/optigen/app.config";
import { voiceGatewayNode } from "./apps/voice-gateway/app.config";
import { portfolioNode } from "./apps/portfolio/app.config";
import { wchmsNode } from "./apps/wchms/app.config";

export const projectsAppConfig = defineAppConfig({
  appId: "projects",
  url: { app: "projects" },
  titleKey: "appNames.projects",
  icon: publicAssetPath("/icons/optimized/folder.png"),
  order: 20,
  dock: { visible: true, order: 20 },
  window: { width: 700, height: 450 },
});

export const projectsNode = defineFolderNode({
  kind: "folder",
  nodeId: "desktop:folder:projects",
  appId: projectsAppConfig.appId,
  appearance: "folder",
  children: [
    kepcoNode,
    optigenNode,
    portfolioNode,
    mcpNode,
    voiceGatewayNode,
    wchmsNode,
    flareNode,
  ],
});
