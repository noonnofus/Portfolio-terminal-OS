import type { Metadata } from "next";
import { GuiClient } from "@/app/gui/GuiClient";

const title = "GUI Portfolio | Hyunho Kim";
const description =
  "Explore Hyunho Kim's projects, career, and resume in an interactive portfolio.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: {
    canonical: "/en/gui",
    languages: {
      ko: "/gui",
      en: "/en/gui",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/en/gui",
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

export default function EnglishGuiPage() {
  return (
    <>
      <section className="sr-only" lang="en">
        <h1>Hyunho Kim, GUI Portfolio</h1>
        <p>
          Explore Hyunho Kim&apos;s projects, career, and resume in an
          interactive desktop portfolio.
        </p>
        <a href="/en">Open the English terminal portfolio</a>
      </section>
      <GuiClient language="en" />
    </>
  );
}
