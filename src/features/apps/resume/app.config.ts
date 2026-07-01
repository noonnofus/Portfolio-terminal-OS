import { defineAppConfig } from "@/features/gui/registry/defineAppConfig";
import { publicAssetPath } from "@/features/gui/registry/appTypes";

export const resumeAppConfig = defineAppConfig({
  appId: "resume",
  url: { app: "resume" },
  titles: { ko: "이력서", en: "Resume" },
  icon: publicAssetPath("/icons/pdf_file.png"),
  order: 30,
  window: { width: 850, height: 680 },
});
