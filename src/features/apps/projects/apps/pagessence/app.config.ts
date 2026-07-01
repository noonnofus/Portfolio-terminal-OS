import { defineAppConfig } from "@/features/gui/registry/defineAppConfig";
import { publicAssetPath } from "@/features/gui/registry/appTypes";
import { defineFileNode } from "@/features/gui/directory/directoryTypes";

export const pageSsenceAppConfig = defineAppConfig({
  appId: "project:pagessence",
  url: { app: "project", slug: "pagessence" },
  titles: { ko: "pageSsence", en: "PageSsence" },
  icon: publicAssetPath("/icons/pagessence.png"),
  order: 140,
  window: { width: 840, height: 640 },
});

export const pageSsenceNode = defineFileNode({
  kind: "file",
  nodeId: "desktop:project:pagessence",
  appId: pageSsenceAppConfig.appId,
  appearance: "document",
});
