import type { Metadata } from "next";
import "./globals.css";
import "@xterm/xterm/css/xterm.css";
import ClientProvider from "./ClientProvider";
import { DEFAULT_LANGUAGE, REQUEST_LANGUAGE_HEADER } from "@/lib/i18n/language";
import { headers } from "next/headers";
import { readUiPreferences } from "@/lib/preferences/readUiPreferences";

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


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const preferences = await readUiPreferences();
  const language = (await headers()).get(REQUEST_LANGUAGE_HEADER) === "en" ? "en" : DEFAULT_LANGUAGE;
  const colorModeScript = `(() => {
    const preference = ${JSON.stringify(preferences.colorMode)};
    const resolved = preference === "auto" ? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : preference;
    const root = document.documentElement;
    root.classList.toggle("dark", resolved === "dark");
    root.classList.toggle("light", resolved === "light");
    root.style.colorScheme = resolved;
  })();`;
  return (
    <html lang={language} className={preferences.colorMode === "auto" ? undefined : preferences.colorMode} suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: colorModeScript }} /></head>
      <body>
        <ClientProvider initialColorMode={preferences.colorMode}>{children}</ClientProvider>
      </body>
    </html>
  );
}
