import { parseDesktopSearchParams, serializeDesktopUrl } from "@/app/desktop/lib/parseDesktopAppTarget";
import { DesktopMetadata } from "@/app/desktop/components/DesktopMetadata";
import { desktopMetadataReset } from "@/app/desktop/lib/getDesktopMetadata";
import { DesktopClient } from "@/app/desktop/DesktopClient";
import { readUiPreferences } from "@/lib/preferences/readUiPreferences";
import { SEO_COPY } from "@/lib/seo/siteMetadata";

export const metadata = desktopMetadataReset;

export default async function EnglishDesktopPage({ searchParams }: PageProps<"/en/desktop">) {
  const initialView = parseDesktopSearchParams(await searchParams, "en");
  const preferences = await readUiPreferences();
  const initialPath = serializeDesktopUrl(initialView);
  return (
    <>
      <DesktopMetadata initialPath={initialPath} />
      <section className="sr-only" lang="en">
        <h1>{SEO_COPY.en.desktop.title}</h1>
        <p>{SEO_COPY.en.desktop.description}</p>
        <a href="/en">Open the English terminal portfolio</a>
      </section>
      <DesktopClient initialView={initialView} initialPreferences={preferences} language="en" />
    </>
  );
}
