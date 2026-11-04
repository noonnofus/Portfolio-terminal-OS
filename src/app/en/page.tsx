import type { Metadata } from "next";
import TerminalRouteClient from "@/features/terminal/components/TerminalRouteClient";

import { SEO_COPY, SHARED_SOCIAL_METADATA } from "@/lib/seo/siteMetadata";

const { title, description, locale } = SEO_COPY.en;

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/en", languages: { ko: "/", en: "/en" } },
  openGraph: {
    ...SHARED_SOCIAL_METADATA.openGraph,
    locale,
    url: "/en",
    title,
    description,
  },
  twitter: {
    ...SHARED_SOCIAL_METADATA.twitter,
    title,
    description,
  },
};

export default function EnglishTerminalPage() {
  return (
    <main className="h-dvh w-dvw overflow-hidden bg-black">
      <section className="sr-only" lang="en">
        <h1>Hyunho Kim, Software Engineer Portfolio</h1>
        <p>
          Explore Hyunho Kim&apos;s software engineering experience, projects,
          and career through an interactive terminal portfolio.
        </p>
      </section>
      <TerminalRouteClient initialLanguage="en" />
    </main>
  );
}
