const MAX_CALLBACK_QUERY_LENGTH = 2_048;

const ALLOWED_CALLBACK_PARAMS = new Set([
  "code",
  "error",
  "error_code",
  "error_description",
]);

export type AuthCallbackQuery =
  | Readonly<{ code: string; type: "code" }>
  | Readonly<{ type: "error" }>;

export function parseAuthCallbackQuery(url: URL): AuthCallbackQuery {
  if (url.search.length > MAX_CALLBACK_QUERY_LENGTH) {
    return { type: "error" };
  }

  for (const key of url.searchParams.keys()) {
    if (!ALLOWED_CALLBACK_PARAMS.has(key)) {
      return { type: "error" };
    }

    if (url.searchParams.getAll(key).length !== 1) {
      return { type: "error" };
    }
  }

  const code = url.searchParams.get("code");
  const hasAuthError =
    url.searchParams.has("error") || url.searchParams.has("error_code");

  if (
    !code ||
    hasAuthError ||
    url.searchParams.has("error_description")
  ) {
    return { type: "error" };
  }

  return { code, type: "code" };
}
