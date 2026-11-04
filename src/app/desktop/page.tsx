import { parseDesktopSearchParams, serializeDesktopUrl } from "@/app/desktop/lib/parseDesktopAppTarget";
import { DesktopMetadata } from "@/app/desktop/components/DesktopMetadata";
import { desktopMetadataReset } from "@/app/desktop/lib/getDesktopMetadata";
import { DesktopClient } from "@/app/desktop/DesktopClient";
import { readUiPreferences } from "@/lib/preferences/readUiPreferences";

export const metadata = desktopMetadataReset;

export default async function DesktopPage({ searchParams }: PageProps<"/desktop">) {
  const initialView = parseDesktopSearchParams(await searchParams, "ko");
  const preferences = await readUiPreferences();
  const initialPath = serializeDesktopUrl(initialView);
  return <><DesktopMetadata initialPath={initialPath} /><DesktopClient initialView={initialView} initialPreferences={preferences} /></>;
}
