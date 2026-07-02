import "server-only";

import {
  parseSupabasePublicEnv,
  parseSupabaseSecretEnv,
} from "@/shared/lib/supabase/envSchema";

export function getSupabasePublicEnv() {
  return parseSupabasePublicEnv(process.env);
}

export function getSupabaseSecretEnv() {
  return parseSupabaseSecretEnv(process.env);
}
