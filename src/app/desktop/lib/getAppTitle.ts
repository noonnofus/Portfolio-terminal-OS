import type { TFunction } from "i18next";
import type { DesktopAppCatalogEntry, DesktopAppId } from "@/app/desktop/types/appTypes";

export function getAppTitle<K extends DesktopAppId>(
  app: DesktopAppCatalogEntry<K>,
  t: TFunction,
): string {
  return t(app.titleKey);
}
