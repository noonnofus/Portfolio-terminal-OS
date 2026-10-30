import type { Metadata } from "next";
import TerminalRouteClient from "@/features/terminal/components/TerminalRouteClient";

const title = "Hyunho Kim | Software Engineer Portfolio";
const description =
  "Hyunho Kim's software engineering portfolio, connecting user interfaces, backend services, and AI into working products.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: {
    canonical: "/en",
    languages: {
      ko: "/",
      en: "/en",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/en",
    siteName: "Hyunho Kim Portfolio",
    title,
    description,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Hyunho Kim, Software Engineer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/opengraph-image"],
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
