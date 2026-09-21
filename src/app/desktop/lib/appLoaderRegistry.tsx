"use client";

import dynamic from "next/dynamic";
import { WindowLoadingState } from "@/app/desktop/components/WindowLoadingState";
import { GuestbookAppLoadingState } from "@/features/guestbook/components/GuestbookLoadingState";
import { toGuestbookViewer } from "@/app/desktop/lib/toGuestbookViewer";
import { useDesktopStore } from "@/app/desktop/store/DesktopStoreProvider";
import type { DesktopAppComponentProps, LeafAppLoaderMap } from "@/app/desktop/types/appTypes";
import { useLanguageStore } from "@/lib/i18n/useLanguageStore";

function GuestbookWindowLoadingState() {
  const language = useLanguageStore((state) => state.currentLanguage);
  const viewer = useDesktopStore((state) => state.viewer);

  return (
    <GuestbookAppLoadingState
      language={language}
      loginHref="/auth/github"
      viewer={toGuestbookViewer(viewer)}
    />
  );
}

const about = dynamic<DesktopAppComponentProps<"about">>(
  async () => {
    const { default: App } = await import("@/features/portfolio/apps/about/AboutApp");
    return function AboutLoader({ language }) { return <App language={language} />; };
  },
  { loading: WindowLoadingState },
);
const resume = dynamic<DesktopAppComponentProps<"resume">>(
  () => import("@/features/portfolio/apps/resume/ResumeApp"),
  { loading: WindowLoadingState },
);
const terminal = dynamic<DesktopAppComponentProps<"terminal">>(
  async () => {
    const { default: App } = await import("@/app/desktop/adapters/TerminalAdapter");
    return function TerminalLoader() { return <App />; };
  },
  { loading: WindowLoadingState, ssr: false },
);
const contact = dynamic<DesktopAppComponentProps<"contact">>(
  async () => {
    const { default: App } = await import("@/features/portfolio/apps/contact/ContactApp");
    return function ContactLoader({ language }) { return <App language={language} />; };
  },
  { loading: WindowLoadingState },
);
const notes = dynamic<DesktopAppComponentProps<"notes">>(
  async () => {
    const { default: App } = await import("@/app/desktop/adapters/GuestbookAdapter");
    return function GuestbookLoader({ language }) { return <App language={language} />; };
  },
  { loading: GuestbookWindowLoadingState },
);
const settings = dynamic<DesktopAppComponentProps<"settings">>(
  async () => {
    const { default: App } = await import("@/app/desktop/adapters/SettingsAdapter");
    return function SettingsLoader({ language }) { return <App language={language} />; };
  },
  { loading: WindowLoadingState },
);
const portfolio = dynamic<DesktopAppComponentProps<"project:portfolio">>(
  async () => {
    const { default: App } = await import("@/features/portfolio/apps/projects/portfolio/PortfolioProjectApp");
    return function PortfolioLoader({ language }) { return <App language={language} />; };
  },
  { loading: WindowLoadingState },
);
const optigen = dynamic<DesktopAppComponentProps<"project:optigen">>(
  async () => {
    const { default: App } = await import("@/features/portfolio/apps/projects/optigen/OptigenProjectApp");
    return function OptigenLoader({ language }) { return <App language={language} />; };
  },
  { loading: WindowLoadingState },
);
const mcp = dynamic<DesktopAppComponentProps<"project:mcp">>(
  async () => {
    const { default: App } = await import("@/features/portfolio/apps/projects/mcp/McpProjectApp");
    return function McpLoader({ language }) { return <App language={language} />; };
  },
  { loading: WindowLoadingState },
);
const voiceGateway = dynamic<DesktopAppComponentProps<"project:voice-gateway">>(
  async () => {
    const { default: App } = await import("@/features/portfolio/apps/projects/voice-gateway/VoiceGatewayProjectApp");
    return function VoiceGatewayLoader({ language }) { return <App language={language} />; };
  },
  { loading: WindowLoadingState },
);
const kepco = dynamic<DesktopAppComponentProps<"project:kepco">>(
  async () => {
    const { default: App } = await import("@/features/portfolio/apps/projects/kepco/KepcoProjectApp");
    return function KepcoLoader({ language }) { return <App language={language} />; };
  },
  { loading: WindowLoadingState },
);
const wchms = dynamic<DesktopAppComponentProps<"project:wchms">>(
  async () => {
    const { default: App } = await import("@/features/portfolio/apps/projects/wchms/WchmsProjectApp");
    return function WchmsLoader({ language }) { return <App language={language} />; };
  },
  { loading: WindowLoadingState },
);
const flare = dynamic<DesktopAppComponentProps<"project:flare">>(
  async () => {
    const { default: App } = await import("@/features/portfolio/apps/projects/flare/FlareProjectApp");
    return function FlareLoader({ language }) { return <App language={language} />; };
  },
  { loading: WindowLoadingState },
);

export const appLoaderRegistry = {
  about, resume, terminal, contact, notes, settings,
  "project:portfolio": portfolio, "project:optigen": optigen,
  "project:mcp": mcp, "project:voice-gateway": voiceGateway,
  "project:kepco": kepco, "project:wchms": wchms, "project:flare": flare,
} satisfies LeafAppLoaderMap;

export const appLoaderRegistryKeys = Object.keys(appLoaderRegistry).sort();
