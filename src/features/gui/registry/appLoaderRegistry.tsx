"use client";

import dynamic from "next/dynamic";
import type {
    GuiAppComponentProps,
    GuiAppLoaderMap,
} from "@/features/gui-v2/apps/appTypes";
import { ensureProjectNamespace } from "@/shared/lib/i18n/loadProjectNamespace";
import { useAppRuntime } from "@/features/gui-v2/runtime/AppRuntimeContext";

function WindowLoadingState() {
    return (
        <div aria-live="polite" className="p-6">
            Loading…
        </div>
    );
}

const AboutApp = dynamic<GuiAppComponentProps<"about">>(
    async () => {
        const { default: App } = await import(
            "@/features/applications/components/about/AppAbout"
        );
        return function AboutAdapter({ language }) {
            return <App language={language} />;
        };
    },
    { loading: WindowLoadingState },
);

const ProjectsApp = dynamic<GuiAppComponentProps<"projects">>(
    () => import("@/features/gui-v2/apps/components/ProjectsAppV2"),
    { loading: WindowLoadingState },
);

const ResumeApp = dynamic<GuiAppComponentProps<"resume">>(
    () => import("@/features/gui-v2/apps/components/ResumeAppV2"),
    { loading: WindowLoadingState },
);

const TerminalApp = dynamic<GuiAppComponentProps<"terminal">>(
    async () => {
        const { default: App } = await import(
            "@/features/applications/components/terminal/AppTerminal"
        );
        return function TerminalAdapter() {
            const { effectiveVisibility, resumeEpoch } =
                useAppRuntime();
            return (
                <App
                    active={effectiveVisibility === "active"}
                    resumeSignal={resumeEpoch}
                />
            );
        };
    },
    { loading: WindowLoadingState, ssr: false },
);

const ContactApp = dynamic<GuiAppComponentProps<"contact">>(
    async () => {
        const { default: App } = await import(
            "@/features/applications/components/contact/AppContact"
        );
        return function ContactAdapter({ language }) {
            return <App language={language} />;
        };
    },
    { loading: WindowLoadingState },
);

const SettingsApp = dynamic<GuiAppComponentProps<"settings">>(
    () => import("@/features/gui-v2/apps/components/SettingsAppV2"),
    { loading: WindowLoadingState },
);

const WchmsApp = dynamic<GuiAppComponentProps<"project:wchms">>(
    async () => {
        await ensureProjectNamespace("WCHMS");
        const { default: App } = await import(
            "@/features/applications/components/wchms/AppWCHMS"
        );
        return function WchmsAdapter({ language }) {
            return <App language={language} />;
        };
    },
    { loading: WindowLoadingState },
);

const FlareApp = dynamic<GuiAppComponentProps<"project:flare">>(
    async () => {
        await ensureProjectNamespace("Flare");
        const { default: App } = await import(
            "@/features/applications/components/flare/AppFlare"
        );
        return function FlareAdapter({ language }) {
            return <App language={language} />;
        };
    },
    { loading: WindowLoadingState },
);

const WeConnectApp = dynamic<GuiAppComponentProps<"project:weconnect">>(
    async () => {
        await ensureProjectNamespace("WeConnect");
        const { default: App } = await import(
            "@/features/applications/components/we-connect/AppWeConnect"
        );
        return function WeConnectAdapter({ language }) {
            return <App language={language} />;
        };
    },
    { loading: WindowLoadingState },
);

const PageSsenceApp = dynamic<GuiAppComponentProps<"project:pagessence">>(
    async () => {
        await ensureProjectNamespace("PageSsence");
        const { default: App } = await import(
            "@/features/applications/components/page-ssence/AppPageSsence"
        );
        return function PageSsenceAdapter({ language }) {
            return <App language={language} />;
        };
    },
    { loading: WindowLoadingState },
);

const DiceRollerApp = dynamic<GuiAppComponentProps<"project:diceroller">>(
    async () => {
        await ensureProjectNamespace("DiceRoller");
        const { default: App } = await import(
            "@/features/applications/components/dice-roller/AppDiceRoller"
        );
        return function DiceRollerAdapter({ language }) {
            return <App language={language} />;
        };
    },
    { loading: WindowLoadingState },
);

const MejuBotApp = dynamic<GuiAppComponentProps<"project:mejubot">>(
    async () => {
        await ensureProjectNamespace("Mejubot");
        const { default: App } = await import(
            "@/features/applications/components/mejubot/AppMejubot"
        );
        return function MejuBotAdapter({ language }) {
            return <App language={language} />;
        };
    },
    { loading: WindowLoadingState },
);

const WebPianoApp = dynamic<GuiAppComponentProps<"project:webpiano">>(
    async () => {
        await ensureProjectNamespace("WebPiano");
        const { default: App } = await import(
            "@/features/applications/components/web-piano/AppWebPiano"
        );
        return function WebPianoAdapter({ language }) {
            return <App language={language} />;
        };
    },
    { loading: WindowLoadingState },
);

export const appLoaderRegistry = {
    about: AboutApp,
    projects: ProjectsApp,
    resume: ResumeApp,
    terminal: TerminalApp,
    contact: ContactApp,
    settings: SettingsApp,
    "project:wchms": WchmsApp,
    "project:flare": FlareApp,
    "project:weconnect": WeConnectApp,
    "project:pagessence": PageSsenceApp,
    "project:diceroller": DiceRollerApp,
    "project:mejubot": MejuBotApp,
    "project:webpiano": WebPianoApp,
} satisfies GuiAppLoaderMap;

export const appLoaderRegistryKeys = Object.keys(appLoaderRegistry).sort();
