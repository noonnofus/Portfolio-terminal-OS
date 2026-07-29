import { defineAppConfig } from "@/features/gui/registry/defineAppConfig";
import { publicAssetPath } from "@/features/gui/registry/appTypes";

export const contactAppConfig = defineAppConfig({
  appId: "contact",
  url: { app: "contact" },
  titleKey: "appNames.contact",
  icon: publicAssetPath("/icons/optimized/contact.png"),
  order: 50,
  dock: { visible: true, order: 50 },
  window: { width: 600, height: 370 },
});
