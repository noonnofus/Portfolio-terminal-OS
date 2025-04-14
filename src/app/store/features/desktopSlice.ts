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
} = desktopSlice.actions;
export default desktopSlice.reducer;
