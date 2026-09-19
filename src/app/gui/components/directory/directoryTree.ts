import { appCatalog } from "@/app/gui/config/appCatalog";
import {
  defineFileNode,
  defineFolderNode,
} from "@/app/gui/components/directory/directoryTypes";
import type {
  DesktopFolderNode,
  DesktopNode,
} from "@/app/gui/components/directory/directoryTypes";
import type { FolderAppId } from "@/app/gui/types/appTypes";

const notesNode = defineFileNode({
  kind: "file",
  nodeId: "desktop:notes",
  appId: appCatalog.notes.appId,
  appearance: "document",
});

export const projectsDirectory = defineFolderNode({
  kind: "folder",
  nodeId: "desktop:folder:projects",
  appId: appCatalog.projects.appId,
  appearance: "folder",
  children: [
    defineFileNode({
      kind: "file",
      nodeId: "desktop:project:kepco",
      appId: appCatalog["project:kepco"].appId,
      appearance: "document",
    }),
    defineFileNode({
      kind: "file",
      nodeId: "desktop:project:optigen",
      appId: appCatalog["project:optigen"].appId,
      appearance: "document",
    }),
    defineFileNode({
      kind: "file",
      nodeId: "desktop:project:portfolio",
      appId: appCatalog["project:portfolio"].appId,
      appearance: "document",
    }),
    defineFileNode({
      kind: "file",
      nodeId: "desktop:project:mcp",
      appId: appCatalog["project:mcp"].appId,
      appearance: "document",
    }),
    defineFileNode({
      kind: "file",
      nodeId: "desktop:project:voice-gateway",
      appId: appCatalog["project:voice-gateway"].appId,
      appearance: "document",
    }),
    defineFileNode({
      kind: "file",
      nodeId: "desktop:project:wchms",
      appId: appCatalog["project:wchms"].appId,
      appearance: "document",
    }),
    defineFileNode({
      kind: "file",
      nodeId: "desktop:project:flare",
      appId: appCatalog["project:flare"].appId,
      appearance: "document",
    }),
  ],
});

export const desktopDirectory: DesktopFolderNode = {
  kind: "folder",
  nodeId: "desktop:root",
  appId: appCatalog.projects.appId,
  appearance: "folder",
  children: [
    projectsDirectory,
    defineFileNode({
      kind: "file",
      nodeId: "desktop:resume",
      appId: "resume",
      appearance: "document",
    }),
    notesNode,
  ],
};

function findDirectory(
  nodes: readonly DesktopNode[],
  appId: FolderAppId,
): DesktopFolderNode | null {
  for (const node of nodes) {
    if (node.kind !== "folder") continue;
    const children = node.children;
    if (node.appId === appId) return node;
    const nested = findDirectory(children, appId);
    if (nested !== null) return nested;
  }
  return null;
}

export function findDirectoryByAppId(
  appId: FolderAppId,
): DesktopFolderNode | null {
  return findDirectory(desktopDirectory.children, appId);
}

export function collectFolderAppIds(
  nodes: readonly DesktopNode[] = desktopDirectory.children,
): FolderAppId[] {
  return nodes.flatMap((node) =>
    node.kind === "folder"
      ? [node.appId, ...collectFolderAppIds(node.children)]
      : [],
  );
}
