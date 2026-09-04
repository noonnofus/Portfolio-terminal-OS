"use client";

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
    src: "/tech-icons/nextjs-official.png",
    invertOnDark: true,
  },
  "Next.js 15": {
    src: "/tech-icons/nextjs-official.png",
    invertOnDark: true,
  },
  "Next.js 16": {
    src: "/tech-icons/nextjs-official.png",
    invertOnDark: true,
  },
  "React 19": {
    src: "/tech-icons/react-light.png",
    darkSrc: "/tech-icons/react-dark.png",
  },
  "React Query": { src: "/tech-icons/tanstack-query.png" },
  "TanStack Query": { src: "/tech-icons/tanstack-query.png" },
  TypeScript: { src: "/tech-icons/typescript.png" },
  Playwright: { src: "/tech-icons/playwright.png" },
  Vitest: { src: "/tech-icons/vitest.png" },
  Storybook: { src: "/tech-icons/storybook.png" },
  Zod: { src: "/tech-icons/zod.png" },
  "Tailwind CSS": { src: "/tech-icons/tailwindcss.png" },
  i18next: { src: "/tech-icons/i18next.png" },
  Supabase: { src: "/tech-icons/supabase.png" },
  Vercel: {
    src: "/tech-icons/vercel-light.png",
    darkSrc: "/tech-icons/vercel-dark.png",
  },
  "shadcn/ui": { src: "/tech-icons/shadcn-ui.png", invertOnDark: true },
  "Drizzle ORM": { src: "/tech-icons/drizzle.png" },
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
  "OpenAI API": {
    src: "/tech-icons/openai.png",
    invertOnDark: true,
  },
  "Express.js": {
    src: "/tech-icons/express-light.png",
    darkSrc: "/tech-icons/express-dark.png",
  },
  "Node.js": { src: "/tech-icons/nodejs.png" },
  "MCP SDK": { src: "/tech-icons/modelcontextprotocol.png" },
  FFmpeg: { src: "/tech-icons/ffmpeg.png" },
  Pino: { src: "/tech-icons/pino.png" },
  WebSocket: {
    src: "/tech-icons/websocket.png",
    invertOnDark: true,
  },
  Vite: { src: "/tech-icons/vite.png" },
  Axios: { src: "/tech-icons/axios.png" },
  "Google Maps": { src: "/tech-icons/googlemaps.png" },
  "Firebase Cloud Messaging": { src: "/tech-icons/firebase.png" },
  PWA: {
    src: "/tech-icons/pwa-light.png",
    darkSrc: "/tech-icons/pwa-dark.png",
  },
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
            ) : null}
            {item}
          </li>
        );
      })}
    </ul>
  );
}
