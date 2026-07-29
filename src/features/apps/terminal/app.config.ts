import { defineAppConfig } from "@/features/gui/registry/defineAppConfig";
import { publicAssetPath } from "@/features/gui/registry/appTypes";

export const terminalAppConfig = defineAppConfig({
  appId: "terminal",
  url: { app: "terminal" },
  titleKey: "appNames.terminal",
  icon: publicAssetPath("/icons/optimized/iterm2.png"),
  order: 40,
  dock: { visible: true, order: 40 },
  window: { width: 800, height: 530 },
});
