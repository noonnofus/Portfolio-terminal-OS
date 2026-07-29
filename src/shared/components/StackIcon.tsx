"use client";

/* eslint-disable @next/next/no-img-element -- local brand SVGs are already optimized and need their original fills and gradients */

import type { LucideIcon } from "lucide-react";

import { useColorMode } from "@/shared/ui/color-mode";

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
  const { resolvedColorMode } = useColorMode();
  const iconSrc = resolvedColorMode === "dark" ? (darkSrc ?? src) : src;
  const shouldInvert = invertOnDark && resolvedColorMode === "dark";

  return (
    <div className="flex min-w-0 flex-col items-center gap-2 text-center">
      <img
        aria-hidden="true"
        alt=""
        className={`size-8 shrink-0 object-contain${shouldInvert ? " invert" : ""}`}
        draggable={false}
        height={32}
        src={iconSrc}
        width={32}
      />
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
