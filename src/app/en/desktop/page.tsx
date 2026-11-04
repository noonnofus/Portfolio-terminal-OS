import { parseDesktopSearchParams, serializeDesktopUrl } from "@/app/desktop/lib/parseDesktopAppTarget";
import { DesktopMetadata } from "@/app/desktop/components/DesktopMetadata";
import { desktopMetadataReset } from "@/app/desktop/lib/getDesktopMetadata";
import { DesktopClient } from "@/app/desktop/DesktopClient";
import { readUiPreferences } from "@/lib/preferences/readUiPreferences";

export const metadata = desktopMetadataReset;

export default async function EnglishDesktopPage({ searchParams }: PageProps<"/en/desktop">) {
  const initialView = parseDesktopSearchParams(await searchParams, "en");
  const preferences = await readUiPreferences();
  const initialPath = serializeDesktopUrl(initialView);
  return (
    <>
      <DesktopMetadata initialPath={initialPath} />
      <section className="sr-only" lang="en">
        <h1>Hyunho Kim, Desktop Portfolio</h1>
        <p>
          Explore Hyunho Kim&apos;s projects, career, and resume in an
          interactive desktop portfolio.
        </p>
        <a href="/en">Open the English terminal portfolio</a>
      </section>
      <DesktopClient initialView={initialView} initialPreferences={preferences} language="en" />
    </>
  );
}
