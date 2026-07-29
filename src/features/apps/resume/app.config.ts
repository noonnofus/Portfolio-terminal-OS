import { defineAppConfig } from "@/features/gui/registry/defineAppConfig";
import { publicAssetPath } from "@/features/gui/registry/appTypes";

export const resumeAppConfig = defineAppConfig({
  appId: "resume",
  url: { app: "resume" },
  titleKey: "appNames.resume",
  icon: publicAssetPath("/icons/optimized/pdf_file.png"),
  order: 30,
  dock: { visible: true, order: 30 },
  window: { width: 850, height: 680 },
});
