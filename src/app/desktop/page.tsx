import { DesktopMetadata } from "@/app/desktop/components/DesktopMetadata";
import { getDesktopMetadata, desktopMetadataReset } from "@/app/desktop/lib/getDesktopMetadata";
import { DesktopClient } from "@/app/desktop/DesktopClient";

export const metadata = desktopMetadataReset;

export default async function DesktopPage({ searchParams }: PageProps<"/desktop">) {
  const initialPath = getDesktopMetadata(await searchParams, "ko").alternates.canonical;
  return <><DesktopMetadata initialPath={initialPath} /><DesktopClient /></>;
}
