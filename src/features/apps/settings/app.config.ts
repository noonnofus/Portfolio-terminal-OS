import { defineAppConfig } from "@/features/gui/registry/defineAppConfig";
import { publicAssetPath } from "@/features/gui/registry/appTypes";

export const settingsAppConfig = defineAppConfig({
  appId: "settings",
  url: { app: "settings" },
  titles: { ko: "설정", en: "Settings" },
  icon: publicAssetPath("/icons/settings.png"),
  order: 60,
  window: { width: 740, height: 610 },
});
