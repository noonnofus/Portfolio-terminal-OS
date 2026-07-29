import { defineAppConfig } from "@/features/gui/registry/defineAppConfig";
import { publicAssetPath } from "@/features/gui/registry/appTypes";

export const settingsAppConfig = defineAppConfig({
  appId: "settings",
  url: { app: "settings" },
  titleKey: "appNames.settings",
  icon: publicAssetPath("/icons/optimized/settings.png"),
  order: 60,
  dock: { visible: true, order: 60 },
  window: { width: 740, height: 610 },
});
