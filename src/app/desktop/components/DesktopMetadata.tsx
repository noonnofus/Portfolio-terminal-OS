"use client";

import { useSyncExternalStore } from "react";
import { getDesktopMetadataForView, getDesktopStructuredData } from "@/app/desktop/lib/getDesktopMetadata";
import { getDesktopLanguageFromPathname, parseDesktopUrl } from "@/app/desktop/lib/parseDesktopAppTarget";
import { SITE_URL } from "@/lib/seo/siteMetadata";

function subscribe(listener: () => void) {
  window.addEventListener("desktop-metadata-change", listener);
  return () => window.removeEventListener("desktop-metadata-change", listener);
}
function getSnapshot() {
  return `${window.location.pathname}${window.location.search}`;
}

export function DesktopMetadata({ initialPath }: { initialPath: string }) {
  const path = useSyncExternalStore(subscribe, getSnapshot, () => initialPath);
  const url = new URL(path, SITE_URL);
  const view = parseDesktopUrl(url.searchParams, getDesktopLanguageFromPathname(url.pathname, "ko"));
  const metadata = getDesktopMetadataForView(view);
  const structuredData = getDesktopStructuredData(view);
  const absoluteUrl = (value: string) => new URL(value, SITE_URL).href;
  return <>
    <title>{metadata.title.absolute}</title>
    <meta name="description" content={metadata.description} />
    <link rel="canonical" href={absoluteUrl(metadata.alternates.canonical)} />
    <link rel="alternate" hrefLang="ko" href={absoluteUrl(metadata.alternates.languages.ko)} />
    <link rel="alternate" hrefLang="en" href={absoluteUrl(metadata.alternates.languages.en)} />
    <meta property="og:type" content={metadata.openGraph.type} />
    <meta property="og:site_name" content={metadata.openGraph.siteName} />
    <meta property="og:title" content={metadata.openGraph.title} />
    <meta property="og:description" content={metadata.openGraph.description} />
    <meta property="og:url" content={absoluteUrl(metadata.openGraph.url)} />
    <meta property="og:locale" content={metadata.openGraph.locale} />
    {metadata.openGraph.images.map(image => <meta key={image.url} property="og:image" content={absoluteUrl(image.url)} />)}
    {metadata.openGraph.images.map(image => <meta key={image.url} property="og:image:width" content={String(image.width)} />)}
    {metadata.openGraph.images.map(image => <meta key={image.url} property="og:image:height" content={String(image.height)} />)}
    {metadata.openGraph.images.map(image => <meta key={image.url} property="og:image:alt" content={image.alt} />)}
    <meta name="twitter:card" content={metadata.twitter.card} />
    <meta name="twitter:title" content={metadata.twitter.title} />
    <meta name="twitter:description" content={metadata.twitter.description} />
    {metadata.twitter.images.map(image => <meta key={image} name="twitter:image" content={absoluteUrl(image)} />)}
    {structuredData !== null && (
      <script
        id="desktop-profile-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
    )}
  </>;
}
