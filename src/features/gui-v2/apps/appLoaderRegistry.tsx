"use client";

import dynamic from "next/dynamic";
import type {
    GuiAppComponentProps,
    GuiAppLoaderMap,
} from "@/features/gui-v2/apps/appTypes";

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
    async () => {
        const { default: App } = await import(
            "@/features/applications/components/folder/AppFolder"
        );
        return function ProjectsAdapter() {
            return <App />;
        };
    },
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
            return <App />;
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

const WchmsApp = dynamic<GuiAppComponentProps<"project:wchms">>(
    async () => {
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
    "project:wchms": WchmsApp,
    "project:flare": FlareApp,
    "project:weconnect": WeConnectApp,
    "project:pagessence": PageSsenceApp,
    "project:diceroller": DiceRollerApp,
    "project:mejubot": MejuBotApp,
    "project:webpiano": WebPianoApp,
} satisfies GuiAppLoaderMap;

export const appLoaderRegistryKeys = Object.keys(appLoaderRegistry).sort();
