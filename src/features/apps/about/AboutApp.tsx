'use client';

import {
    Component,
    PanelsTopLeft,
    Route,
    ShieldCheck,
    Zap,
} from "lucide-react";
import {
    siDrizzle,
    siI18next,
    siMysql,
    siNextdotjs,
    siPostgresql,
    siReact,
    siShadcnui,
    siSupabase,
    siTailwindcss,
    siTanstack,
    siTypescript,
    siVercel,
} from "simple-icons";
import StackIcon from "@/shared/components/StackIcon";
import {
    createOpenAppCommand,
    type GuiAppId,
} from "@/features/gui/registry/appTypes";
import { useGuiNavigation } from "@/features/gui/navigation/GuiNavigationProvider";
import { useTranslation } from 'react-i18next';
import { Language } from "@/shared/lib/i18n/useLanguageStore";

interface AboutAppProps {
    language: Language;
}

const technologyGroups = [
    {
        id: "coreFrontend",
        items: [
            { label: "React", icon: siReact },
            {
                label: "Next.js",
                icon: siNextdotjs,
                color: "var(--gui-app-surface-text)",
            },
            { label: "TypeScript", icon: siTypescript },
            { label: "Tailwind CSS", icon: siTailwindcss },
        ],
    },
    {
        id: "frontendSystems",
        items: [
            { label: "Zustand", icon: Component, color: "#443E38" },
            { label: "TanStack Query", icon: siTanstack },
            { label: "i18next", icon: siI18next },
            { label: "Tiptap", icon: PanelsTopLeft, color: "#7C3AED" },
        ],
    },
    {
        id: "fullStackFoundations",
        items: [
            { label: "Supabase", icon: siSupabase },
            { label: "PostgreSQL", icon: siPostgresql },
            { label: "MySQL", icon: siMysql },
            { label: "Drizzle ORM", icon: siDrizzle },
            { label: "shadcn/ui", icon: siShadcnui },
            { label: "Vercel", icon: siVercel, color: "var(--gui-app-surface-text)" },
        ],
    },
] as const;

const selectedWork: ReadonlyArray<{
    appId?: GuiAppId;
    id: "portfolioOs" | "wchms" | "flare";
}> = [
    { id: "portfolioOs" },
    { appId: "project:wchms", id: "wchms" },
    { appId: "project:flare", id: "flare" },
];

