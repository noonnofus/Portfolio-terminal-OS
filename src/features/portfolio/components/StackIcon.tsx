"use client";

import type { LucideIcon } from "lucide-react";
import Image from "next/image";


type LucideStackIconProps = {
  label: string;
  icon: LucideIcon;
  color?: string;
  src?: never;
  darkSrc?: never;
  invertOnDark?: never;
};

type BrandStackIconProps = {
  label: string;
  src: string;
  darkSrc?: string;
  invertOnDark?: boolean;
  icon?: never;
  color?: never;
};

type StackIconProps = LucideStackIconProps | BrandStackIconProps;

function isBrandStackIcon(
  props: StackIconProps,
): props is BrandStackIconProps {
  return typeof props.src === "string";
}

function StackIconLabel({ label }: { label: string }) {
  return (
    <p className="text-[length:var(--application-text-control)] leading-tight text-[var(--application-app-surface-text)]">
      {label}
    </p>
  );
}

export default function StackIcon(props: StackIconProps) {
  if (isBrandStackIcon(props)) return <BrandStackIcon {...props} />;

  return <LucideStackIcon {...props} />;
}

function BrandStackIcon({
  label,
  src,
  darkSrc,
  invertOnDark = false,
}: BrandStackIconProps) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-2 text-center">
      <Image
        aria-hidden="true"
        alt=""
        className={`size-8 shrink-0 object-contain${darkSrc ? " ui-theme-image-light" : ""}${invertOnDark ? " ui-theme-invert" : ""}`}
        draggable={false}
        height={32}
        sizes="32px"
        src={src}
        width={32}
      />
      {darkSrc && <Image
        aria-hidden="true"
        alt=""
        className="size-8 shrink-0 object-contain ui-theme-image-dark"
        draggable={false}
        height={32}
        sizes="32px"
        src={darkSrc}
        width={32}
      />}
      <StackIconLabel label={label} />
    </div>
  );
}

function LucideStackIcon({
  label,
  icon: Icon,
  color,
}: LucideStackIconProps) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-2 text-center">
      <Icon
        aria-hidden="true"
        className="size-8 shrink-0"
        color={color}
        strokeWidth={2}
      />
      <StackIconLabel label={label} />
    </div>
  );
}
