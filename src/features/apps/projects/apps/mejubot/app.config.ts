import { defineAppConfig } from "@/features/gui/registry/defineAppConfig";
import { publicAssetPath } from "@/features/gui/registry/appTypes";
import { defineFileNode } from "@/features/gui/directory/directoryTypes";

export const mejuBotAppConfig = defineAppConfig({
  appId: "project:mejubot",
  url: { app: "project", slug: "mejubot" },
  titles: { ko: "디스코드 봇", en: "Discord Bot" },
  icon: publicAssetPath("/icons/optimized/mejubot.png"),
  order: 160,
  window: { width: 840, height: 640 },
});

export const mejuBotNode = defineFileNode({
  kind: "file",
  nodeId: "desktop:project:mejubot",
  appId: mejuBotAppConfig.appId,
  appearance: "document",
});
