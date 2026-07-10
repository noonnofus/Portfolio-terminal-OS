"use client";

import Image from "next/image";
import { appMetadata } from "@/features/gui/registry/appMetadata";
import {
  isProjectAppId,
  type GuiAppId,
} from "@/features/gui/registry/appTypes";

type CoreAppId = Exclude<GuiAppId, `project:${string}`>;

const coreIcons: Record<CoreAppId, (size: number) => React.ReactNode> = {
  about: (s) => (
    <Image
      src="/icons/optimized/about.png"
      alt="나에 대해서"
      width={s}
      height={s}
      className="w-full h-full object-contain"
      unoptimized
    />
  ),
  projects: (s) => (
    <Image
      src="/icons/optimized/folder.png"
      alt="프로젝트_폴더"
      width={s}
      height={s}
      className="w-full h-full object-contain"
      loading="eager"
      unoptimized
    />
  ),
  resume: (s) => (
    <Image
      src="/icons/optimized/pdf_file.png"
      alt="이력서"
      width={s}
      height={s}
      className="w-full h-full object-contain"
      unoptimized
    />
  ),
  terminal: (s) => (
    <Image
      src="/icons/optimized/iterm2.png"
      alt="터미널"
      width={s}
      height={s}
      className="w-full h-full object-contain"
      unoptimized
    />
  ),
  contact: (s) => (
    <Image
      src="/icons/optimized/contact.png"
      alt="연락처"
      width={s}
      height={s}
      className="w-full h-full object-contain"
      unoptimized
    />
  ),
  notes: (s) => (
    <Image
      src="/icons/optimized/note.png"
      alt="노트"
      width={s}
      height={s}
      className="w-full h-full object-contain"
      unoptimized
    />
  ),
  settings: (s) => (
    <Image
      src="/icons/optimized/settings.png"
      alt="세팅"
      width={s}
      height={s}
      className="w-full h-full object-contain"
      unoptimized
    />
  ),
};

export function GuiAppIcon({
  appId,
  size = "dock",
}: {
  appId: GuiAppId;
  size?: "dock" | "desktop" | "project";
}) {
  const iconSize = size === "desktop" ? 30 : size === "project" ? 38 : 24;

  if (isProjectAppId(appId)) {
    return (
      <span
        className="gui-app-icon"
        data-app-icon={appId}
        data-size={size}
        aria-hidden="true"
      >
        <Image
          src={appMetadata[appId].icon}
          alt=""
          width={iconSize}
          height={iconSize}
          className="gui-app-icon-image"
          unoptimized
        />
      </span>
    );
  }

  return (
    <span
      className="gui-app-icon"
      data-app-icon={appId}
      data-size={size}
      aria-hidden="true"
    >
      {coreIcons[appId](iconSize)}
    </span>
  );
}
