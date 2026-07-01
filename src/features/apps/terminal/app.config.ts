import { defineAppConfig } from "@/features/gui/registry/defineAppConfig";
import { publicAssetPath } from "@/features/gui/registry/appTypes";

export const terminalAppConfig = defineAppConfig({
  appId: "terminal",
  url: { app: "terminal" },
  titles: { ko: "터미널", en: "Terminal" },
  icon: publicAssetPath("/icons/iterm2.png"),
  order: 40,
  window: { width: 800, height: 530 },
});
