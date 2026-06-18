"use client";

import { X } from "lucide-react";
import type { SVGProps } from "react";
import { useDesktopStore } from "@/features/Desktop/store/useDesktopStore";

function MacMaximizeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 85.4 85.4" fill="none" aria-hidden="true" {...props}>
      <path
        d="M31.2 20.8h26.7c3.6 0 6.5 2.9 6.5 6.5v26.7z"
        fill="currentColor"
      />
      <path
        d="M54.4 64.5H27.6c-3.6 0-6.5-2.9-6.5-6.5V31.2z"
        fill="currentColor"
      />
    </svg>
  );
}

function MacMinimizeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 85.4 85.4" fill="none" aria-hidden="true" {...props}>
      <path
        d="M17.8 39.1h49.9c1.9 0 3.5 1.6 3.5 3.5v.1c0 1.9-1.6 3.5-3.5 3.5H17.8c-1.9 0-3.5-1.6-3.5-3.5v-.1c0-1.9 1.5-3.5 3.5-3.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function AppDesktopHeader({
  appName,
  title,
  isFullScreen,
  setIsFullScreen,
}: {
  appName: string;
  title: string;
  isFullScreen: boolean;
  setIsFullScreen: (val: boolean) => void;
}) {
  const closeApp = useDesktopStore((state) => state.closeApp);

  return (
    <div className="relative w-full overflow-hidden">
      <div className="grid grid-cols-[2rem_minmax(0,1fr)_2rem] items-center gap-3 bg-window-header-surface px-4 py-2 text-window-foreground">
        <div className="flex w-8 shrink-0 items-center justify-start">
          <button
            type="button"
            onClick={() => {
              closeApp(appName);
            }}
            className="group shrink-0 flex h-[0.8rem] w-[0.8rem] items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--color-mac-close)_80%,black)] bg-mac-close focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-window-foreground hover:cursor-pointer"
            aria-label={`Close ${title}`}
          >
            <X className="h-3 w-3 text-[color-mix(in_srgb,var(--color-mac-close)_60%,black)] opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" />
          </button>
          <button
            type="button"
            className="group ml-2 shrink-0 flex h-[0.8rem] w-[0.8rem] items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--color-mac-maximize)_80%,black)] bg-mac-maximize focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-window-foreground hover:cursor-pointer"
            onClick={() => setIsFullScreen(!isFullScreen)}
            aria-label={
              isFullScreen
                ? `Exit fullscreen for ${title}`
                : `Enter fullscreen for ${title}`
            }
          >
            {isFullScreen ? (
              <MacMinimizeIcon className="h-[0.8rem] w-[0.8rem] text-[color-mix(in_srgb,var(--color-mac-maximize)_60%,black)] opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" />
            ) : (
              <MacMaximizeIcon className="h-[0.8rem] w-[0.8rem] text-[color-mix(in_srgb,var(--color-mac-maximize)_60%,black)] opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" />
            )}
          </button>
        </div>
        <div className="min-w-0 truncate text-center font-medium text-window-foreground">
          {title}
        </div>
        <div className="w-8 shrink-0" />
      </div>
    </div>
  );
}
