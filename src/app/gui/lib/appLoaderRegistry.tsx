"use client";

import dynamic from "next/dynamic";
import { WindowLoadingState } from "@/app/gui/components/WindowLoadingState";
import { GuestbookAppLoadingState } from "@/features/guestbook/components/GuestbookLoadingState";
import { toGuestbookViewer } from "@/app/gui/lib/toGuestbookViewer";
import { useGuiStore } from "@/app/gui/store/GuiStoreProvider";
import type { GuiAppComponentProps, LeafAppLoaderMap } from "@/app/gui/types/appTypes";
import { useLanguageStore } from "@/lib/i18n/useLanguageStore";

function GuestbookWindowLoadingState() {
  const language = useLanguageStore((state) => state.currentLanguage);
  const viewer = useGuiStore((state) => state.viewer);

  return (
    <GuestbookAppLoadingState
      language={language}
      loginHref="/auth/github"
      viewer={toGuestbookViewer(viewer)}
    />
  );
}

const about = dynamic<GuiAppComponentProps<"about">>(
  async () => {
    const { default: App } = await import("@/features/portfolio/apps/about/AboutApp");
    return function AboutLoader({ language }) { return <App language={language} />; };
  },
  { loading: WindowLoadingState },
);
const resume = dynamic<GuiAppComponentProps<"resume">>(
  () => import("@/features/portfolio/apps/resume/ResumeApp"),
  { loading: WindowLoadingState },
);
const terminal = dynamic<GuiAppComponentProps<"terminal">>(
  async () => {
    const { default: App } = await import("@/app/gui/components/adapters/TerminalGuiAdapter");
    return function TerminalLoader() { return <App />; };
  },
  { loading: WindowLoadingState, ssr: false },
);
const contact = dynamic<GuiAppComponentProps<"contact">>(
  async () => {
    const { default: App } = await import("@/features/portfolio/apps/contact/ContactApp");
    return function ContactLoader({ language }) { return <App language={language} />; };
  },
  { loading: WindowLoadingState },
);
const notes = dynamic<GuiAppComponentProps<"notes">>(
  async () => {
    const { default: App } = await import("@/app/gui/components/adapters/GuestbookGuiAdapter");
    return function GuestbookLoader({ language }) { return <App language={language} />; };
  },
  { loading: GuestbookWindowLoadingState },
);
const settings = dynamic<GuiAppComponentProps<"settings">>(
  async () => {
    const { default: App } = await import("@/app/gui/components/adapters/SettingsGuiAdapter");
    return function SettingsLoader({ language }) { return <App language={language} />; };
  },
  { loading: WindowLoadingState },
);
const portfolio = dynamic<GuiAppComponentProps<"project:portfolio">>(
  async () => {
    const { default: App } = await import("@/features/portfolio/apps/projects/portfolio/PortfolioProjectApp");
    return function PortfolioLoader({ language }) { return <App language={language} />; };
  },
  { loading: WindowLoadingState },
);
const optigen = dynamic<GuiAppComponentProps<"project:optigen">>(
  async () => {
    const { default: App } = await import("@/features/portfolio/apps/projects/optigen/OptigenProjectApp");
    return function OptigenLoader({ language }) { return <App language={language} />; };
  },
  { loading: WindowLoadingState },
);
const mcp = dynamic<GuiAppComponentProps<"project:mcp">>(
  async () => {
    const { default: App } = await import("@/features/portfolio/apps/projects/mcp/McpProjectApp");
    return function McpLoader({ language }) { return <App language={language} />; };
  },
  { loading: WindowLoadingState },
);
const voiceGateway = dynamic<GuiAppComponentProps<"project:voice-gateway">>(
  async () => {
    const { default: App } = await import("@/features/portfolio/apps/projects/voice-gateway/VoiceGatewayProjectApp");
    return function VoiceGatewayLoader({ language }) { return <App language={language} />; };
  },
  { loading: WindowLoadingState },
);
const kepco = dynamic<GuiAppComponentProps<"project:kepco">>(
  async () => {
    const { default: App } = await import("@/features/portfolio/apps/projects/kepco/KepcoProjectApp");
    return function KepcoLoader({ language }) { return <App language={language} />; };
  },
  { loading: WindowLoadingState },
);
const wchms = dynamic<GuiAppComponentProps<"project:wchms">>(
  async () => {
    const { default: App } = await import("@/features/portfolio/apps/projects/wchms/WchmsProjectApp");
    return function WchmsLoader({ language }) { return <App language={language} />; };
  },
  { loading: WindowLoadingState },
);
const flare = dynamic<GuiAppComponentProps<"project:flare">>(
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
