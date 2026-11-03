import type { Metadata } from "next";
import "./globals.css";
import "@xterm/xterm/css/xterm.css";
import ClientProvider from "./ClientProvider";
import { DEFAULT_LANGUAGE } from "@/lib/i18n/language";

import {
  SEO_COPY,
  SHARED_SOCIAL_METADATA,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo/siteMetadata";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `${SEO_COPY.ko.authorName} | %s`,
  },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/", languages: { ko: "/", en: "/en" } },
  openGraph: {
    ...SHARED_SOCIAL_METADATA.openGraph,
    locale: SEO_COPY.ko.locale,
    url: "/",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    ...SHARED_SOCIAL_METADATA.twitter,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={DEFAULT_LANGUAGE} suppressHydrationWarning>
      <body>
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}
