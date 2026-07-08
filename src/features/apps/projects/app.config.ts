import { defineAppConfig } from "@/features/gui/registry/defineAppConfig";
import { publicAssetPath } from "@/features/gui/registry/appTypes";
import { defineFolderNode } from "@/features/gui/directory/directoryTypes";
import { diceRollerNode } from "./apps/diceroller/app.config";
import { flareNode } from "./apps/flare/app.config";
import { mejuBotNode } from "./apps/mejubot/app.config";
import { pageSsenceNode } from "./apps/pagessence/app.config";
import { wchmsNode } from "./apps/wchms/app.config";
import { webPianoNode } from "./apps/webpiano/app.config";
import { weConnectNode } from "./apps/weconnect/app.config";

export const projectsAppConfig = defineAppConfig({
  appId: "projects",
  url: { app: "projects" },
  titles: { ko: "프로젝트", en: "Projects" },
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
    wchmsNode,
    flareNode,
    weConnectNode,
    pageSsenceNode,
    diceRollerNode,
    mejuBotNode,
    webPianoNode,
  ],
});
