import Image from "next/image";
import type { DesktopNode } from "@/features/gui/directory/directoryTypes";
import { appMetadata } from "@/features/gui/registry/appMetadata";
import { publicAssetPath } from "@/features/gui/registry/appTypes";

const documentIcon = publicAssetPath("/icons/document.png");

export function DirectoryItemIcon({ node }: { node: DesktopNode }) {
  const source =
    node.appearance === "document" && node.appId.startsWith("project:")
      ? documentIcon
      : appMetadata[node.appId].icon;

  return (
    <span className="directory-item-icon" aria-hidden="true">
      <Image
        src={source}
        alt=""
        width={54}
        height={54}
        className="directory-item-icon-image"
        loading={node.appId === "projects" ? "eager" : "lazy"}
      />
    </span>
  );
}
