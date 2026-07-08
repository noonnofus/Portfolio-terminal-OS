import { describe, expect, it } from "vitest";

import { parseUserPreferencesInput } from "@/features/user-preferences/model/preferenceSchemas";

describe("parseUserPreferencesInput", () => {
  it("accepts the expected preference payload", () => {
    expect(
      parseUserPreferencesInput({
        language: "en",
        theme: "dark",
        dockAutoHide: true,
        wallpaperId: "golden_gate_dark",
      }),
    ).toEqual({
      language: "en",
      theme: "dark",
      dockAutoHide: true,
      wallpaperId: "golden_gate_dark",
    });
  });

  it("accepts wallpaper ids by shape and leaves existence checks to the DB FK", () => {
    expect(
      parseUserPreferencesInput({
        language: "ko",
        theme: "system",
        dockAutoHide: false,
        wallpaperId: "not_in_frontend_catalog",
      }),
    ).toEqual({
      language: "ko",
      theme: "system",
      dockAutoHide: false,
      wallpaperId: "not_in_frontend_catalog",
    });
  });

  it("rejects unknown fields and invalid values", () => {
    expect(
      parseUserPreferencesInput({
        language: "fr",
        theme: "dark",
        dockAutoHide: true,
        wallpaperId: "golden_gate_dark",
      }),
    ).toBeNull();
    expect(
      parseUserPreferencesInput({
        language: "ko",
        theme: "dark",
        dockAutoHide: true,
        wallpaperId: "golden_gate_dark",
        extra: true,
      }),
    ).toBeNull();
  });
});
