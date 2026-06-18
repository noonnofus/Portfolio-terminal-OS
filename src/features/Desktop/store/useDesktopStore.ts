import { create } from 'zustand';

interface DesktopIconPosition {
    left: number;
    top: number;
}

interface DesktopState {
    isTouchDevice: boolean;
    activeApp: string;
    focusApp: string;
    showAppMenu: boolean;
    showModal: boolean;
    userRole: string;
    openApps: string[];
    desktopIconPositions: Record<string, DesktopIconPosition>;
    setIsTouchDevice: (val: boolean) => void;
    setActiveApp: (app: string) => void;
    setFocusApp: (app: string) => void;
    closeApp: (app: string) => void;
    setShowAppMenu: (val: boolean) => void;
    setShowModal: (val: boolean) => void;
    setUserRole: (role: string) => void;
    setDesktopIconPosition: (app: string, position: DesktopIconPosition) => void;
}

export const useDesktopStore = create<DesktopState>((set) => ({
    isTouchDevice: true,
    activeApp: "",
    focusApp: "",
    showAppMenu: false,
    showModal: true,
    userRole: "",
    openApps: [],
    desktopIconPositions: {},
    setIsTouchDevice: (val) => set({ isTouchDevice: val }),
    setActiveApp: (app) => set((state) => ({
        activeApp: app,
        openApps: state.openApps.includes(app) ? state.openApps : [...state.openApps, app]
    })),
    setFocusApp: (app) => set((state) => ({
        focusApp: state.focusApp === app ? "" : app
    })),
    closeApp: (app) => set((state) => ({
        openApps: state.openApps.filter((a) => a !== app),
        activeApp: state.activeApp === app ? "" : state.activeApp,
        focusApp: state.focusApp === app ? "" : state.focusApp,
    })),
    setShowAppMenu: (val) => set({ showAppMenu: val }),
    setShowModal: (val) => set({ showModal: val }),
    setUserRole: (role) => set({ userRole: role }),
    setDesktopIconPosition: (app, position) => set((state) => ({
        desktopIconPositions: {
            ...state.desktopIconPositions,
            [app]: position,
        },
    })),
}));
