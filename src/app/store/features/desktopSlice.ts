import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const desktopSlice = createSlice({
  name: "desktop",
  initialState: {
    isTouchDevice: true,
    activeApp: "",
    focusApp: "",
    showAppMenu: false,
    showModal: true,
    userRole: "",
    openApps: <string[]>[],
    user: null,
  },
  reducers: {
    setIsTouchDevice: (state, action: PayloadAction<boolean>) => {
      state.isTouchDevice = action.payload;
    },
    setActiveApp: (state, action: PayloadAction<string>) => {
      state.activeApp = action.payload;
      if (!state.openApps.includes(action.payload)) {
        state.openApps.push(action.payload);
      }
    },
    setFoucsApp: (state, action: PayloadAction<string>) => {
      if (state.focusApp === action.payload) return;
      if (state.focusApp === action.payload) {
        state.focusApp = "";
      }
      state.focusApp = action.payload;
    },
    closeApp: (state, action: PayloadAction<string>) => {
      state.openApps = state.openApps.filter((app) => app !== action.payload);
      if (state.activeApp === action.payload) {
        state.activeApp = "";
      }
    },
    setShowAppMenu: (state, action: PayloadAction<boolean>) => {
      state.showAppMenu = action.payload;
    },
    setShowModal: (state, action: PayloadAction<boolean>) => {
      state.showModal = action.payload;
    },
    setUserRole: (state, action: PayloadAction<string>) => {
      state.userRole = action.payload;
    },
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
  },
});

export const {
  setIsTouchDevice,
  setActiveApp,
  setFoucsApp,
  closeApp,
  setShowAppMenu,
  setShowModal,
  setUserRole,
  setUser,
} = desktopSlice.actions;
export default desktopSlice.reducer;
