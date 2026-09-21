import type { Metadata } from "next";
import { DesktopClient } from "@/app/desktop/DesktopClient";

const title = "Desktop Portfolio | Hyunho Kim";
const description =
  "Explore Hyunho Kim's projects, career, and resume in an interactive portfolio.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: {
    canonical: "/en/desktop",
    languages: {
      ko: "/desktop",
      en: "/en/desktop",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/en/desktop",
    siteName: "Hyunho Kim Portfolio",
    title,
    description,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Hyunho Kim, Frontend Developer Portfolio",
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

export default function EnglishDesktopPage() {
  return (
    <>
      <section className="sr-only" lang="en">
        <h1>Hyunho Kim, Desktop Portfolio</h1>
        <p>
          Explore Hyunho Kim&apos;s projects, career, and resume in an
          interactive desktop portfolio.
        </p>
        <a href="/en">Open the English terminal portfolio</a>
      </section>
      <DesktopClient language="en" />
    </>
  );
}
