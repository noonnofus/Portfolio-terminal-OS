"use client";

import { DirectorySurface } from "@/app/desktop/components/directory/DirectorySurface";
import { desktopDirectory } from "@/app/desktop/components/directory/directoryTree";

export function DesktopShortcuts() {
  return (
    <DirectorySurface
      windowId="projects"
      directory={desktopDirectory}
      variant="desktop"
    />
  );
}