export default function AboutApp({}: AboutAppProps) {
    const { t } = useTranslation(['About', 'common']);
    const { navigate, navigationBusy } = useGuiNavigation();

    return (
        <div className="gui-app-surface h-full w-full overflow-y-auto">
            <article className="mx-auto w-full max-w-5xl px-5 py-8 md:px-12 md:py-12">
                <header className="border-b border-[var(--gui-border)] pb-8 md:pb-10">
                    <p className="text-[length:var(--gui-text-caption)] font-semibold uppercase tracking-[0.16em] text-[var(--gui-accent)]">
                        {t('eyebrow')}
                    </p>
                    <h2 className="mt-3 font-bold text-3xl tracking-tight text-[var(--gui-app-surface-text)] md:text-4xl">
                        {t('title')}
                    </h2>
                    <p className="mt-4 max-w-3xl text-[length:var(--gui-text-body)] leading-7 text-[var(--gui-muted)]">
                        {t('description')}
                    </p>
                    <p className="mt-3 text-[length:var(--gui-text-control)] text-[var(--gui-muted)]">
                        {t('education')}
                    </p>
                </header>

                <section className="border-b border-[var(--gui-border)] py-8 md:py-10" aria-labelledby="about-focus-title">
                    <div className="flex flex-col gap-2">
                        <p className="text-[length:var(--gui-text-caption)] font-semibold uppercase tracking-[0.14em] text-[var(--gui-muted)]">
                            {t('frontendFocusEyebrow')}
                        </p>
                        <h3 id="about-focus-title" className="text-2xl font-semibold tracking-tight text-[var(--gui-app-surface-text)]">
                            {t('frontendFocusTitle')}
                        </h3>
                    </div>
                    <div className="mt-6 grid gap-5 md:grid-cols-3">
                        {[
                            { icon: Component, title: 'uiArchitecture', description: 'uiArchitectureDescription' },
                            { icon: Route, title: 'stateData', description: 'stateDataDescription' },
                            { icon: ShieldCheck, title: 'quality', description: 'qualityDescription' },
                        ].map(({ icon: Icon, title, description }) => (
                            <div key={title} className="border-l-2 border-[var(--gui-accent)] pl-4">
                                <Icon aria-hidden="true" className="size-5 text-[var(--gui-accent)]" />
                                <h4 className="mt-3 font-semibold text-[var(--gui-app-surface-text)]">
                                    {t(title)}
                                </h4>
                                <p className="mt-2 text-[length:var(--gui-text-control)] leading-6 text-[var(--gui-muted)]">
                                    {t(description)}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="border-b border-[var(--gui-border)] py-8 md:py-10" aria-labelledby="about-stack-title">
                    <div className="flex items-baseline justify-between gap-4">
                        <h3 id="about-stack-title" className="text-2xl font-semibold tracking-tight text-[var(--gui-app-surface-text)]">
                            {t('techStackTitle')}
                        </h3>
                        <Zap aria-hidden="true" className="size-5 text-[var(--gui-muted)]" />
                    </div>

                    <div className="mt-7 space-y-8">
                        {technologyGroups.map((group) => (
                            <div key={group.id}>
                                <h4 className="text-[length:var(--gui-text-control)] font-semibold text-[var(--gui-app-surface-text)]">
                                    {t(group.id)}
                                </h4>
                                <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                                    {group.items.map((item) => (
                                        <StackIcon key={item.label} {...item} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="py-8 md:py-10" aria-labelledby="about-selected-work-title">
                    <p className="text-[length:var(--gui-text-caption)] font-semibold uppercase tracking-[0.14em] text-[var(--gui-muted)]">
                        {t('selectedWorkEyebrow')}
                    </p>
                    <h3 id="about-selected-work-title" className="mt-2 text-2xl font-semibold tracking-tight text-[var(--gui-app-surface-text)]">
                        {t('selectedWorkTitle')}
                    </h3>
                    <div className="mt-6 border-y border-[var(--gui-border)]">
                        {selectedWork.map((work, index) => {
                            const appId = work.appId;
                            const content = (
                                <>
                                    <span className="pt-0.5 font-mono text-sm text-[var(--gui-muted)]">
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                    <span className="min-w-0 flex-1">
                                        <span className="block font-semibold text-[var(--gui-app-surface-text)]">
                                            {t(`${work.id}Title`)}
                                        </span>
                                        <span className="mt-1 block text-[length:var(--gui-text-control)] leading-6 text-[var(--gui-muted)]">
                                            {t(`${work.id}Description`)}
                                        </span>
                                    </span>
                                </>
                            );

                            if (appId === undefined) {
                                return (
                                    <div
                                        key={work.id}
                                        className="flex items-start gap-4 border-b border-[var(--gui-border)] px-1 py-5"
                                    >
                                        {content}
                                        <span className="pt-0.5 text-[length:var(--gui-text-caption)] font-medium text-[var(--gui-muted)]">
                                            {t('currentProject')}
                                        </span>
                                    </div>
                                );
                            }

                            return (
                                <button
                                    key={work.id}
                                    type="button"
                                    disabled={navigationBusy}
                                    onClick={() => navigate(createOpenAppCommand(appId))}
                                    className="group flex w-full items-start gap-4 border-b border-[var(--gui-border)] px-1 py-5 text-left last:border-b-0 disabled:cursor-wait disabled:opacity-60"
                                >
                                    {content}
                                    <span aria-hidden="true" className="pt-0.5 text-[var(--gui-muted)] transition-transform group-hover:translate-x-1 group-focus-visible:translate-x-1">
                                        ↗
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </section>
            </article>
        </div>
    );
}
