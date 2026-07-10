import "server-only";

import {
  parseApplicationOrigin,
  parseSupabasePublicEnv,
  parseSupabaseSecretEnv,
} from "@/shared/lib/supabase/envSchema";

export function getApplicationOrigin() {
  return parseApplicationOrigin(process.env);
}

export function getSupabasePublicEnv() {
  return parseSupabasePublicEnv(process.env);
}

export function getSupabaseSecretEnv() {
  return parseSupabaseSecretEnv(process.env);
}
