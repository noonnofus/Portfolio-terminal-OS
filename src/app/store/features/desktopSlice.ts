import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const desktopSlice = createSlice({
  name: "desktop",
  initialState: {
    activeApp: "",
    focusApp: "",
    fullScreen: true,
    showAppMenu: false,
    showModal: true,
    userRole: "",
    openApps: <string[]>[],
  },
  reducers: {
    setActiveApp: (state, action: PayloadAction<string>) => {
      state.activeApp = action.payload;
      if (!state.openApps.includes(action.payload)) {
        // ToDo: check if the openApps store multiple same apps. - currently, the same app is opening multiple tiems and not able to delete it.
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
    setFullScreen: (state, action: PayloadAction<boolean>) => {
      state.fullScreen = action.payload;
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
  setActiveApp,
  setFoucsApp,
  closeApp,
  setFullScreen,
  setShowAppMenu,
  setShowModal,
  setUserRole,
} = desktopSlice.actions;
export default desktopSlice.reducer;
