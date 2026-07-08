import type { Metadata } from "next";
import { cookies } from "next/headers";
import { GuiEntry } from "@/features/gui/GuiEntry";
import { getViewerForUser } from "@/features/auth/server/getViewer";
import { createSupabaseServerClient } from "@/shared/lib/supabase/server";

export const metadata: Metadata = {
  title: "Hyunho Kim | Portfolio",
};

export default async function GuiPage() {
  const cookieStore = await cookies();
  const supabase = createSupabaseServerClient({
    getAll: () => cookieStore.getAll(),
    setAll: () => {
      // proxy.ts owns Supabase auth cookie refresh for /gui.
    },
  });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const viewer = await getViewerForUser(user);

  return <GuiEntry viewer={viewer} />;
}
