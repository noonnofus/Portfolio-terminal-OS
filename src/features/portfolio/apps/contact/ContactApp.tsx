"use client";

import { ExternalLink, GitBranch, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getPortfolioContent } from "@/features/portfolio/content/getPortfolioContent";
import type { Language } from "@/lib/i18n/language";

interface ContactAppProps {
    language: Language;
}

export default function ContactApp({ language }: ContactAppProps) {
    const { t } = useTranslation("Contact", { lng: language });
    const { contact } = getPortfolioContent(language);
    const links = [
        { label: t("email"), value: contact.email, href: `mailto:${contact.email}`, Icon: Mail },
        { label: "GitHub", value: contact.github, href: contact.github, Icon: GitBranch },
    ];

    return (
        <div className="application-app-surface min-h-full w-full">
            <article
                lang={language}
                aria-labelledby="contact-heading"
                className="application-content-inset mx-auto w-full max-w-2xl px-6 py-6"
            >
                <header>
                    <h2
                        id="contact-heading"
                        className="text-[length:var(--application-text-large-title)] font-semibold tracking-tight text-[var(--application-app-surface-text)]"
                    >
                        {t("title")}
                    </h2>
                    <p className="mt-2 break-keep text-[length:var(--application-text-body)] leading-5 text-[var(--application-app-surface-muted)]">
                        {t("description")}
                    </p>
                </header>
                <ul className="-mx-3 mt-4 divide-y divide-[var(--application-app-divider)]">
                    {links.map(({ label, value, href, Icon }) => (
                        <li key={label} className="py-1">
                            <a
                                href={href}
                                className="group flex min-h-14 items-center gap-3 rounded-[var(--application-radius-panel)] px-3 py-2 outline-offset-[-2px] transition-colors hover:bg-[var(--application-control-hover)] focus-visible:outline-2 focus-visible:outline-[var(--application-focus-blue)]"
                            >
                                <Icon aria-hidden="true" className="size-5 shrink-0 text-[var(--application-app-surface-muted)]" />
                                <span className="min-w-0 flex-1">
                                    <span className="block text-[length:var(--application-text-callout)] leading-4 text-[var(--application-app-surface-muted)]">
                                        {label}
                                    </span>
                                    <span className="block text-[length:var(--application-text-reading)] font-medium leading-5 text-[var(--application-app-surface-text)] group-hover:text-[var(--application-accent-text)] [overflow-wrap:anywhere]">
                                        {value.replace(/^https:\/\/(?:www\.)?/, "").replace(/\/$/, "")}
                                    </span>
                                </span>
                                <ExternalLink aria-hidden="true" className="size-4 shrink-0 text-[var(--application-app-surface-muted)]" />
                            </a>
                        </li>
                    ))}
                </ul>
            </article>
        </div>
    );
}
