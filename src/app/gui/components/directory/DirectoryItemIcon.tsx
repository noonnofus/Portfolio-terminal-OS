import Image from "next/image";
import type { DesktopNode } from "@/app/gui/components/directory/directoryTypes";
import { appCatalog } from "@/app/gui/config/appCatalog";
import { publicAssetPath } from "@/app/gui/types/appTypes";

const documentIcon = publicAssetPath("/icons/optimized/document.png");

export function DirectoryItemIcon({ node }: { node: DesktopNode }) {
  const source =
    node.appearance === "document" && node.appId.startsWith("project:")
      ? documentIcon
      : appCatalog[node.appId].icon;

  return (
    <span className="directory-item-icon" aria-hidden="true">
      <Image
        src={source}
        alt=""
        width={54}
        height={54}
        className="directory-item-icon-image"
        loading={node.appId === "projects" ? "eager" : "lazy"}
        unoptimized
      />
    </span>
  );
}
