import { defineAppConfig } from "@/features/gui/registry/defineAppConfig";
import { publicAssetPath } from "@/features/gui/registry/appTypes";
import { defineFileNode } from "@/features/gui/directory/directoryTypes";

export const diceRollerAppConfig = defineAppConfig({
  appId: "project:diceroller",
  url: { app: "project", slug: "diceroller" },
  titles: { ko: "다이스롤러", en: "DiceRoller" },
  icon: publicAssetPath("/icons/diceroller.png"),
  order: 150,
  window: { width: 840, height: 640 },
});

export const diceRollerNode = defineFileNode({
  kind: "file",
  nodeId: "desktop:project:diceroller",
  appId: diceRollerAppConfig.appId,
  appearance: "document",
});
