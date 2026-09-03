"use client";

import { Brain, Cpu, Network, Radio, Server, type LucideIcon } from "lucide-react";
import Image from "next/image";
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
    src: "/tech-icons/nextjs.png",
    invertOnDark: true,
  },
  "React 19": {
    src: "/tech-icons/react-light.png",
    darkSrc: "/tech-icons/react-dark.png",
  },
  "React Query": { src: "/tech-icons/tanstack-query.png" },
  "TanStack Query": { src: "/tech-icons/tanstack-query.png" },
  TypeScript: { src: "/tech-icons/typescript.png" },
  Zod: { src: "/tech-icons/zod.png" },
  "Tailwind CSS": { src: "/tech-icons/tailwindcss.png" },
  Zustand: { src: "/tech-icons/zustand.png" },
  PostgreSQL: { src: "/tech-icons/postgresql.png" },
  MySQL: {
    src: "/tech-icons/mysql-light.png",
    darkSrc: "/tech-icons/mysql-dark.png",
  },
  OpenAI: {
    src: "/tech-icons/openai.png",
    invertOnDark: true,
  },
  "Express.js": {
    src: "/tech-icons/express-light.png",
    darkSrc: "/tech-icons/express-dark.png",
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
              <Image
                aria-hidden="true"
                alt=""
                className={`${styles.techBadgeIcon}${
                  icon?.invertOnDark && resolvedColorMode === "dark"
                    ? " invert"
                    : ""
                }`}
                draggable={false}
                height={16}
                sizes="16px"
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
