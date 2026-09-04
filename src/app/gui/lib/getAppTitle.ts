import type { TFunction } from "i18next";
import type { GuiAppCatalogEntry, GuiAppId } from "@/app/gui/types/appTypes";

export function getAppTitle<K extends GuiAppId>(
  app: GuiAppCatalogEntry<K>,
  t: TFunction,
): string {
  return t(app.titleKey);
}
