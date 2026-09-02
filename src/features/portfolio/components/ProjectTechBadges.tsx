"use client";

/* eslint-disable @next/next/no-img-element -- local technology SVGs preserve their brand fills */

import { Brain, Cpu, Network, Radio, Server, type LucideIcon } from "lucide-react";
import styles from "./ProjectContent.module.css";
import { useColorMode } from "@/components/providers/color-mode";

type ProjectTechBadgesProps = {
  label: string;
  items: readonly string[];
};

const technologyIcons: Record<
  string,
  { src: string; darkSrc?: string; invertOnDark?: boolean }
> = {
  "Next.js": {
    src: "/tech-icons/nextjs.svg",
    invertOnDark: true,
  },
  "React 19": {
    src: "/tech-icons/react-light.svg",
    darkSrc: "/tech-icons/react-dark.svg",
  },
  "React Query": { src: "/tech-icons/tanstack-query.svg" },
  "TanStack Query": { src: "/tech-icons/tanstack-query.svg" },
  TypeScript: { src: "/tech-icons/typescript.svg" },
  Zod: { src: "/tech-icons/zod.svg" },
  "Tailwind CSS": { src: "/tech-icons/tailwindcss.svg" },
  Zustand: { src: "/tech-icons/zustand.svg" },
  PostgreSQL: { src: "/tech-icons/postgresql.svg" },
  MySQL: {
    src: "/tech-icons/mysql-light.svg",
    darkSrc: "/tech-icons/mysql-dark.svg",
  },
  OpenAI: {
    src: "/tech-icons/openai.svg",
    invertOnDark: true,
  },
  "Express.js": {
    src: "/tech-icons/express-light.svg",
    darkSrc: "/tech-icons/express-dark.svg",
  },
};

const technologyFallbackIcons: Record<string, LucideIcon> = {
  "MCP SDK": Network,
  "Node.js": Server,
  WebSocket: Radio,
  "Worker Threads": Cpu,
};

export function ProjectTechBadges({
  label,
  items,
}: ProjectTechBadgesProps) {
  const { resolvedColorMode } = useColorMode();

  return (
    <ul className={styles.techBadges} role="list" aria-label={label}>
      {items.map((item) => {
        const icon = technologyIcons[item];
        const FallbackIcon = technologyFallbackIcons[item] ?? Brain;
        const src =
          resolvedColorMode === "dark" ? (icon?.darkSrc ?? icon?.src) : icon?.src;

        return (
          <li key={item} className={styles.techBadge}>
            {src ? (
              <img
                aria-hidden="true"
                alt=""
                className={`${styles.techBadgeIcon}${
                  icon?.invertOnDark && resolvedColorMode === "dark"
                    ? " invert"
                    : ""
                }`}
                draggable={false}
                height={16}
                src={src}
                width={16}
              />
            ) : (
              <FallbackIcon
                aria-hidden="true"
                className={styles.techBadgeIcon}
                strokeWidth={2}
              />
            )}
            {item}
          </li>
        );
      })}
    </ul>
  );
}
