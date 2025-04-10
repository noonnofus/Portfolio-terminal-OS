import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const desktopSlice = createSlice({
  name: "desktop",
  initialState: {
    activeApp: "",
    focusApp: "",
    fullScreen: false,
    showAppMenu: false,
    showModal: true,
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
  },
});

export const {
  setActiveApp,
  setFoucsApp,
  setFullScreen,
  setShowAppMenu,
  setShowModal,
} = desktopSlice.actions;
export default desktopSlice.reducer;
