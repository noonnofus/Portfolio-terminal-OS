import type { GuiAppId } from "@/features/gui/registry/appTypes";
import { appMetadata } from "@/features/gui/registry/appMetadata";

export const dockAppIds = Object.values(appMetadata)
  .flatMap((app) =>
    app.dock?.visible === true ? [{ appId: app.appId, order: app.dock.order }] : [],
  )
  .toSorted((left, right) => left.order - right.order)
  .map((app) => app.appId) satisfies readonly GuiAppId[];
