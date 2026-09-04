import "server-only";

import {
  parseApplicationOrigin,
  parseSupabasePublicEnv,
  parseSupabaseSecretEnv,
} from "@/lib/supabase/envSchema";

type EnvironmentSource = Readonly<Record<string, string | undefined>>;

export function getApplicationOrigin(source: EnvironmentSource = process.env) {
  const previewDeploymentUrl =
    source.VERCEL_ENV === "preview" ? source.VERCEL_URL?.trim() : undefined;

  if (previewDeploymentUrl) {
    return parseApplicationOrigin({
      ...source,
      APP_ORIGIN: `https://${previewDeploymentUrl}`,
    });
  }

  return parseApplicationOrigin(source);
}

export function getSupabasePublicEnv() {
  return parseSupabasePublicEnv(process.env);
}

export function getSupabaseSecretEnv() {
  return parseSupabaseSecretEnv(process.env);
}
