import type { DesktopAppId } from "@/app/desktop/types/appTypes";
import { appCatalog } from "@/app/desktop/config/appCatalog";

export const dockAppIds = Object.values(appCatalog)
  .flatMap((app) =>
    app.dock?.visible === true ? [{ appId: app.appId, order: app.dock.order }] : [],
  )
  .toSorted((left, right) => left.order - right.order)
  .map((app) => app.appId) satisfies readonly DesktopAppId[];
