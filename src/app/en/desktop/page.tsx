import { DesktopMetadata } from "@/app/desktop/components/DesktopMetadata";
import { getDesktopMetadata, desktopMetadataReset } from "@/app/desktop/lib/getDesktopMetadata";
import { DesktopClient } from "@/app/desktop/DesktopClient";

export const metadata = desktopMetadataReset;

export default async function EnglishDesktopPage({ searchParams }: PageProps<"/en/desktop">) {
  const initialPath = getDesktopMetadata(await searchParams, "en").alternates.canonical;
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
      <DesktopClient language="en" />
    </>
  );
}
