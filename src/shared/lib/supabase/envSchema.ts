export type SupabasePublicEnv = Readonly<{
  publishableKey: string;
  url: string;
}>;

export type SupabaseSecretEnv = Readonly<{
  secretKey: string;
}>;

type EnvironmentSource = Readonly<Record<string, string | undefined>>;

function readRequired(
  source: EnvironmentSource,
  name: string,
): string {
  const value = source[name]?.trim();

  if (!value) {
    throw new Error(`Missing required server environment variable: ${name}`);
  }

  return value;
}

function validateSupabaseUrl(value: string): string {
  let url: URL;

  try {
    url = new URL(value);
  } catch {
    throw new Error("SUPABASE_URL must be a valid absolute URL");
  }

  const isLocalDevelopment =
    url.protocol === "http:" &&
    (url.hostname === "127.0.0.1" || url.hostname === "localhost");

  if (url.protocol !== "https:" && !isLocalDevelopment) {
    throw new Error(
      "SUPABASE_URL must use HTTPS unless it targets local development",
    );
  }

  return url.origin;
}

export function parseSupabasePublicEnv(
  source: EnvironmentSource,
): SupabasePublicEnv {
  return {
    url: validateSupabaseUrl(readRequired(source, "SUPABASE_URL")),
    publishableKey: readRequired(source, "SUPABASE_PUBLISHABLE_KEY"),
  };
}

export function parseSupabaseSecretEnv(
  source: EnvironmentSource,
): SupabaseSecretEnv {
  const secretKey =
    source.SUPABASE_SECRET_KEY?.trim() ||
    source.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!secretKey) {
    throw new Error(
      "Missing required server environment variable: SUPABASE_SECRET_KEY",
    );
  }

  return { secretKey };
}
