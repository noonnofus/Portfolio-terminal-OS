import "server-only";

import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/database.types";
import {
  getSupabasePublicEnv,
  getSupabaseSecretEnv,
} from "@/lib/supabase/env";

export function createSupabaseAdminClient() {
  const { url } = getSupabasePublicEnv();
  const { secretKey } = getSupabaseSecretEnv();

  return createClient<Database>(url, secretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
