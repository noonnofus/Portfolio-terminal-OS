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
  },
  reducers: {
    setActiveApp: (state, action: PayloadAction<string>) => {
      state.activeApp = action.payload;
    },
    setFoucsApp: (state, action: PayloadAction<string>) => {
      state.focusApp = action.payload;
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
  setFullScreen,
  setShowAppMenu,
  setShowModal,
  setUserRole,
} = desktopSlice.actions;
export default desktopSlice.reducer;
