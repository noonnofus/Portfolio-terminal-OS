import { create } from 'zustand';

interface DesktopState {
    isTouchDevice: boolean;
    activeApp: string;
    focusApp: string;
    showAppMenu: boolean;
    showModal: boolean;
    userRole: string;
    openApps: string[];
    setIsTouchDevice: (val: boolean) => void;
    setActiveApp: (app: string) => void;
    setFocusApp: (app: string) => void;
    closeApp: (app: string) => void;
    setShowAppMenu: (val: boolean) => void;
    setShowModal: (val: boolean) => void;
    setUserRole: (role: string) => void;
}

export const useDesktopStore = create<DesktopState>((set) => ({
    isTouchDevice: true,
    activeApp: "",
    focusApp: "",
    showAppMenu: false,
    showModal: true,
    userRole: "",
    openApps: [],
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
}));
