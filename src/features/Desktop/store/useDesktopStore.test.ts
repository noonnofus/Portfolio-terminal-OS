import { beforeEach, describe, expect, it } from "vitest";
import { useDesktopStore } from "./useDesktopStore";

const initialState = useDesktopStore.getState();

describe("useDesktopStore", () => {
    beforeEach(() => {
        useDesktopStore.setState(initialState, true);
    });

    it("adds an app to openApps only once when activated repeatedly", () => {
        useDesktopStore.getState().setActiveApp("Terminal");
        useDesktopStore.getState().setActiveApp("Terminal");

        const state = useDesktopStore.getState();

        expect(state.activeApp).toBe("Terminal");
        expect(state.openApps).toEqual(["Terminal"]);
    });

    it("toggles focus for the same app", () => {
        useDesktopStore.getState().setFocusApp("About");
        expect(useDesktopStore.getState().focusApp).toBe("About");

        useDesktopStore.getState().setFocusApp("About");
        expect(useDesktopStore.getState().focusApp).toBe("");
    });

    it("closes an app and clears related active and focus state", () => {
        const store = useDesktopStore.getState();
        store.setActiveApp("Contact");
        store.setFocusApp("Contact");

        useDesktopStore.getState().closeApp("Contact");

        const state = useDesktopStore.getState();
        expect(state.openApps).toEqual([]);
        expect(state.activeApp).toBe("");
        expect(state.focusApp).toBe("");
    });

    it("stores desktop icon positions by app name", () => {
        const store = useDesktopStore.getState();

        store.setDesktopIconPosition("Terminal", { left: 120, top: 48 });

        expect(useDesktopStore.getState().desktopIconPositions).toEqual({
            Terminal: { left: 120, top: 48 },
        });
    });
});
