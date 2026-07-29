import { defineAppConfig } from "@/features/gui/registry/defineAppConfig";
import { publicAssetPath } from "@/features/gui/registry/appTypes";

export const aboutAppConfig = defineAppConfig({
  appId: "about",
  url: { app: "about" },
  titleKey: "appNames.about",
  icon: publicAssetPath("/icons/optimized/about.png"),
  order: 10,
  dock: { visible: true, order: 10 },
  window: { width: 820, height: 640 },
});
