import { defineAppConfig } from "@/features/gui/registry/defineAppConfig";
import { publicAssetPath } from "@/features/gui/registry/appTypes";

export const aboutAppConfig = defineAppConfig({
  appId: "about",
  url: { app: "about" },
  titles: { ko: "나에 대해서", en: "About" },
  icon: publicAssetPath("/icons/about.png"),
  order: 10,
  window: { width: 740, height: 640 },
});
