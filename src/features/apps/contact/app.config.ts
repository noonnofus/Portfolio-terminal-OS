import { defineAppConfig } from "@/features/gui/registry/defineAppConfig";
import { publicAssetPath } from "@/features/gui/registry/appTypes";

export const contactAppConfig = defineAppConfig({
  appId: "contact",
  url: { app: "contact" },
  titles: { ko: "연락처", en: "Contact" },
  icon: publicAssetPath("/icons/contact.png"),
  order: 50,
  window: { width: 600, height: 370 },
});
