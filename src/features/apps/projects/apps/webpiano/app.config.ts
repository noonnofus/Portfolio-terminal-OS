import { defineAppConfig } from "@/features/gui/registry/defineAppConfig";
import { publicAssetPath } from "@/features/gui/registry/appTypes";
import { defineFileNode } from "@/features/gui/directory/directoryTypes";

export const webPianoAppConfig = defineAppConfig({
  appId: "project:webpiano",
  url: { app: "project", slug: "webpiano" },
  titles: { ko: "웹 피아노", en: "WebPiano" },
  icon: publicAssetPath("/icons/webpiano.png"),
  order: 170,
  window: { width: 840, height: 640 },
});

export const webPianoNode = defineFileNode({
  kind: "file",
  nodeId: "desktop:project:webpiano",
  appId: webPianoAppConfig.appId,
  appearance: "document",
});
