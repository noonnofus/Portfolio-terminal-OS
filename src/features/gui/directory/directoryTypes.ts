import type {
  FolderAppId,
  GuiAppId,
  LeafAppId,
} from "@/features/gui/registry/appTypes";

export type DesktopNodeId = `desktop:${string}`;

export type DesktopFileNode<K extends LeafAppId = LeafAppId> = {
  kind: "file";
  nodeId: DesktopNodeId;
  appId: K;
  appearance: "application" | "document";
};

export type DesktopFolderNode<K extends FolderAppId = FolderAppId> = {
  kind: "folder";
  nodeId: DesktopNodeId;
  appId: K;
  appearance: "folder";
  children: readonly DesktopNode[];
};

export type DesktopNode = DesktopFileNode | DesktopFolderNode;

export function defineFileNode<K extends LeafAppId>(
  node: DesktopFileNode<K>,
): DesktopFileNode<K> {
  return node;
}

export function defineFolderNode<K extends FolderAppId>(
  node: DesktopFolderNode<K>,
): DesktopFolderNode<K> {
  return node;
}

export function isFolderNode(
  node: DesktopNode,
): node is DesktopFolderNode {
  return node.kind === "folder";
}

export function nodeAppId(node: DesktopNode): GuiAppId {
  return node.appId;
}
