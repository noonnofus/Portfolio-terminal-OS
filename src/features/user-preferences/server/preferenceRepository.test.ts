import { beforeEach, describe, expect, it, vi } from "vitest";

import { saveUserPreferences } from "@/features/user-preferences/server/preferenceRepository";

vi.mock("server-only", () => ({}));

const mocks = vi.hoisted(() => ({
  createSupabaseAdminClient: vi.fn(),
}));

vi.mock("@/shared/lib/supabase/admin", () => ({
  createSupabaseAdminClient: mocks.createSupabaseAdminClient,
}));

function createPreferenceClient(result: unknown) {
  const single = vi.fn().mockResolvedValue(result);
  const select = vi.fn(() => ({ single }));
  const upsert = vi.fn(() => ({ select }));
  const from = vi.fn(() => ({ upsert }));

  return {
    client: { from },
    from,
    single,
    upsert,
  };
}

describe("saveUserPreferences", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("maps wallpaper FK violations to null so the action can return invalid_wallpaper", async () => {
    const supabase = createPreferenceClient({
      data: null,
      error: {
        code: "23503",
        details:
          'Key (wallpaper_id)=(missing) is not present in table "wallpapers".',
        message:
          'insert or update on table "user_preferences" violates foreign key constraint "user_preferences_wallpaper_id_fkey"',
      },
    });
    mocks.createSupabaseAdminClient.mockReturnValue(supabase.client);

    await expect(
      saveUserPreferences("account-id", {
        dockAutoHide: false,
        language: "ko",
        theme: "system",
        wallpaperId: "missing",
      }),
    ).resolves.toBeNull();

    expect(supabase.from).toHaveBeenCalledTimes(1);
    expect(supabase.from).toHaveBeenCalledWith("user_preferences");
  });

  it("throws non-wallpaper persistence errors", async () => {
    const supabase = createPreferenceClient({
      data: null,
      error: {
        code: "42501",
        details: "permission denied",
        message: "permission denied for table user_preferences",
      },
    });
    mocks.createSupabaseAdminClient.mockReturnValue(supabase.client);

    await expect(
      saveUserPreferences("account-id", {
        dockAutoHide: false,
        language: "ko",
        theme: "system",
        wallpaperId: "golden_gate_dark",
      }),
    ).rejects.toThrow("Failed to save user preferences");
  });
});
