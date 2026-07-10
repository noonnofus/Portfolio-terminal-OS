import { defineAppConfig } from "@/features/gui/registry/defineAppConfig";
import { defineFileNode } from "@/features/gui/directory/directoryTypes";
import { publicAssetPath } from "@/features/gui/registry/appTypes";

export const notesAppConfig = defineAppConfig({
  appId: "notes",
  url: { app: "notes" },
  titles: { ko: "방명록", en: "Guestbook" },
  icon: publicAssetPath("/icons/optimized/note.png"),
  order: 55,
  dock: { visible: true, order: 55 },
  window: { width: 640, height: 560 },
});

export const notesNode = defineFileNode({
  kind: "file",
  nodeId: "desktop:notes",
  appId: notesAppConfig.appId,
  appearance: "document",
});
