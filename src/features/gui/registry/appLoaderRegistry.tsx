"use client";

import dynamic from "next/dynamic";
import type {
    GuiAppComponentProps,
    GuiAppLoaderMap,
} from "@/features/gui/registry/appTypes";
import { ensureProjectNamespace } from "@/shared/lib/i18n/loadProjectNamespace";
import { useAppRuntime } from "@/features/gui/runtime/AppRuntimeContext";

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
            "@/features/apps/about/AboutApp"
        );
        return function AboutAdapter({ language }) {
            return <App language={language} />;
        };
    },
    { loading: WindowLoadingState },
);

const ProjectsApp = dynamic<GuiAppComponentProps<"projects">>(
    () => import("@/features/apps/projects/ProjectsApp"),
    { loading: WindowLoadingState },
);

const ResumeApp = dynamic<GuiAppComponentProps<"resume">>(
    () => import("@/features/apps/resume/ResumeApp"),
    { loading: WindowLoadingState },
);

const TerminalApp = dynamic<GuiAppComponentProps<"terminal">>(
    async () => {
        const { default: App } = await import(
            "@/features/apps/terminal/TerminalWindowApp"
        );
        return function TerminalAdapter() {
            const { effectiveVisibility, resumeEpoch } =
                useAppRuntime();
            return (
                <App
                    active={
                        effectiveVisibility === "active" ||
                        effectiveVisibility === "inactive"
                    }
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
            "@/features/apps/contact/ContactApp"
        );
        return function ContactAdapter({ language }) {
            return <App language={language} />;
        };
    },
    { loading: WindowLoadingState },
);

const SettingsApp = dynamic<GuiAppComponentProps<"settings">>(
    () => import("@/features/apps/settings/SettingsApp"),
    { loading: WindowLoadingState },
);

const WchmsApp = dynamic<GuiAppComponentProps<"project:wchms">>(
    async () => {
        await ensureProjectNamespace("WCHMS");
        const { default: App } = await import(
            "@/features/apps/wchms/WchmsApp"
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
            "@/features/apps/flare/FlareApp"
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
            "@/features/apps/we-connect/WeConnectApp"
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
            "@/features/apps/page-ssence/PageSsenceApp"
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
            "@/features/apps/dice-roller/DiceRollerApp"
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
            "@/features/apps/mejubot/MejuBotApp"
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
            "@/features/apps/web-piano/WebPianoApp"
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
